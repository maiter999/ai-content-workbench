'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: '首页', icon: '🏠' },
  { href: '/hot-content', label: '爆文排行榜', icon: '🔥' },
  { href: '/one-click', label: 'AI一键生成', icon: '⚡' },
  { href: '/xiaohongshu', label: '小红书图文', icon: '📕' },
  { href: '/wechat', label: '公众号文章', icon: '📰' },
  { href: '/rewrite', label: '爆款速改写', icon: '✏️' },
  { href: '/knowledge', label: '专业知识库', icon: '📚' },
  { href: '/history', label: '生成文章', icon: '📜' },
  { href: '/generate-image', label: 'AI图片生成', icon: '🎨' },
]

const bottomNavItems = [
  { href: '/account', label: '我的账户', icon: '💰' },
  { href: '/agent', label: '代理后台', icon: '🤝' },
  { href: '/settings', label: '设置', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <h1 className="font-bold text-gray-900">豹纹工坊</h1>
            <p className="text-xs text-gray-500">多平台内容生成</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition',
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* 账户管理分组 */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition',
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
