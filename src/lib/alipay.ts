// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AlipaySdk } = require('alipay-sdk')

// 支付套餐配置（单位：分）
export const PACKAGES = {
  basic: { credits: 500, price: 9900, name: '基础套餐' },
  standard: { credits: 1500, price: 29900, name: '标准套餐' },
  pro: { credits: 5000, price: 49900, name: '专业套餐' }
}

// 延迟创建 SDK 实例
let alipaySdkInstance: InstanceType<typeof AlipaySdk> | null = null

function getAlipaySdk() {
  if (!alipaySdkInstance) {
    if (!process.env.ALIPAY_APP_ID || !process.env.ALIPAY_PRIVATE_KEY) {
      return null
    }
    alipaySdkInstance = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID,
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
      alipayPublicKey: process.env.ALIPAY_ALIPAY_PUBLIC_KEY,
      signType: 'RSA2',
    })
  }
  return alipaySdkInstance
}

export default {
  exec: async (api: string, params: Record<string, unknown>, options?: Record<string, unknown>) => {
    const sdk = getAlipaySdk()
    if (!sdk) {
      throw new Error('支付宝 SDK 未初始化，请检查环境变量')
    }
    return sdk.exec(api, params, options)
  },
  checkNotifySign: (params: Record<string, string>) => {
    const sdk = getAlipaySdk()
    if (!sdk) {
      return false
    }
    return sdk.checkNotifySign(params)
  }
}

/**
 * 检查支付宝是否已配置
 */
export function isAlipayConfigured(): boolean {
  return !!(process.env.ALIPAY_APP_ID && process.env.ALIPAY_PRIVATE_KEY)
}

/**
 * 创建支付宝订单
 */
export async function createAlipayOrder(orderId: string, amount: number, subject: string) {
  if (!isAlipayConfigured()) {
    throw new Error('支付宝配置不完整，请检查环境变量')
  }

  const sdk = getAlipaySdk()!
  const result = await sdk.exec(
    'alipay.trade.app.pay',
    {
      bizContent: {
        outTradeNo: orderId,
        totalAmount: (amount / 100).toFixed(2),
        subject: subject,
        productCode: 'QUICK_MSECURITY_PAY',
      }
    },
    { log: console }
  )

  return result
}

/**
 * 验证支付宝回调签名
 */
export function verifyAlipaySign(params: Record<string, string>): boolean {
  const sdk = getAlipaySdk()
  if (!sdk) {
    return false
  }
  try {
    return sdk.checkNotifySign(params)
  } catch {
    return false
  }
}

/**
 * 查询订单状态
 */
export async function queryAlipayOrder(outTradeNo: string) {
  if (!isAlipayConfigured()) {
    throw new Error('支付宝配置不完整')
  }

  const sdk = getAlipaySdk()!
  const result = await sdk.exec(
    'alipay.trade.query',
    {
      bizContent: {
        outTradeNo
      }
    }
  )

  return result
}
