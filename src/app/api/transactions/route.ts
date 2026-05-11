import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // 可选：筛选类型 'recharge' | 'consume'

    const where: any = { userId: user.id }
    if (type) {
      where.type = type
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: '获取交易记录失败' },
      { status: 500 }
    )
  }
}

// 创建交易记录（内部调用，不对外暴露）
export async function createTransaction(
  userId: string,
  type: 'recharge' | 'consume',
  amount: number,
  description: string,
  platform?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  const balance = user.credits + amount
  if (balance < 0) {
    throw new Error('积分不足')
  }

  // 更新用户积分
  await prisma.user.update({
    where: { id: userId },
    data: { credits: balance }
  })

  // 创建交易记录
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type,
      amount,
      balance,
      description,
      platform
    }
  })

  return transaction
}
