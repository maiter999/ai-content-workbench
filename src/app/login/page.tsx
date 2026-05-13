'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登录失败，请检查邮箱和密码')
        setLoading(false)
        return
      }

      // 登录成功，跳转到 Dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      setError('网络错误，请检查网络连接后重试')
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '注册失败，请稍后重试')
        setLoading(false)
        return
      }

      // 注册成功，跳转到 Dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      setError('网络错误，请检查网络连接后重试')
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  return (
    <div className="min-h-screen flex">
      {/* 左侧 - 品牌展示 */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a2e] flex-col justify-between p-12 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="豹纹工坊" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-white text-xl font-semibold">豹纹工坊</span>
        </div>

        {/* 主内容 */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI自媒体群系统
          </h1>
          <h2 className="text-3xl font-bold text-purple-400 mb-6">
            多平台一键出稿
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            一个主题，五个平台同时出稿，小红书、公众号、朋友圈、抖音 — 全部搞定
          </p>
        </div>

        {/* 底部版本号 */}
        <div className="relative z-10 text-gray-600 text-sm">
          V2.0
        </div>
      </div>

      {/* 右侧 - 表单区域 */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="豹纹工坊" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-gray-900 text-xl font-semibold">豹纹工坊</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? '登录' : '注册'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? '输入邮箱和密码登录' : '创建账号，开始创作之旅'}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称（选填）
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="你的昵称"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="your@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    忘记密码?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder={isLogin ? '输入密码' : '至少6个字符'}
                required
                disabled={loading}
                minLength={isLogin ? undefined : 6}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="再次输入密码"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isLogin ? '登录中...' : '注册中...') : (isLogin ? '登录' : '注册')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? '没有账号？' : '已有账号？'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-orange-500 font-medium hover:text-orange-600"
              >
                {isLogin ? '注册' : '登录'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
