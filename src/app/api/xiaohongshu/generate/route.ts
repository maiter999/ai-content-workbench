import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildPrompt, type XiaohongshuStyle } from '@/lib/prompts/xiaohongshu'
import OpenAI from 'openai'

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
})

const modelMap = {
  fast: 'deepseek-chat',
  standard: 'deepseek-chat',
  think: 'deepseek-reasoner'
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { topic, contentStyle, industry, requirements, materials, modelLevel = 'standard' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: '请输入创作主题' }, { status: 400 })
    }

    // 检查积分
    const userData = await prisma.user.findUnique({ where: { id: user.id } })
    if (!userData || userData.credits < 1) {
      return NextResponse.json({ error: '积分不足，请充值' }, { status: 400 })
    }

    // 构建提示词
    const { systemPrompt, userPrompt } = buildPrompt(contentStyle as XiaohongshuStyle, {
      topic,
      industry,
      requirements,
      materials
    })

    // 调用 DeepSeek
    const model = modelMap[modelLevel as keyof typeof modelMap] || 'deepseek-chat'
    
    const response = await deepseek.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content || ''

    // 扣除积分
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } }
    })

    // 保存内容记录
    await prisma.content.create({
      data: {
        userId: user.id,
        title: topic,
        topic,
        body: content,
        status: 'draft'
      }
    })

    return NextResponse.json({
      success: true,
      content,
      remainingCredits: userData.credits - 1
    })
  } catch (error: any) {
    console.error('小红书生成失败:', error)
    return NextResponse.json(
      { error: error.message || '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
