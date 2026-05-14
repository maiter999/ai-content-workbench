'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Wallet, CheckCircle, User, Shield } from 'lucide-react'

type TabType = 'account' | 'recharge' | 'settings'

// 充值套餐
const rechargePackages = [
  { id: 'p1', credits: 880, price: 59, label: '' },
  { id: 'p2', credits: 3500, price: 229, label: '推荐', popular: true },
  { id: 'p3', credits: 7400, price: 499, label: '超值', popular: true },
]

interface Transaction {
  id: string
  type: 'recharge' | 'consume'
  amount: number
  balance: number
  description: string
  platform?: string
  createdAt: string
}

function AccountContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [balance, setBalance] = useState(0)  // 从API获取
  const [transactions, setTransactions] = useState<Transaction[]>([])  // 从API获取
  const [isLoading, setIsLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'alipay'>('alipay')
  const [selectedPkg, setSelectedPkg] = useState('p2')

  // 获取用户余额和消费记录
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 获取用户信息（包含余额）
        const userRes = await fetch('/api/user/info')
        const userData = await userRes.json()
        if (userData.credits !== undefined) {
          setBalance(userData.credits)
        }

        // 获取交易记录（消费记录）
        const txRes = await fetch('/api/transactions?limit=20&type=consume')
        const txData = await txRes.json()
        if (txData.transactions) {
          setTransactions(txData.transactions)
        }
      } catch (error) {
        console.error('获取用户数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // 根据 URL 参数自动切换 Tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'recharge') {
      setActiveTab('recharge')
    } else if (tab === 'settings') {
      setActiveTab('settings')
    }
  }, [searchParams])

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}/${day} ${hours}:${minutes}`
  }

  // 获取操作类型名称
  const getOperationName = (description: string, platform?: string) => {
    if (description.includes('充值')) return '充值'
    if (platform === 'xiaohongshu') return '小红书'
    if (platform === 'wechat') return '公众号'
    if (platform === 'moments') return '朋友圈'
    if (platform === 'douyin') return '抖音'
    if (platform === 'miniprogram') return '小程序'
    return description || '文章生成'
  }

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
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 收款码弹窗 */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4 text-center">扫码支付</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 mx-auto" />
                <p className="text-sm text-gray-500 text-center mt-3">
                  请使用支付宝扫码支付
                </p>
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
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
              activeTab === 'settings'
                ? 'text-amber-600 border-amber-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              账户设置
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
                {isLoading ? (
                  <div className="py-8 text-center text-gray-400">加载中...</div>
                ) : transactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">暂无消费记录</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">类型</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">平台</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">积分</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {tx.type === 'recharge' ? (
                              <span className="text-green-600">充值</span>
                            ) : (
                              <span className="text-gray-700">消费</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">
                            {getOperationName(tx.description, tx.platform)}
                          </td>
                          <td className="px-5 py-3 text-sm text-right">
                            <span className={tx.type === 'recharge' ? 'text-green-600' : 'text-gray-700'}>
                              {tx.type === 'recharge' ? '+' : ''}{tx.amount}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-400 text-right">
                            {formatDate(tx.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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

        {/* 账户设置 Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">账户设置</h1>
              <p className="text-sm text-gray-500 mt-1">个人信息 · 安全设置</p>
            </div>

            {/* 个人信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">个人信息</h3>
              </div>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm text-gray-500 block mb-1.5">邮箱</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1.5">密码</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-200">
              保存设置
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <AccountContent />
    </Suspense>
  )
}
