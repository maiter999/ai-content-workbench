import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


// 获取账号列表
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('获取账号列表失败:', error)
    return NextResponse.json({ error: '获取账号列表失败' }, { status: 500 })
  }
}

// 添加账号
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { platform, accountName, accountId, cookies, token } = body

    // 验证必填字段
    if (!platform || !accountName) {
      return NextResponse.json({ error: '平台和账号名称不能为空' }, { status: 400 })
    }

    // 检查是否已存在
    const existing = await prisma.socialAccount.findFirst({
      where: {
        userId: user.id,
        platform,
        accountId: accountId || null,
      },
    })

    if (existing) {
      return NextResponse.json({ error: '该账号已添加' }, { status: 400 })
    }

    // 创建账号
    const account = await prisma.socialAccount.create({
      data: {
        userId: user.id,
        platform,
        accountName,
        accountId,
        cookies,
        token,
      },
    })

    return NextResponse.json({ account })
  } catch (error) {
    console.error('添加账号失败:', error)
    return NextResponse.json({ error: '添加账号失败' }, { status: 500 })
  }
}
