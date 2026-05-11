'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索内容..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* 使用指南按钮 */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
        >
          <span className="text-xl">📖</span>
          <span>使用指南</span>
        </button>

        {/* Credits */}
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
          <span className="text-purple-600">💎</span>
          <span className="text-sm font-medium text-purple-700">
            {user?.credits ?? 0} 积分
          </span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-medium">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || user?.email?.split('@')[0] || '用户'}
            </span>
            <span className="text-gray-400">▼</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || '用户'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                ⚙️ 设置
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

      {/* 使用指南模态框 */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-90 overflow-y-auto p-8">
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowGuide(false)}
              className="float-right text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">豹纹 CLAW AI 使用指南</h2>

            {/* 1. 豹纹 CLAW AI 是什么？ */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. 豹纹 CLAW AI 是什么？</h3>
              <p className="text-gray-700 leading-relaxed">
                豹纹 CLAW AI 是一款面向内容创作者的AI智能助手，
                整合了爆款内容分析、多平台内容生成、智能改写等功能，
                帮助您快速创作高质量的小红书、公众号等平台内容。
              </p>
            </div>

            {/* 2. 核心功能全解析 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 核心功能全解析</h3>
              
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">📊 爆款调研</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li><strong>爆款查看</strong>：实时追踪全网热门内容，掌握流量密码</li>
                  <li><strong>爆款标题</strong>：AI生成高点击率标题，提升内容曝光</li>
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">✍️ 内容创作与改写</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li><strong>小红书/公众号</strong>：智能生成适配各平台的内容</li>
                  <li><strong>一键生成</strong>：输入主题，同时生成多个平台内容</li>
                  <li><strong>内容改写</strong>：爆款内容二次创作，避免抄袭风险</li>
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">💬 运营互动</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li><strong>评论回复</strong>：AI智能生成评论回复，提升互动率</li>
                  <li><strong>私域话术</strong>：生成引流私域的沟通话术</li>
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">📁 素材与管理</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li><strong>知识库</strong>：上传文档，让AI学习您的专业内容</li>
                  <li><strong>生成记录</strong>：查看历史生成内容，随时复用</li>
                  <li><strong>心得计划</strong>：规划内容策略，提升创作效率</li>
                </ul>
              </div>
            </div>

            {/* 3. 3分钟快速上手 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 3分钟快速上手</h3>
              <ol className="list-decimal list-inside text-gray-700 ml-4 space-y-2">
                <li>选择行业分类，精准定位内容方向</li>
                <li>浏览爆款文章，了解热门内容趋势</li>
                <li>选择创作工具（小红书、公众号、一键生成等）</li>
                <li>输入主题/关键词，设置创作参数</li>
                <li>点击生成，AI自动创作内容</li>
                <li>复制或导出内容，发布到对应平台</li>
              </ol>
            </div>

            {/* 4. 实用小技巧 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. 实用小技巧</h3>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                <li>💡 <strong>结合知识库使用</strong>：上传专业文档，让AI生成更专业的内容</li>
                <li>💡 <strong>多平台一键生成</strong>：一次输入，同时生成小红书、公众号等多个平台内容</li>
                <li>💡 <strong>参考爆款标题</strong>：使用"爆款标题"功能获取高点击率标题灵感</li>
                <li>💡 <strong>定期查看爆款</strong>：每天查看爆款文章，掌握最新内容趋势</li>
              </ul>
            </div>

            {/* 开始创作按钮 */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowGuide(false)}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90 transition text-lg"
              >
                🚀 开始创作
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
