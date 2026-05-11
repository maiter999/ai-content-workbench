'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  credits: number
  plan: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setName(data.user.name || '')
        } else {
          router.push('/login')
        }
      })
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="text-gray-600 mt-1">管理你的账户信息</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">个人信息</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="输入昵称"
            />
          </div>

          <button
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            保存修改
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">账户信息</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">当前套餐</span>
            <span className="font-medium text-purple-600">
              {user.plan === 'pro' ? 'Pro 会员' : '免费用户'}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">剩余积分</span>
            <span className="font-medium text-gray-900">{user.credits}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">注册时间</span>
            <span className="font-medium text-gray-500">-</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
        <h2 className="text-lg font-bold text-red-600 mb-4">危险区域</h2>
        <p className="text-sm text-gray-600 mb-4">
          退出登录后，你需要重新输入邮箱和密码登录
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
