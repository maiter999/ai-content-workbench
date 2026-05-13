import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


// 获取统计数据
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // 构建查询条件
    const where: any = {
      account: {
        userId: user.id,
      },
    }

    if (accountId) {
      where.accountId = accountId
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        where.date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo)
      }
    }

    // 获取统计数据
    const stats = await prisma.accountStats.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
            platform: true,
          },
        },
      },
    })

    // 计算汇总数据
    const summary = stats.reduce(
      (acc, stat) => {
        acc.postsCount += stat.postsCount
        acc.views += stat.views
        acc.comments += stat.comments
        acc.shares += stat.shares
        acc.favorites += stat.favorites
        acc.followers += stat.followers
        return acc
      },
      {
        postsCount: 0,
        views: 0,
        comments: 0,
        shares: 0,
        favorites: 0,
        followers: 0,
      }
    )

    return NextResponse.json({ stats, summary })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}
