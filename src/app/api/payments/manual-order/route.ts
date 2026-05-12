import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 创建手动订单（用于个人收款码模式）
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { packageId, credits, amount } = body

    if (!packageId || !credits || !amount) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId,
        amount,
        credits,
        status: 'pending',
        paymentMethod: 'manual'
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      packageName: packageId,
      amount,
      credits
    })

  } catch (error) {
    console.error('Create manual order error:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
}
