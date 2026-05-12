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

const mockRecentContents = [
  { id: 1, title: '618种草指南｜回购N次的宝藏好物分享', platform: '小红书', time: '10分钟前' },
  { id: 2, title: '深度测评｜2024年最值得入手的数码装备', platform: '公众号', time: '30分钟前' },
  { id: 3, title: '朋友圈文案｜周末探店打卡指南', platform: '朋友圈', time: '1小时前' },
  { id: 4, title: '抖音脚本｜3分钟说清楚什么是AI写作', platform: '抖音', time: '2小时前' },
  { id: 5, title: '小红书爆款｜5个让笔记火起来的技巧', platform: '小红书', time: '3小时前' },
]

const mockHotContents = [
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
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ credits: 0, todayContents: 0, monthContents: 0 })
  const [activeTab, setActiveTab] = useState<'recent' | 'hot'>('recent')

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const contents: any = activeTab === 'recent' ? mockRecentContents : mockHotContents

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">首页</h1>
        <p className="text-gray-500 mt-1">快速开始内容创作</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5">
          <p className="text-sm text-gray-500">今日生成</p>
          <p className="text-3xl font-bold mt-1">{stats.todayContents}</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <p className="text-sm text-gray-500">本月生成</p>
          <p className="text-3xl font-bold mt-1">{stats.monthContents}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-white/80">剩余积分</p>
            <p className="text-3xl font-bold mt-1">{stats.credits}</p>
          </div>
          <Link
            href="/account?tab=recharge"
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition shrink-0"
          >
            充值积分
          </Link>
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="font-semibold mb-4">快捷功能</h2>
        <div className="grid grid-cols-6 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color}`}
            >
              <span className="text-3xl">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近生成 / 爆款文章 Tab */}
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'recent'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            最近生成
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'hot'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            爆款文章
          </button>
        </div>

        {/* 文章列表 */}
        <div className="divide-y divide-gray-100">
          {contents.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {'time' in item ? item.time : 'hot' in item ? item.hot : ''}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${platformColors[item.platform] || 'text-gray-600 bg-gray-50'}`}>
                {item.platform}
              </span>
            </div>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <Link href={activeTab === 'recent' ? '/history' : '/hot-content'} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            查看更多 →
          </Link>
        </div>
      </div>
    </div>
  )
}
