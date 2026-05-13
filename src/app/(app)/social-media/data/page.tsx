'use client'

import { useState, useEffect } from 'react'

// 平台配置
const platforms = [
  { id: 'WECHAT_OFFICIAL', name: '公众号', icon: '💬', color: '#07C160' },
  { id: 'XIAOHONGSHU', name: '小红书', icon: '📕', color: '#FE2C55' },
  { id: 'XIAOLUSHU', name: '小绿书', icon: '📗', color: '#25D366' },
  { id: 'TOUTIAO', name: '头条号', icon: '🔴', color: '#ED4040' },
  { id: 'BAIJIA', name: '百家号', icon: '🔵', color: '#2932E1' },
  { id: 'ZHIHU', name: '知乎号', icon: '🔷', color: '#0084FF' },
  { id: 'WEIBO', name: '微博号', icon: '👁', color: '#E6162D' },
]

// 模拟账号数据
const mockAccounts = [
  { id: '1', name: '卢杰AI工具库', platform: 'XIAOHONGSHU', avatar: '👤', fans: 3666, works: 202, status: 'active' },
  { id: '2', name: '杰哥AI电商', platform: 'WECHAT_OFFICIAL', avatar: '👤', fans: 1280, works: 89, status: 'active' },
  { id: '3', name: '卢杰AI逆袭', platform: 'TOUTIAO', avatar: '👤', fans: 890, works: 156, status: 'offline' },
  { id: '4', name: '卢杰谈AI', platform: 'ZHIHU', avatar: '👤', fans: 567, works: 78, status: 'active' },
  { id: '5', name: 'AI创作助手', platform: 'BAIJIA', avatar: '👤', fans: 234, works: 45, status: 'active' },
  { id: '6', name: '卢杰AI笔记', platform: 'XIAOLUSHU', avatar: '👤', fans: 1890, works: 234, status: 'active' },
]

// 模拟统计数据
const mockStatsData = {
  '1': {
    newFans: 128,
    yesterdayNewFans: 23,
    plays: 45678,
    yesterdayPlays: 5678,
    comments: 234,
    yesterdayComments: 34,
    likes: 1890,
    yesterdayLikes: 234,
    collections: 567,
    yesterdayCollections: 89,
    shares: 123,
    yesterdayShares: 23,
    exposure: 67890,
    yesterdayExposure: 8901,
    conversions: 45,
    yesterdayConversions: 8,
  },
  '2': {
    newFans: 89,
    yesterdayNewFans: 12,
    plays: 23456,
    yesterdayPlays: 3456,
    comments: 156,
    yesterdayComments: 23,
    likes: 890,
    yesterdayLikes: 123,
    collections: 234,
    yesterdayCollections: 45,
    shares: 67,
    yesterdayShares: 12,
    exposure: 34567,
    yesterdayExposure: 4567,
    conversions: 23,
    yesterdayConversions: 4,
  },
  '3': {
    newFans: 45,
    yesterdayNewFans: 8,
    plays: 12345,
    yesterdayPlays: 2345,
    comments: 89,
    yesterdayComments: 15,
    likes: 456,
    yesterdayLikes: 67,
    collections: 123,
    yesterdayCollections: 23,
    shares: 34,
    yesterdayShares: 6,
    exposure: 23456,
    yesterdayExposure: 3456,
    conversions: 12,
    yesterdayConversions: 2,
  },
}

