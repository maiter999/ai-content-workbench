import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTransaction } from '@/lib/transactions'
import { PACKAGES, isAlipayConfigured } from '@/lib/alipay'
import { createEpayOrder } from '@/lib/epay'

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

    // 优先使用易支付（个人可申请）
    const epayPid = process.env.EPAY_PID
    const epayKey = process.env.EPAY_KEY

    if (epayPid && epayKey) {
      // 易支付已配置
      try {
        const gateway = paymentMethod === 'alipay' ? 'alipay' : 'wxpay'
        const payResult = await createEpayOrder(
          order.id,
          pkg.price,
          `AI内容工坊-${pkg.name}`,
          gateway
        )

        return NextResponse.json({
          orderId: order.id,
          amount: pkg.price,
          credits: pkg.credits,
          payUrl: payResult.payUrl,
          qrCodeUrl: payResult.qrCodeUrl,
          paymentMethod: 'epay',
          message: '请使用支付宝/微信扫码支付'
        })
      } catch (error) {
        console.error('易支付下单失败:', error)
        // 易支付失败，降级为模拟支付
      }
    }

    // 尝试支付宝
    if (paymentMethod === 'alipay' && isAlipayConfigured()) {
      try {
        const alipay = await import('@/lib/alipay')
        const payResult = await alipay.default.exec(
          'alipay.trade.app.pay',
          {
            bizContent: {
              outTradeNo: order.id,
              totalAmount: (pkg.price / 100).toFixed(2),
              subject: `AI内容工坊-${pkg.name}`,
              productCode: 'QUICK_MSECURITY_PAY',
            }
          },
          { log: console }
        )

        return NextResponse.json({
          orderId: order.id,
          amount: pkg.price,
          credits: pkg.credits,
          paymentData: payResult,
          paymentMethod: 'alipay',
          message: '唤起支付宝支付'
        })
      } catch (error) {
        console.error('支付宝下单失败:', error)
      }
    }

    // 降级为模拟支付
    return NextResponse.json({
      orderId: order.id,
      amount: pkg.price,
      credits: pkg.credits,
      paymentUrl: `/api/payments/${order.id}/pay?method=simulate`,
      paymentMethod: 'simulate',
      message: '当前为模拟支付（测试环境）'
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
}

// 模拟支付回调 / 易支付回调 / 支付宝回调
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

    if (success || order.status === 'paid') {
      // 支付成功：更新订单状态 + 增加用户积分 + 创建交易记录
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', updatedAt: new Date() }
      })

      await createTransaction(
        order.userId,
        'recharge',
        order.credits,
        `充值积分（${order.packageId}套餐）`
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

// GET: 接收易支付/支付宝异步通知
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 易支付回调
    if (searchParams.has('trade_no') || searchParams.has('out_trade_no')) {
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      try {
        const epay = await import('@/lib/epay')
        const result = epay.processEpayNotify(params)

        if (result.success) {
          // 更新订单
          const order = await prisma.order.findUnique({
            where: { id: result.orderId }
          })

          if (order && order.status !== 'paid') {
            await prisma.order.update({
              where: { id: result.orderId },
              data: { status: 'paid', updatedAt: new Date() }
            })

            await createTransaction(
              order.userId,
              'recharge',
              order.credits,
              `充值积分（${order.packageId}套餐）- ${result.tradeNo}`
            )
          }

          return new NextResponse('success', { status: 200 })
        }
      } catch (e) {
        console.error('易支付回调处理失败:', e)
      }
    }

    // 支付宝回调
    if (searchParams.has('app_id') || searchParams.has('trade_no')) {
      const params: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      try {
        const alipay = await import('@/lib/alipay')
        if (alipay.verifyAlipaySign(params)) {
          const tradeStatus = params['trade_status']
          
          if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
            const outTradeNo = params['out_trade_no']
            const order = await prisma.order.findUnique({
              where: { id: outTradeNo }
            })

            if (order && order.status !== 'paid') {
              await prisma.order.update({
                where: { id: outTradeNo },
                data: { status: 'paid', updatedAt: new Date() }
              })

              await createTransaction(
                order.userId,
                'recharge',
                order.credits,
                `充值积分（${order.packageId}套餐）- ${params['trade_no']}`
              )
            }
          }

          return new NextResponse('success', { status: 200 })
        }
      } catch (e) {
        console.error('支付宝回调处理失败:', e)
      }
    }

    return new NextResponse('error', { status: 400 })
  } catch (error) {
    console.error('Payment notify error:', error)
    return new NextResponse('error', { status: 500 })
  }
}
