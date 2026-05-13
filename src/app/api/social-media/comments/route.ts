import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取评论列表
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const status = searchParams.get('status')

    const where: any = {
      account: {
        userId: user.id,
      },
    }

    if (accountId) {
      where.accountId = accountId
    }

    if (status) {
      where.status = status
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 })
  }
}

// 添加评论（通常用于测试或手动添加）
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { accountId, postId, author, content } = body

    if (!accountId || !content) {
      return NextResponse.json({ error: '账号和评论内容不能为空' }, { status: 400 })
    }

    // 检查账号是否属于当前用户
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
    })

    if (!account) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        accountId,
        postId,
        author,
        content,
      },
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('添加评论失败:', error)
    return NextResponse.json({ error: '添加评论失败' }, { status: 500 })
  }
}
