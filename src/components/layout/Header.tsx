'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GuideModal } from '@/components/GuideModal'
import { MobileDrawer, MobileBottomNav } from '@/components/layout/Sidebar'

interface User {
  id: string
  email: string
  name: string | null
  credits: number
}

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // 静默处理，不跳转
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

        {/* 左侧：移动端汉堡菜单 + PC端搜索 */}
        <div className="flex items-center gap-3">
          {/* 移动端：汉堡菜单按钮 */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开菜单"
          >
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full"></span>
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full"></span>
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full"></span>
          </button>

          {/* 移动端：Logo（中间或左侧） */}
          <Link href="/dashboard" className="md:hidden flex items-center gap-2">
            <img src="/logo.png" alt="豹纹工坊" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-base">豹纹工坊</span>
          </Link>

          {/* PC端：搜索框 */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="搜索功能..."
              className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 操作指南：PC端显示完整，移动端仅显示图标 */}
          <button
            onClick={() => setShowGuide(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full hover:bg-purple-100 transition"
          >
            <span className="text-purple-600">📖</span>
            <span className="text-sm font-medium text-purple-700">操作指南</span>
          </button>
          <button
            onClick={() => setShowGuide(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="操作指南"
          >
            <span className="text-xl">📖</span>
          </button>

          {/* 积分：PC端完整显示，移动端隐藏文字 */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
            <span className="text-purple-600">💎</span>
            <span className="text-sm font-medium text-purple-700">
              {user?.credits ?? 0} 积分
            </span>
          </div>
          <div className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 rounded-full">
            <span className="text-purple-600 text-sm">💎</span>
            <span className="text-xs font-medium text-purple-700">{user?.credits ?? 0}</span>
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || user?.email?.split('@')[0] || '用户'}
              </span>
              <span className="hidden md:block text-gray-400 text-xs">▼</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || '用户'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  💰 我的账户
                </Link>
                <Link
                  href="/account?tab=settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  🔐 账户设置
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 移动端抽屉 */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* 移动端底部导航 */}
      <MobileBottomNav />

      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  )
}
