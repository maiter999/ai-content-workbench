'use client'

import { useState, useEffect } from 'react'

// 平台配置
const platforms = [
  { id: 'WECHAT_OFFICIAL', name: '公众号', icon: '💬', color: '#07C160', maxAccounts: 3 },
  { id: 'XIAOHONGSHU', name: '小红书', icon: '📕', color: '#FE2C55', maxAccounts: 3 },
  { id: 'XIAOLUSHU', name: '小绿书', icon: '📗', color: '#25D366', maxAccounts: 2 },
  { id: 'TOUTIAO', name: '头条号', icon: '🔴', color: '#ED4040', maxAccounts: 3 },
  { id: 'BAIJIA', name: '百家号', icon: '🔵', color: '#2932E1', maxAccounts: 1 },
  { id: 'ZHIHU', name: '知乎号', icon: '🔷', color: '#0084FF', maxAccounts: 3 },
  { id: 'WEIBO', name: '微博号', icon: '👁', color: '#E6162D', maxAccounts: 1 },
]

// 热门平台（全部6个）
const hotPlatforms = platforms

export default function SocialMediaAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null)
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string | null>(null) // 用于过滤的平台
  const [loginType, setLoginType] = useState<'qrcode' | 'sms' | 'password'>('qrcode')
  const [submitting, setSubmitting] = useState(false)

  // 登录表单
  const [loginForm, setLoginForm] = useState({
    phone: '',
    code: '',
    password: '',
  })

  // 获取账号列表
  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social-media/accounts')
      const data = await res.json()
      if (data.accounts) {
        setAccounts(data.accounts)
      }
    } catch (error) {
      console.error('获取账号列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取某平台的账号数量
  const getPlatformAccountCount = (platformId: string) => {
    return accounts.filter(a => a.platform === platformId).length
  }

  // 选择平台
  const handleSelectPlatform = (platform: any) => {
    setSelectedPlatform(platform)
    setShowPlatformModal(false)
    setShowLoginModal(true)
    setLoginType('qrcode')
    setLoginForm({ phone: '', code: '', password: '' })
  }

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 模拟登录成功，直接添加账号
      const res = await fetch('/api/social-media/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          accountName: loginForm.phone || `${selectedPlatform.name}账号${Date.now()}`,
          accountId: loginForm.phone || `auto_${Date.now()}`,
          status: 'active',
        }),
      })

      const data = await res.json()

      if (data.account) {
        setShowLoginModal(false)
        setSelectedPlatform(null)
        setLoginForm({ phone: '', code: '', password: '' })
        fetchAccounts()
      } else {
        alert(data.error || '添加失败')
      }
    } catch (error) {
      console.error('添加账号失败:', error)
      alert('添加失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 删除账号
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个账号吗？')) return

    try {
      const res = await fetch(`/api/social-media/accounts/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        fetchAccounts()
      } else {
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  // 计算总账号数
  const totalAccounts = accounts.length
  const maxTotalAccounts = platforms.reduce((sum, p) => sum + p.maxAccounts, 0)

  // 根据选中的平台过滤账号
  const filteredAccounts = selectedPlatformFilter
    ? accounts.filter(a => a.platform === selectedPlatformFilter)
    : accounts

  // 获取当前选中的平台信息
  const currentPlatform = selectedPlatformFilter
    ? platforms.find(p => p.id === selectedPlatformFilter)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 - 横向平台菜单 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <h2 className="text-lg font-bold">账号管理</h2>
              <p className="text-xs text-gray-500">管理你的自媒体账号 · 已添加 {totalAccounts} 个账号</p>
            </div>
            <button
              onClick={() => setShowPlatformModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm"
            >
              <span>+</span>
              <span>添加账号</span>
            </button>
          </div>
          <div className="flex gap-1 pb-0 -mb-px overflow-x-auto">
            <button
              onClick={() => setSelectedPlatformFilter(null)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                selectedPlatformFilter === null
                  ? 'border-purple-600 text-purple-700 bg-purple-50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              全部 ({totalAccounts})
            </button>
            {platforms.map((platform) => {
              const count = getPlatformAccountCount(platform.id)
              const isSelected = selectedPlatformFilter === platform.id
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatformFilter(isSelected ? null : platform.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'border-purple-600 text-purple-700 bg-purple-50 rounded-t-lg'
                      : count > 0
                      ? 'border-transparent text-gray-700 hover:bg-gray-50 rounded-t-lg'
                      : 'border-transparent text-gray-400 hover:bg-gray-50 rounded-t-lg'
                  }`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                  <span className={`text-xs ${count > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {count}/{platform.maxAccounts}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 下方 - 账号列表 */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* 页面标题和添加账号按钮 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {currentPlatform ? `${currentPlatform.icon} ${currentPlatform.name}` : '账号列表'}
            </h1>
            <p className="text-gray-500 mt-1">
              {currentPlatform
                ? `已添加 ${filteredAccounts.length} 个账号`
                : `共 ${totalAccounts} 个账号`}
            </p>
          </div>
          <button
            onClick={() => setShowPlatformModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <span>+</span>
            <span>添加账号</span>
          </button>
        </div>

        {/* 账号列表 */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : filteredAccounts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-400 mb-4">
              {selectedPlatformFilter ? '该平台还没有添加账号' : '还没有添加账号'}
            </p>
            <button
              onClick={() => setShowPlatformModal(true)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              添加第一个账号 →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAccounts.map((account) => {
              const platform = platforms.find(p => p.id === account.platform)
              return (
                <div key={account.id} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{platform?.icon || '📱'}</span>
                    <div>
                      <h3 className="font-semibold">{account.accountName}</h3>
                      <p className="text-sm text-gray-500">{platform?.name || account.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      account.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                    }`}>
                      {account.status === 'active' ? '活跃' : '已禁用'}
                    </span>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-sm text-red-600 hover:text-red-700 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 平台选择弹窗 */}
      {showPlatformModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">添加账号</h2>
                <span className="text-sm text-gray-500">
                  已添加账号数：<span className="text-green-600">{totalAccounts}</span> / {maxTotalAccounts}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索平台"
                    className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <button
                  onClick={() => setShowPlatformModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 内容 */}
            <div className="p-4">
              {/* 平台列表 */}
              <div className="grid grid-cols-4 gap-4">
                {hotPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleSelectPlatform(platform)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition border border-gray-200"
                  >
                    <span className="text-4xl">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.name}</span>
                    <span className="text-xs text-gray-400">{platform.maxAccounts}个账号</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      {showLoginModal && selectedPlatform && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold">{selectedPlatform.name}</h2>
              <div className="flex items-center gap-3">
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  清空缓存重新加载
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false)
                    setSelectedPlatform(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 提示 */}
            <div className="bg-orange-50 border border-orange-200 mx-4 mt-4 p-3 rounded-lg">
              <p className="text-sm text-orange-700">
                首次登录的{selectedPlatform.name}号可能会频繁掉线，通常将在重登2-3次后趋于稳定
              </p>
            </div>

            {/* 登录方式切换 */}
            <div className="flex justify-center gap-8 mt-6 mb-4">
              <button
                onClick={() => setLoginType('qrcode')}
                className={`pb-2 text-sm font-medium ${
                  loginType === 'qrcode'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500'
                }`}
              >
                扫码登录
              </button>
              <button
                onClick={() => setLoginType('sms')}
                className={`pb-2 text-sm font-medium ${
                  loginType === 'sms'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500'
                }`}
              >
                验证码登录
              </button>
              <button
                onClick={() => setLoginType('password')}
                className={`pb-2 text-sm font-medium ${
                  loginType === 'password'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500'
                }`}
              >
                密码登录
              </button>
            </div>

            {/* 登录表单 */}
            <div className="p-6">
              {loginType === 'qrcode' && (
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-500">二维码区域</p>
                      <p className="text-xs text-gray-400 mt-1">打开{selectedPlatform.name}APP扫码</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    打开「{selectedPlatform.name}APP」点击左上角扫一扫
                  </p>
                </div>
              )}

              {loginType === 'sms' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>+86</option>
                    </select>
                    <input
                      type="tel"
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                      placeholder="请输入手机号"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={loginForm.code}
                      onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })}
                      placeholder="请输入验证码"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-sm text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
                    >
                      获取验证码
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-pink-400 text-white rounded-lg font-medium hover:bg-pink-500 transition disabled:opacity-50"
                  >
                    {submitting ? '登录中...' : '登录'}
                  </button>
                </form>
              )}

              {loginType === 'password' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="请输入手机号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="请输入密码"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-pink-400 text-white rounded-lg font-medium hover:bg-pink-500 transition disabled:opacity-50"
                  >
                    {submitting ? '登录中...' : '登录'}
                  </button>
                </form>
              )}
            </div>

            {/* 底部 */}
            <div className="text-center pb-4 text-xs text-gray-400">
              登录即代表同意 <span className="text-gray-600">用户协议</span> 和 <span className="text-gray-600">隐私政策</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
