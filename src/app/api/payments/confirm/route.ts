import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTransaction } from '@/lib/transactions'

// 确认手动支付（用于个人收款码模式）
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: '缺少订单ID' }, { status: 400 })
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }

    // 检查订单是否属于当前用户
    if (order.userId !== user.id) {
      return NextResponse.json({ error: '无权操作此订单' }, { status: 403 })
    }

    // 检查订单状态
    if (order.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: '订单已完成，积分已到账'
      })
    }

    if (order.status === 'failed') {
      return NextResponse.json({
        success: false,
        message: '订单已失效，请重新下单'
      })
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid', updatedAt: new Date() }
    })

    // 增加用户积分
    await createTransaction(
      user.id,
      'recharge',
      order.credits,
      `充值积分（${order.packageId}套餐）- 扫码支付`
    )

    return NextResponse.json({
      success: true,
      message: '支付确认成功，积分已到账',
      credits: order.credits
    })

  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.json(
      { error: '确认支付失败' },
      { status: 500 }
    )
  }
}
