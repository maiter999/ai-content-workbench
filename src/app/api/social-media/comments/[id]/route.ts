import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: params.id,
        account: {
          userId: user.id,
        },
      },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
            platform: true,
          },
        },
        post: true,
      },
    })

    if (!comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 })
  }
}

// 更新评论（回复、更新状态）
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
    const { reply, status } = body

    // 检查评论是否存在且属于当前用户
    const existing = await prisma.comment.findFirst({
      where: {
        id: params.id,
        account: {
          userId: user.id,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 })
    }

    // 更新评论
    const updateData: any = { updatedAt: new Date() }

    if (reply !== undefined) {
      updateData.reply = reply
      updateData.repliedAt = new Date()
      updateData.status = 'replied'
    }

    if (status !== undefined) {
      updateData.status = status
    }

    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('更新评论失败:', error)
    return NextResponse.json({ error: '更新评论失败' }, { status: 500 })
  }
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    // 检查评论是否存在且属于当前用户
    const existing = await prisma.comment.findFirst({
      where: {
        id: params.id,
        account: {
          userId: user.id,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 })
    }

    // 删除评论
    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除评论失败:', error)
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 })
  }
}
