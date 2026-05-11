import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id }
    })

    // 统计今天生成的内容
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayContents = await prisma.content.count({
      where: {
        userId: user.id,
        createdAt: { gte: today }
      }
    })

    // 统计本月生成的内容
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthContents = await prisma.content.count({
      where: {
        userId: user.id,
        createdAt: { gte: monthStart }
      }
    })

    // 获取最近的内容
    const recentContents = await prisma.content.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        topic: true,
        platforms: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      credits: userData?.credits || 0,
      plan: userData?.plan || 'free',
      todayContents,
      monthContents,
      recentContents
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: '获取统计失败' },
      { status: 500 }
    )
  }
}
