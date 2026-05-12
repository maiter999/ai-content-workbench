'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { CreditCard, Wallet, CheckCircle } from 'lucide-react'

type TabType = 'account' | 'recharge'

// 消费记录数据
const consumptionRecords = [
  { type: '对话', model: '标准', cost: 10.9, time: '04/29 15:11' },
  { type: '对话', model: '标准', cost: 11.6, time: '04/29 15:10' },
  { type: '文案生成', model: '标准', cost: 43.0, time: '04/28 15:11' },
  { type: '文案生成', model: '快速', cost: 32.5, time: '04/26 21:52' },
  { type: '对话', model: '标准', cost: 6.9, time: '04/26 21:51' },
  { type: '对话', model: '标准', cost: 7.3, time: '04/18 12:53' },
  { type: '对话', model: '标准', cost: 7.5, time: '04/18 12:53' },
  { type: '对话', model: '标准', cost: 12.5, time: '04/18 12:52' },
  { type: '搜索', model: 'search', cost: 7.5, time: '04/18 15:17' },
  { type: '对话', model: '标准', cost: 10.5, time: '04/13 17:40' },
  { type: '对话', model: '标准', cost: 9.3, time: '04/13 17:39' },
  { type: '文案生成', model: '标准', cost: 11.2, time: '04/13 17:37' },
  { type: '文案生成', model: '标准', cost: 40.4, time: '04/13 17:37' },
  { type: '文案生成', model: '标准', cost: 15.1, time: '04/13 17:37' },
  { type: '对话', model: '标准', cost: 38.7, time: '04/11 17:36' },
]

// 充值套餐
const rechargePackages = [
  { id: 'p1', credits: 880, price: 59, label: '' },
  { id: 'p2', credits: 3500, price: 229, label: '推荐', popular: true },
  { id: 'p3', credits: 7400, price: 499, label: '超值', popular: true },
]

export default function AccountPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [balance, setBalance] = useState(681)
  const [showQR, setShowQR] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay')
  const [selectedPkg, setSelectedPkg] = useState('p2')

  // 根据 URL 参数自动切换 Tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'recharge') {
      setActiveTab('recharge')
    }
  }, [searchParams])

  const handleRecharge = async () => {
    const pkg = rechargePackages.find(p => p.id === selectedPkg)
    if (!pkg) return

    await fetch('/api/payments/manual-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: pkg.id, credits: pkg.credits, amount: pkg.price })
    })
    setShowQR(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 收款码弹窗 */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-center">扫码支付</h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPaymentMethod('alipay')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${paymentMethod === 'alipay' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  支付宝
                </button>
                <button
                  onClick={() => setPaymentMethod('wechat')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${paymentMethod === 'wechat' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  微信
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="relative w-48 h-48 mx-auto bg-white rounded">
                  <Image
                    src={paymentMethod === 'alipay' ? '/alipay-qr.jpg' : '/wechat-qr.png'}
                    alt="收款码"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowQR(false)} className="flex-1 py-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  取消
                </button>
                <button
                  onClick={async () => {
                    await fetch('/api/payments/confirm', { method: 'POST' })
                    setShowQR(false)
                    alert('支付成功！')
                  }}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                >
                  已支付
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab切换 */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'account'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              我的账户
            </div>
          </button>
          <button
            onClick={() => setActiveTab('recharge')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'recharge'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              充值积分
            </div>
          </button>
        </div>

        {/* 我的账户 Tab */}
        {activeTab === 'account' && (
          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">我的账户</h1>
              <p className="text-sm text-gray-500 mt-1">余额查看 · 消费记录</p>
            </div>

            {/* 余额卡片 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">账户余额</p>
                <p className="text-3xl font-bold text-gray-900">{balance} <span className="text-base font-normal text-gray-600">积分</span></p>
              </div>
              <button
                onClick={() => setActiveTab('recharge')}
                className="px-6 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition flex items-center gap-1"
              >
                充值
                <span className="text-xs">+</span>
              </button>
            </div>

            {/* 消费记录表格 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">消费记录</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">类型</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">模型</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">费用</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumptionRecords.map((record, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="px-5 py-3 text-sm text-gray-700">{record.type}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{record.model}</td>
                        <td className="px-5 py-3 text-sm text-gray-700 text-right">{record.cost} 积分</td>
                        <td className="px-5 py-3 text-sm text-gray-400 text-right">{record.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 充值积分 Tab */}
        {activeTab === 'recharge' && (
          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">充值积分</h1>
              <p className="text-sm text-gray-500 mt-1">当前余额 {balance} 积分</p>
            </div>

            {/* 选择充值套餐 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">选择充值套餐</h3>
              <div className="grid grid-cols-3 gap-4">
                {rechargePackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg.id)}
                    className={`relative p-5 rounded-xl border-2 text-center transition ${
                      selectedPkg === pkg.id
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pkg.label && (
                      <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full ${
                        pkg.popular ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {pkg.label}
                      </span>
                    )}
                    <p className="text-2xl font-bold text-amber-600">{pkg.credits}</p>
                    <p className="text-xs text-gray-500 mt-1">积分</p>
                    <p className="text-lg font-bold text-gray-900 mt-3">¥{pkg.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 支付方式 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">支付方式</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod('alipay')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition ${
                    paymentMethod === 'alipay'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {paymentMethod === 'alipay' && <CheckCircle className="w-4 h-4" />}
                  <span className="text-sm font-medium">支付宝</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('wechat')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition ${
                    paymentMethod === 'wechat'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {paymentMethod === 'wechat' && <CheckCircle className="w-4 h-4" />}
                  <span className="text-sm font-medium">微信支付</span>
                </button>
              </div>
            </div>

            {/* 确认支付按钮 */}
            <button
              onClick={handleRecharge}
              className="w-full py-3.5 bg-amber-500 text-white rounded-xl text-base font-medium hover:bg-amber-600 transition shadow-lg shadow-amber-200"
            >
              确认支付，获得 {rechargePackages.find(p => p.id === selectedPkg)?.credits} 积分
            </button>

            <p className="text-xs text-gray-400 text-center">
              充值即表示您同意《用户协议》和《隐私政策》
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
