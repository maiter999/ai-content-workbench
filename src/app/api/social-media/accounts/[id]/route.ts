import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


// 获取单个账号
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        stats: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        comments: {
          where: { status: 'pending' },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!account) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error('获取账号详情失败:', error)
    return NextResponse.json({ error: '获取账号详情失败' }, { status: 500 })
  }
}

// 更新账号
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { platform, accountName, accountId, cookies, token, status } = body

    // 检查账号是否存在且属于当前用户
    const existing = await prisma.socialAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    // 更新账号
    const account = await prisma.socialAccount.update({
      where: { id: params.id },
      data: {
        ...(platform && { platform }),
        ...(accountName && { accountName }),
        ...(accountId !== undefined && { accountId }),
        ...(cookies !== undefined && { cookies }),
        ...(token !== undefined && { token }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ account })
  } catch (error) {
    console.error('更新账号失败:', error)
    return NextResponse.json({ error: '更新账号失败' }, { status: 500 })
  }
}

// 删除账号
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    // 检查账号是否存在且属于当前用户
    const existing = await prisma.socialAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    // 删除账号（级联删除 stats, posts, comments）
    await prisma.socialAccount.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除账号失败:', error)
    return NextResponse.json({ error: '删除账号失败' }, { status: 500 })
  }
}
