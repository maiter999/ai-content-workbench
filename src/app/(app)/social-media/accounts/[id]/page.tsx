'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const platformLabels: Record<string, string> = {
  XIAOHONGSHU: '小红书',
  WECHAT: '公众号',
  WEIXIN_ARTICLE: '微信小绿书',
  ZHIHU: '知乎',
  TOUTIAO: '头条号',
  BAIJIA: '百家号',
  WEIBO: '微博',
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // 获取账号详情
  useEffect(() => {
    fetchAccountDetail()
  }, [params.id])

  const fetchAccountDetail = async () => {
    try {
      const res = await fetch(`/api/social-media/accounts/${params.id}`)
      const data = await res.json()
      if (data.account) {
        setAccount(data.account)
      }
    } catch (error) {
      console.error('获取账号详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 同步数据
  const handleSync = async () => {
    setSyncing(true)
    try {
      // TODO: 调用爬虫 API 同步数据
      alert('同步功能开发中...')
      // 模拟同步
      await new Promise(resolve => setTimeout(resolve, 1000))
      fetchAccountDetail()
    } catch (error) {
      console.error('同步失败:', error)
      alert('同步失败')
    } finally {
      setSyncing(false)
    }
  }

  // 准备图表数据
  const chartData = account?.stats
    ? account.stats
        .slice()
        .reverse()
        .map((stat: any) => ({
          date: new Date(stat.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          views: stat.views,
          comments: stat.comments,
          shares: stat.shares,
          favorites: stat.favorites,
        }))
    : []

  if (loading) {
    return <div className="p-6 text-center text-gray-400">加载中...</div>
  }

  if (!account) {
    return <div className="p-6 text-center text-gray-400">账号不存在</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* 返回按钮 + 标题 */}
      <div className="flex items-center gap-4">
        <Link
          href="/social-media/accounts"
          className="text-purple-600 hover:text-purple-700"
        >
          ← 返回列表
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{account.accountName}</h1>
          <p className="text-gray-500 mt-1">
            {platformLabels[account.platform] || account.platform}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {syncing ? '同步中...' : '同步数据'}
          </button>
          <Link
            href={`/social-media/data?accountId=${account.id}`}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
          >
            查看数据统计 →
          </Link>
        </div>
      </div>

      {/* 账号信息卡片 */}
      <div className="bg-white rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">平台</p>
          <p className="text-lg font-semibold mt-1">
            {platformLabels[account.platform] || account.platform}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">状态</p>
          <p className="text-lg font-semibold mt-1">
            {account.status === 'active' ? (
              <span className="text-green-600">活跃</span>
            ) : account.status === 'disabled' ? (
              <span className="text-gray-600">已禁用</span>
            ) : (
              <span className="text-red-600">已过期</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">最后同步</p>
          <p className="text-lg font-semibold mt-1">
            {account.lastSyncAt
              ? new Date(account.lastSyncAt).toLocaleString('zh-CN')
              : '尚未同步'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">账号ID</p>
          <p className="text-lg font-semibold mt-1">
            {account.accountId || '-'}
          </p>
        </div>
      </div>

      {/* 数据统计图表 */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">最近数据趋势</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#8b5cf6" name="阅读量" />
              <Line type="monotone" dataKey="comments" stroke="#10b981" name="评论数" />
              <Line type="monotone" dataKey="shares" stroke="#f59e0b" name="转发数" />
              <Line type="monotone" dataKey="favorites" stroke="#ef4444" name="收藏数" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 最近文章 */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">最近文章</h2>
        {account.posts && account.posts.length > 0 ? (
          <div className="space-y-3">
            {account.posts.map((post: any) => (
              <div key={post.id} className="border-b border-gray-100 pb-3 last:border-0">
                <p className="font-medium">{post.title}</p>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>👁️ {post.views}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔗 {post.shares}</span>
                  <span>⭐ {post.favorites}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">暂无文章数据</p>
        )}
      </div>

      {/* 待回复评论 */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">待回复评论</h2>
          <Link
            href={`/social-media/comments?accountId=${account.id}`}
            className="text-purple-600 hover:text-purple-700 text-sm"
          >
            查看全部 →
          </Link>
        </div>
        {account.comments && account.comments.length > 0 ? (
          <div className="space-y-3">
            {account.comments.slice(0, 5).map((comment: any) => (
              <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{comment.author || '匿名用户'}</p>
                    <p className="mt-1">{comment.content}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">
                    待回复
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">暂无待回复评论</p>
        )}
      </div>
    </div>
  )
}
