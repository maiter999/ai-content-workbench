import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取可发布的文章列表
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    // 获取用户的文章
    const contents = await prisma.content.findMany({
      where: {
        userId: user.id,
        status: 'published', // 只获取已发布的文章
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    // 如果指定了账号，获取该账号信息
    let account = null
    if (accountId) {
      account = await prisma.socialAccount.findFirst({
        where: {
          id: accountId,
          userId: user.id,
        },
      })
    }

    return NextResponse.json({ contents, account })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 })
  }
}

// 执行群发
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { contentId, accountIds, scheduleAt } = body

    // 验证必填字段
    if (!contentId || !accountIds || accountIds.length === 0) {
      return NextResponse.json({ error: '文章和账号不能为空' }, { status: 400 })
    }

    // 检查文章是否存在且属于当前用户
    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        userId: user.id,
      },
    })

    if (!content) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 检查账号是否存在且属于当前用户
    const accounts = await prisma.socialAccount.findMany({
      where: {
        id: { in: accountIds },
        userId: user.id,
      },
    })

    if (accounts.length !== accountIds.length) {
      return NextResponse.json({ error: '部分账号不存在' }, { status: 400 })
    }

    // TODO: 调用爬虫 API 发布文章到各平台
    // 如果有 scheduleAt，则创建定时任务
    const results = []

    for (const account of accounts) {
      try {
        // 模拟发布（实际应该调用爬虫 API）
        console.log(`发布文章 "${content.title}" 到账号 "${account.accountName}" (${account.platform})`)

        // 这里应该调用对应的爬虫 API
        // await publishToPlatform(account, content, account.platform)

        results.push({
          accountId: account.id,
          accountName: account.accountName,
          platform: account.platform,
          success: true,
          message: '发布成功（模拟）',
        })
      } catch (error: any) {
        results.push({
          accountId: account.id,
          accountName: account.accountName,
          platform: account.platform,
          success: false,
          message: error.message || '发布失败',
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `成功发布到 ${results.filter(r => r.success).length} 个账号`,
    })
  } catch (error) {
    console.error('群发失败:', error)
    return NextResponse.json({ error: '群发失败' }, { status: 500 })
  }
}
