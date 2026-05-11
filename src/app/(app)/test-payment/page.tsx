'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Package {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
}

export default function TestPaymentPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const packages: Package[] = [
    { id: 'basic', name: '基础套餐', credits: 500, price: 99 },
    { id: 'standard', name: '标准套餐', credits: 1500, price: 299, popular: true },
    { id: 'pro', name: '专业套餐', credits: 5000, price: 499 }
  ]

  const handleTestPay = async () => {
    setLoading(true)
    setResult(null)

    try {
      // 1. 创建订单
      const orderRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          paymentMethod
        })
      })

      const orderData = await orderRes.json()
      
      if (!orderRes.ok) {
        throw new Error(orderData.error || '创建订单失败')
      }

      // 2. 模拟支付（直接调用回调）
      const payRes = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          success: true
        })
      })

      const payData = await payRes.json()

      if (payRes.ok && payData.success) {
        setResult({
          success: true,
          message: `支付成功！获得 ${packages.find(p => p.id === selectedPackage)?.credits} 积分`,
          orderId: orderData.orderId
        })
      } else {
        throw new Error('支付失败')
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || '支付失败'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🧪 模拟支付测试
        </h1>

        <p className="text-gray-600 text-center mb-8">
          这是一个测试页面，用于验证支付流程。不会真实扣款。
        </p>

        {/* 选择套餐 */}
        <div className="space-y-3 mb-6">
          <h2 className="font-medium text-gray-900 mb-2">选择套餐</h2>
          {packages.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition ${
                selectedPackage === pkg.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{pkg.name}</span>
                {pkg.popular && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                    推荐
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {pkg.credits} 积分 · ¥{pkg.price}
              </div>
            </button>
          ))}
        </div>

        {/* 选择支付方式 */}
        <div className="mb-6">
          <h2 className="font-medium text-gray-900 mb-2">支付方式</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('wechat')}
              className={`p-4 rounded-xl border-2 transition ${
                paymentMethod === 'wechat'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">💚</div>
                <div className="font-medium text-gray-900">微信支付</div>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod('alipay')}
              className={`p-4 rounded-xl border-2 transition ${
                paymentMethod === 'alipay'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">💙</div>
                <div className="font-medium text-gray-900">支付宝</div>
              </div>
            </button>
          </div>
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handleTestPay}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-medium text-lg transition ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              处理中...
            </span>
          ) : (
            `立即支付 ¥${packages.find(p => p.id === selectedPackage)?.price}`
          )}
        </button>

        {/* 结果展示 */}
        {result && (
          <div className={`mt-6 p-4 rounded-xl ${
            result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className="font-medium">{result.success ? '✅ ' : '❌ '}{result.message}</div>
            {result.orderId && (
              <div className="text-sm mt-1">订单号：{result.orderId}</div>
            )}
          </div>
        )}

        {/* 返回链接 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/account')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← 返回账户页面
          </button>
        </div>
      </div>
    </div>
  )
}
