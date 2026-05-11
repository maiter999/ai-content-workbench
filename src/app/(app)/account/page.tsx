'use client'

import { useState, useEffect } from 'react'

interface Transaction {
  id: string
  type: 'consume' | 'recharge'
  amount: number
  balance: number
  description: string
  platform?: string
  createdAt: string
}

interface Package {
  id: string
  name: string
  credits: number
  price: number
  perCredit: number
  popular?: boolean
  features: string[]
}

export default function AccountPage() {
  const [balance, setBalance] = useState(0)
  const [plan, setPlan] = useState('free')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState('standard')

  const packages: Package[] = [
    { id: 'basic', name: '基础套餐', credits: 500, price: 99, perCredit: 0.20, features: ['有效期30天', '基础功能'] },
    { id: 'standard', name: '标准套餐', credits: 1500, price: 299, perCredit: 0.20, popular: true, features: ['有效期90天', '高级功能', '优先队列'] },
    { id: 'pro', name: '专业套餐', credits: 5000, price: 499, perCredit: 0.10, features: ['有效期180天', '全部功能', '专属客服'] },
  ]

  // 加载用户信息和交易记录
  useEffect(() => {
    fetchUserData()
    fetchTransactions()
  }, [page])

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setBalance(data.user.credits)
        setPlan(data.user.plan)
      }
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/transactions?page=${page}&limit=10`)
      const data = await res.json()
      if (data.transactions) {
        setTransactions(data.transactions)
        setTotalTransactions(data.total)
      }
    } catch (err) {
      console.error('获取交易记录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecharge = () => {
    alert('支付功能开发中，即将上线！')
    // TODO: Task #15 实现支付系统
  }

  const handleBuyPackage = async () => {
    const pkg = packages.find(p => p.id === selectedPackage)
    if (!pkg) return

    alert(`支付功能开发中！\n\n套餐：${pkg.name}\n积分：${pkg.credits}\n价格：¥${pkg.price}`)
    // TODO: Task #15 实现支付系统
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(totalTransactions / 10)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的账户</h1>
        <p className="text-gray-600 mt-1">管理您的账户余额和消费记录</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Balance & Recharge */}
        <div className="col-span-1 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-80 mb-2">账户余额</div>
            <div className="text-4xl font-bold mb-4">{balance} <span className="text-xl">积分</span></div>
            <div className="flex gap-3">
              <button 
                onClick={handleRecharge}
                className="flex-1 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition"
              >
                充值
              </button>
              <button 
                onClick={handleBuyPackage}
                className="flex-1 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition"
              >
                购买套餐
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">账户信息</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">当前套餐</span>
                <span className="font-medium capitalize">{plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">累计交易</span>
                <span className="font-medium text-gray-900">{totalTransactions} 笔</span>
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">推荐套餐</h3>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    selectedPackage === pkg.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{pkg.name}</span>
                    <div className="flex items-center gap-2">
                      {pkg.popular && (
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                          推荐
                        </span>
                      )}
                      <span className="font-bold text-purple-600">¥{pkg.price}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {pkg.credits} 积分 · ¥{pkg.perCredit}/积分
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={handleBuyPackage}
              className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            >
              立即购买
            </button>
          </div>
        </div>

        {/* Right - Transaction History */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">消费记录</h2>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                  <p>加载中...</p>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'recharge'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.type === 'recharge' ? '💰' : '📝'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.description}</p>
                          <p className="text-sm text-gray-500">
                            {tx.platform && `${tx.platform} · `}{formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>暂无交易记录</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg ${
                      page === p
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
