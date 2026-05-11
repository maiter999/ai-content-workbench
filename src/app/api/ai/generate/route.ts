import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateContent, type Platform } from '@/lib/deepseek'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { topic, platforms, tone, length } = await request.json()

    if (!topic || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: '请填写主题并选择至少一个平台' },
        { status: 400 }
      )
    }

    // 检查积分
    const userData = await prisma.user.findUnique({ where: { id: user.id } })
    if (!userData || userData.credits < platforms.length) {
      return NextResponse.json(
        { error: '积分不足，请联系客服' },
        { status: 400 }
      )
    }

    // 生成内容
    const results = await generateContent({
      topic,
      platforms: platforms as Platform[],
      tone,
      length
    })

    // 扣除积分
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: platforms.length } }
    })

    // 保存内容记录
    const content = await prisma.content.create({
      data: {
        userId: user.id,
        title: topic,
        topic,
        platforms: JSON.stringify(platforms),
        status: 'draft'
      }
    })

    return NextResponse.json({
      success: true,
      contentId: content.id,
      results,
      remainingCredits: userData.credits - platforms.length
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
