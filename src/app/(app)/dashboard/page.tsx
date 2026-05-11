'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  credits: number
  plan: string
  todayContents: number
  monthContents: number
  recentContents: Array<{
    id: string
    title: string
    topic: string
    platforms: string
    createdAt: string
  }>
}

const quickActions = [
  { href: '/hot-content', icon: '🔥', label: '爆款排行', color: 'bg-red-50 hover:bg-red-100', textColor: 'text-red-700' },
  { href: '/xiaohongshu', icon: '📕', label: '小红书', color: 'bg-pink-50 hover:bg-pink-100', textColor: 'text-pink-700' },
  { href: '/wechat', icon: '📰', label: '公众号', color: 'bg-green-50 hover:bg-green-100', textColor: 'text-green-700' },
  { href: '/one-click', icon: '⚡', label: '一键生成', color: 'bg-yellow-50 hover:bg-yellow-100', textColor: 'text-yellow-700' },
  { href: '/rewrite', icon: '✏️', label: '爆文改写', color: 'bg-blue-50 hover:bg-blue-100', textColor: 'text-blue-700' },
  { href: '/knowledge', icon: '📚', label: '知识库', color: 'bg-purple-50 hover:bg-purple-100', textColor: 'text-purple-700' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">首页</h1>
        <p className="text-gray-600 mt-1">欢迎回来！快速开始你的内容创作之旅</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Today's Stats */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日生成</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.todayContents || 0}</p>
              <p className="text-sm text-green-600 mt-1">篇内容</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
        </div>

        {/* Month Stats */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">本月生成</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.monthContents || 0}</p>
              <p className="text-sm text-blue-600 mt-1">篇内容</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              📈
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">剩余积分</p>
              <p className="text-3xl font-bold mt-1">{stats?.credits || 0}</p>
              <p className="text-sm text-white/80 mt-1">
                {stats?.plan === 'pro' ? 'Pro 会员' : '免费用户'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              💎
            </div>
          </div>
        </div>

        {/* Quick Recharge */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600">积分不足？</p>
              <p className="text-lg font-bold text-gray-900 mt-1">立即充值</p>
              <p className="text-sm text-purple-600 mt-1">享更多优惠</p>
            </div>
            <Link href="/account" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
              充值
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">快捷功能</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition ${action.color}`}
            >
              <span className="text-3xl">{action.icon}</span>
              <span className={`text-sm font-medium ${action.textColor}`}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Popular Templates */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">热门模板</h2>
            <span className="text-sm text-purple-600">NEW</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-2xl">📕</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">小红书种草文案</p>
                <p className="text-sm text-gray-500">高转化率的种草笔记模板</p>
              </div>
              <span className="text-purple-600">→</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-2xl">📰</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">公众号深度文章</p>
                <p className="text-sm text-gray-500">专业、深度、有见地</p>
              </div>
              <span className="text-purple-600">→</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              <span className="text-2xl">🎵</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">抖音短视频脚本</p>
                <p className="text-sm text-gray-500">吸引眼球的爆款脚本</p>
              </div>
              <span className="text-purple-600">→</span>
            </div>
          </div>
        </div>

        {/* Recent Contents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">最近生成</h2>
            <Link href="/account" className="text-sm text-purple-600 hover:text-purple-700">
              查看全部 →
            </Link>
          </div>

          {stats?.recentContents && stats.recentContents.length > 0 ? (
            <div className="space-y-3">
              {stats.recentContents.slice(0, 3).map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{content.title}</p>
                    <p className="text-sm text-gray-500">{content.topic}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(content.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl">📭</span>
              <p className="text-gray-500 mt-4">还没有生成过内容</p>
              <Link
                href="/one-click"
                className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                开始生成
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">🔥 新用户专属福利</h3>
            <p className="text-white/80 mt-1">注册即送 100 积分，邀请好友再送 50 积分</p>
          </div>
          <Link
            href="/account"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            了解更多
          </Link>
        </div>
      </div>
    </div>
  )
}