// 数据指标配置
const dataMetrics = [
  { key: 'newFans', label: '涨粉数', icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'plays', label: '播放/阅读数', icon: '▶️', color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'comments', label: '评论数', icon: '💬', color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'likes', label: '点赞数', icon: '❤️', color: 'text-red-600', bg: 'bg-red-50' },
  { key: 'collections', label: '收藏数', icon: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { key: 'shares', label: '转发数', icon: '↗️', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'exposure', label: '曝光数', icon: '👁️', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { key: 'conversions', label: '转化数', icon: '🎯', color: 'text-orange-600', bg: 'bg-orange-50' },
]

export default function DataStatsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ start: '2026-05-06', end: '2026-05-12' })
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 计算总数据
  const totalAccounts = accounts.length
  const totalFans = accounts.reduce((sum, a) => sum + a.fans, 0)
  const totalWorks = accounts.reduce((sum, a) => sum + a.works, 0)
  const onlineCount = accounts.filter(a => a.status === 'active').length
  const offlineCount = accounts.filter(a => a.status === 'offline').length

  // 过滤账号
  const filteredAccounts = accounts.filter(account => {
    const matchPlatform = selectedPlatform === 'all' || account.platform === selectedPlatform
    const matchSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchPlatform && matchSearch
  })

  // 获取当前选中账号的统计数据
  const currentStats = selectedAccount ? mockStatsData[selectedAccount as keyof typeof mockStatsData] : null

  // 导出数据
  const handleExport = () => {
    const data = {
      dateRange,
      accounts: filteredAccounts,
      stats: currentStats,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `账号数据_${dateRange.start}_${dateRange.end}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 获取平台信息
  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || { name: '未知', icon: '📱', color: '#999' }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和筛选区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            账号数据
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="text-blue-500">↻ 刷新</span>
            <span className="ml-4">数据更新于 2026-05-13 20:05:01</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 选择列表 */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>选择列表</option>
            <option>全部账号</option>
            <option>活跃账号</option>
          </select>
          {/* 选择平台 */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">选择平台</option>
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {/* 搜索 */}
          <div className="relative">
            <input
              type="text"
              placeholder="请输入账号名称"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* 统计卡片 + 账号列表 */}
      <div className="flex gap-6">
        {/* 左侧统计 */}
        <div className="w-64 space-y-4">
          {/* 累计账号数 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <span>📊</span>
              <span>累计账号数</span>
              <span className="text-gray-400 cursor-help" title="账号总数">ⓘ</span>
            </div>
            <div className="text-3xl font-bold">{totalAccounts}</div>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                在线 {onlineCount}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                离线 {offlineCount}
              </span>
              <button className="text-blue-500 hover:text-blue-600">重新登录</button>
            </div>
          </div>

          {/* 累计粉丝数 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <span>👥</span>
              <span>累计粉丝数</span>
            </div>
            <div className="text-3xl font-bold">{totalFans.toLocaleString()}</div>
          </div>

          {/* 累计作品数 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <span>📝</span>
              <span>累计作品数</span>
            </div>
            <div className="text-3xl font-bold">{totalWorks.toLocaleString()}</div>
          </div>
        </div>

        {/* 右侧账号列表 */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            {filteredAccounts.map((account) => {
              const platform = getPlatformInfo(account.platform)
              const isSelected = selectedAccount === account.id
              return (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(isSelected ? null : account.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      {account.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{account.name}</h3>
                      <span className="text-xs text-gray-400">{platform.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>粉丝数</span>
                      <span className="font-medium text-gray-900">{account.fans.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>作品数</span>
                      <span className="font-medium text-gray-900">{account.works.toLocaleString()}</span>
                    </div>
                  </div>
                  {account.status === 'offline' && (
                    <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>登录失效</span>
                      <button className="text-blue-500 hover:text-blue-600 ml-1">重新登录</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 数据明细 */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* 数据明细头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
            数据明细
          </h2>
          <div className="flex items-center gap-3">
            {/* 时间范围 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">时间范围</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-yellow-500 text-xs">VIP</span>
            </div>
            {/* 导出按钮 */}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition flex items-center gap-2"
            >
              <span>📥</span>
              <span>导出数据</span>
              <span className="text-xs bg-green-600 px-1.5 py-0.5 rounded">VIP</span>
            </button>
          </div>
        </div>

        {/* 数据指标卡片 */}
        <div className="p-6">
          {selectedAccount ? (
            <div className="grid grid-cols-4 gap-4">
              {currentStats && dataMetrics.map((metric) => {
                const value = currentStats[metric.key as keyof typeof currentStats] as number
                const yesterdayKey = `yesterday${metric.key.charAt(0).toUpperCase()}${metric.key.slice(1)}` as keyof typeof currentStats
                const yesterdayValue = currentStats[yesterdayKey] as number
                return (
                  <div key={metric.key} className={`p-4 rounded-lg ${metric.bg} border border-gray-100`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{metric.icon}</span>
                      <span className={`text-sm font-medium ${metric.color}`}>{metric.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      昨日新增 <span className="font-medium">{yesterdayValue}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {dataMetrics.map((metric) => (
                <div key={metric.key} className={`p-4 rounded-lg ${metric.bg} border border-gray-100 opacity-50`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{metric.icon}</span>
                    <span className={`text-sm font-medium ${metric.color}`}>{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-xs text-gray-500 mt-1">请选择一个账号查看数据</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 数据图表区域（占位） */}
        <div className="px-6 pb-6">
          <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>数据趋势图表</p>
              <p className="text-sm">{dateRange.start} ~ {dateRange.end}</p>
            </div>
          </div>
        </div>

        {/* 数据表格 */}
        <div className="border-t border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">账号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">涨粉数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">播放/阅读数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">评论数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">点赞数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">收藏数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">转发数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">曝光数 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">更新时间 ↕</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.map((account) => {
                const platform = getPlatformInfo(account.platform)
                const stats = mockStatsData[account.id as keyof typeof mockStatsData]
                return (
                  <tr
                    key={account.id}
                    onClick={() => setSelectedAccount(account.id)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedAccount === account.id ? 'bg-purple-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{account.avatar}</span>
                        <div>
                          <div className="font-medium text-sm">{account.name}</div>
                          <div className="text-xs text-gray-400">{platform.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{stats?.newFans || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.plays || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.comments || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.likes || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.collections || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.shares || 0}</td>
                    <td className="px-6 py-4 text-sm">{stats?.exposure || 0}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">2026-05-13</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-500 hover:text-blue-600 text-sm">查看详情</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
