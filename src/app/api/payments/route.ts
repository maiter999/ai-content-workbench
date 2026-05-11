import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTransaction } from '@/lib/transactions'

const PACKAGES = {
  basic: { credits: 500, price: 9900 }, // 价格单位：分
  standard: { credits: 1500, price: 29900 },
  pro: { credits: 5000, price: 49900 }
}

// 创建支付订单
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { packageId, paymentMethod } = body

    if (!packageId || !PACKAGES[packageId as keyof typeof PACKAGES]) {
      return NextResponse.json({ error: '无效的套餐' }, { status: 400 })
    }

    if (!paymentMethod || !['wechat', 'alipay'].includes(paymentMethod)) {
      return NextResponse.json({ error: '无效的支付方式' }, { status: 400 })
    }

    const pkg = PACKAGES[packageId as keyof typeof PACKAGES]

    // 创建订单
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId,
        amount: pkg.price,
        credits: pkg.credits,
        status: 'pending',
        paymentMethod
      }
    })

    // TODO: 调用真实支付SDK（微信支付/支付宝）
    // 目前返回模拟的支付链接
    const paymentUrl = `/api/payments/${order.id}/pay`

    return NextResponse.json({
      orderId: order.id,
      amount: pkg.price,
      credits: pkg.credits,
      paymentUrl, // 前端跳转到此URL进行支付
      message: '支付功能开发中，当前为模拟支付'
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
}

// 模拟支付回调（测试用）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, success } = body

    if (!orderId) {
      return NextResponse.json({ error: '缺少订单ID' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }

    if (success) {
      // 支付成功：更新订单状态 + 增加用户积分 + 创建交易记录
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', updatedAt: new Date() }
      })

      await createTransaction(
        order.userId,
        'charge',
        order.credits,
        `充值积分（${order.packageId}套餐）`,
        undefined
      )

      return NextResponse.json({ success: true, message: '支付成功，积分已到账' })
    } else {
      // 支付失败
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'failed', updatedAt: new Date() }
      })

      return NextResponse.json({ success: false, message: '支付失败' })
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { error: '处理支付回调失败' },
      { status: 500 }
    )
  }
}
