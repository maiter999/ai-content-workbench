import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取用户最近生成的内容
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    const contents = await prisma.content.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        topic: true,
        platforms: true,
        createdAt: true
      }
    })

    // 格式化返回数据
    const recentContents = contents.map((item, index) => {
      let platforms: string[] = []
      try {
        platforms = JSON.parse(item.platforms || '[]')
      } catch (e) {}

      // 计算相对时间
      const now = new Date()
      const created = new Date(item.createdAt)
      const diffMs = now.getTime() - created.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      let timeStr = '刚刚'
      if (diffDays > 0) timeStr = `${diffDays}天前`
      else if (diffHours > 0) timeStr = `${diffHours}小时前`
      else if (diffMins > 0) timeStr = `${diffMins}分钟前`

      return {
        id: item.id,
        title: item.title || item.topic || '未命名内容',
        platform: platforms[0] || '综合',
        time: timeStr
      }
    })

    return NextResponse.json({
      success: true,
      contents: recentContents,
      count: recentContents.length
    })
  } catch (error) {
    console.error('Get recent contents error:', error)
    return NextResponse.json(
      { error: '获取内容失败', contents: [] },
      { status: 500 }
    )
  }
}
