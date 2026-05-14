'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const quickActions = [
  { href: '/hot-content', icon: '🔥', label: '爆文排行', color: 'bg-red-50' },
  { href: '/xiaohongshu', icon: '📕', label: '小红书', color: 'bg-pink-50' },
  { href: '/wechat', icon: '📰', label: '公众号', color: 'bg-green-50' },
  { href: '/one-click', icon: '⚡', label: 'AI生成', color: 'bg-yellow-50' },
  { href: '/rewrite', icon: '✏️', label: '爆款改写', color: 'bg-blue-50' },
  { href: '/knowledge', icon: '📚', label: '专业知识库', color: 'bg-purple-50' },
]

// 默认空数据
const defaultRecentContents = [
  { id: 0, title: '还没有生成内容', platform: '', time: '' },
]

const defaultSampleContents = [
  { id: 1, title: 'ChatGPT写作技巧｜如何让AI写出爆款文案', hot: '🔥 10w+阅读', platform: '小红书' },
  { id: 2, title: '2024内容营销趋势分析报告', hot: '🔥 8.5w阅读', platform: '公众号' },
  { id: 3, title: '短视频脚本公式｜3秒抓住观众眼球', hot: '🔥 6.2w阅读', platform: '抖音' },
  { id: 4, title: '朋友圈高转化文案模板，直接套用', hot: '🔥 5.8w阅读', platform: '朋友圈' },
  { id: 5, title: '小红书起号攻略｜从0到1完整教程', hot: '🔥 5.1w阅读', platform: '小红书' },
]

const platformColors: Record<string, string> = {
  '小红书': 'text-pink-600 bg-pink-50',
  '公众号': 'text-green-600 bg-green-50',
  '朋友圈': 'text-blue-600 bg-blue-50',
  '抖音': 'text-purple-600 bg-purple-50',
  '综合': 'text-gray-600 bg-gray-50',
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ credits: 0, todayContents: 0, monthContents: 0 })
  const [recentContents, setRecentContents] = useState(defaultRecentContents)
  const [sampleContents, setSampleContents] = useState(defaultSampleContents)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 并行获取统计数据、最近内容、示例内容
    Promise.all([
      fetch('/api/stats').then(res => res.json()).catch(() => ({})),
      fetch('/api/recent-contents').then(res => res.json()).catch(() => ({ contents: [] })),
      fetch('/api/sample-contents').then(res => res.json()).catch(() => ({ contents: [] })),
    ]).then(([statsData, recentData, sampleData]) => {
      if (statsData.credits !== undefined) setStats(statsData)
      if (recentData.contents && recentData.contents.length > 0) {
        setRecentContents(recentData.contents)
      }
      if (sampleData.contents && sampleData.contents.length > 0) {
        setSampleContents(sampleData.contents)
      }
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">首页</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">快速开始内容创作</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-3 md:p-5">
          <p className="text-xs md:text-sm text-gray-500">今日生成</p>
          <p className="text-2xl md:text-3xl font-bold mt-1">{stats.todayContents}</p>
        </div>
        <div className="bg-white rounded-xl p-3 md:p-5">
          <p className="text-xs md:text-sm text-gray-500">本月生成</p>
          <p className="text-2xl md:text-3xl font-bold mt-1">{stats.monthContents}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-3 md:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <p className="text-white/80 text-xs md:text-sm">剩余积分</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{stats.credits}</p>
          </div>
          <Link
            href="/account?tab=recharge"
            className="px-2 md:px-4 py-1.5 md:py-2 bg-white text-purple-600 rounded-lg font-medium text-xs md:text-sm hover:bg-gray-50 transition shrink-0 text-center"
          >
            充值
          </Link>
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="bg-white rounded-xl p-4 md:p-6">
        <h2 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">快捷功能</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {quickActions.map(action => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-xl ${action.color}`}
            >
              <span className="text-2xl md:text-3xl">{action.icon}</span>
              <span className="text-xs md:text-sm font-medium text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近生成 / 爆款文章 左右布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 最近生成 */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold">最近生成</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentContents[0]?.id === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <span className="text-3xl mb-2">📝</span>
                <p className="text-sm">还没有生成内容</p>
                <Link href="/xiaohongshu" className="mt-2 text-sm text-purple-600 hover:text-purple-700">
                  去生成 →
                </Link>
              </div>
            ) : (
              recentContents.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${platformColors[item.platform] || 'text-gray-600 bg-gray-50'}`}>
                    {item.platform}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-center">
            <Link href="/history" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              查看更多 →
            </Link>
          </div>
        </div>

        {/* 爆款文章 */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold">爆款文章</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {sampleContents.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.hot}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${platformColors[item.platform] || 'text-gray-600 bg-gray-50'}`}>
                  {item.platform}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-center">
            <Link href="/hot-content" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              查看更多 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
