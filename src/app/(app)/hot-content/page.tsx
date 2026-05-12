'use client'

import { useState } from 'react'
import { Search, Star, Copy, FileText, Zap } from 'lucide-react'

const industries = [
  '房地产', '科技', '教育', '餐饮', '美妆', '旅游', '母婴', '健康', '金融', '医疗', '法律', '宠物', '汽车', '家居', '婚庆', '电商', '职场', '摄影', '农业'
]

const timeFilters = ['1天内', '3天内', '7天内', '30天', '90天', '热度', '最新']

export default function HotContentPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState('7天内')
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 模拟数据
  const mockArticles = [
    { id: 1, source: '小红书', title: 'ChatGPT使用技巧大全，让你效率提升10倍', reads: '6.1万', likes: '2.8k', shares: '1.3k' },
    { id: 2, source: '公众号', title: '月薪3000到3万，我只用了三年', reads: '5.3万', likes: '2.1k', shares: '986' },
    { id: 3, source: '小红书', title: '实测有效！7天瘦5斤的减肥方法', reads: '4.8万', likes: '1.9k', shares: '756' },
    { id: 4, source: '公众号', title: '2024最值得入手的数码产品清单', reads: '4.2万', likes: '1.5k', shares: '623' },
    { id: 5, source: '小红书', title: '租房避坑指南，建议收藏', reads: '3.9万', likes: '1.3k', shares: '512' },
    { id: 6, source: '公众号', title: '揭秘：电商运营不会告诉你的秘密', reads: '3.5万', likes: '1.1k', shares: '456' },
    { id: 7, source: '小红书', title: '职场新人必看：入职第一周该怎么做', reads: '3.2万', likes: '987', shares: '398' },
    { id: 8, source: '公众号', title: '家庭理财干货，从存款开始', reads: '2.9万', likes: '876', shares: '334' },
  ]

  const handleSearch = () => {
    if (!selectedIndustry) return
    setLoading(true)
    setTimeout(() => {
      setArticles(mockArticles)
      setLoading(false)
    }, 500)
  }

  const handleCollect = (id: number) => {
    console.log('收藏:', id)
  }

  const handleCopy = (id: number) => {
    console.log('复制:', id)
  }

  const handleRewrite = (id: number) => {
    console.log('改写:', id)
  }

  const handleGenerate = (id: number) => {
    console.log('一键生成:', id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题区 */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">爆文排行榜</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })} · 全网热门内容实时追踪
          </p>
          <p className="text-xs text-gray-400 mt-1">
            更新于 {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} · 下次更新 09:00
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* 行业分类标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.map(industry => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedIndustry === industry
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-4 mb-4">
          {/* 时间筛选 */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            {timeFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  timeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索关键词..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!selectedIndustry}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              搜索
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedIndustry ? (
            loading ? (
              /* 加载状态 */
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : articles.length > 0 ? (
              /* 数据表格 */
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">来源</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">文章标题</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">阅读量</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">点赞数</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">分享数</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          article.source === '小红书' 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {article.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                          {article.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{article.reads}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{article.likes}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{article.shares}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleCollect(article.id)}
                            className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded transition"
                            title="收藏"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopy(article.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition"
                            title="复制"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRewrite(article.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="改写"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleGenerate(article.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title="一键生成"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* 无数据状态 */
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="w-12 h-12 mb-3" />
                <p className="text-sm">未找到相关爆款文章</p>
              </div>
            )
          ) : (
            /* 空状态 - 未选择行业 */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <p className="text-gray-500 text-sm">选择一个行业分类，开始浏览爆款文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
