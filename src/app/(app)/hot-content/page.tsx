'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateHotArticles, formatNumber, getDataCaptureTime, simulateDelay } from '@/lib/hot-content-data'

const categories = [
  '房地产', '科技', '教育', '餐饮', '美妆', '旅游', '母婴', '健康', 
  '金融', '医疗', '法律', '宠物', '汽车', '家居', '娱乐', '电商', 
  '职场', '摄影', '农业'
]

const timeFilters = [
  { label: '1天内', value: '1d' },
  { label: '3天内', value: '3d' },
  { label: '7天内', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '自定义', value: 'custom' },
  { label: '昨日', value: 'yesterday' },
  { label: '最新', value: 'latest' },
]

const platforms = [
  { label: '全部', value: 'all', color: 'bg-gray-100 text-gray-700' },
  { label: '小红书', value: 'xiaohongshu', color: 'bg-red-100 text-red-700' },
  { label: '公众号', value: 'wechat', color: 'bg-green-100 text-green-700' },
  { label: '抖音', value: 'douyin', color: 'bg-gray-900 text-white' },
]

interface HotArticle {
  id: number
  platform: string
  platformName: string
  title: string
  author: string
  views: number
  likes: number
  comments: number
  shares: number
  favorites?: number
  category: string
  publishTime: string
  captureTime: string
  ranking: number
  tags: string[]
  hasVideo: boolean
}

export default function HotContentPage() {
  const [selectedCategory, setSelectedCategory] = useState('房地产')
  const [selectedTime, setSelectedTime] = useState('1d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [searchQuery, setSearchQuery] =  useState('')
  const [articles, setArticles] = useState<HotArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [dataCaptureTime, setDataCaptureTime] = useState('')
  
  const pageSize = 10 // 每页显示10条

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      // 模拟 API 调用延迟
      await simulateDelay(600)
      
      // 使用优化版模拟数据生成器
      const platform = selectedPlatform === 'all' ? undefined : selectedPlatform
      const allData = generateHotArticles(selectedCategory, platform, 100)
      
      // 搜索过滤
      let filteredData = allData
      if (searchQuery) {
        filteredData = allData.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // 计算分页
      const total = filteredData.length
      setTotalPages(Math.ceil(total / pageSize))
      
      // 分页截取
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      setArticles(filteredData.slice(start, end))
      
      // 更新数据抓取时间
      setDataCaptureTime(getDataCaptureTime())
      
    } catch (err) {
      console.error('加载数据失败:', err)
      setError(`加载数据失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedTime, selectedPlatform, searchQuery, currentPage])
  
  // 初始化加载数据
  useEffect(() => {
    loadData()
  }, [loadData])

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1) // 重置到第一页
    loadData()
  }

  // 重置搜索
  const handleResetSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
    loadData()
  }

  // 获取平台标签样式
  const getPlatformBadgeClass = (platform: string) => {
    switch (platform) {
      case 'xiaohongshu': return 'bg-red-100 text-red-700'
      case 'wechat': return 'bg-green-100 text-green-700'
      case 'douyin': return 'bg-gray-900 text-white'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">爆款文章</h1>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
            实时追踪
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>📊 数据更新于: {dataCaptureTime || '加载中...'}</span>
          <span>·</span>
          <span>🔄 下次更新 09:00</span>
          <span>·</span>
          <span>📱 支持平台: 小红书 / 公众号 / 抖音</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Platform + Time Filter + Search */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        {/* Platform Filter */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">平台筛选</div>
          <div className="flex gap-2">
            {platforms.map((pf) => (
              <button
                key={pf.value}
                onClick={() => {
                  setSelectedPlatform(pf.value)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPlatform === pf.value
                    ? 'bg-orange-500 text-white'
                    : pf.color
                }`}
              >
                {pf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter + Search */}
        <div className="flex items-center justify-between">
          {/* Time Filters */}
          <div className="flex gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setSelectedTime(filter.value)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedTime === filter.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索文章标题或作者..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
            />
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              搜索
            </button>
            {searchQuery && (
              <button 
                onClick={handleResetSearch}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                重置
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-orange-600">{articles.length}</div>
                <div className="text-xs text-gray-600">当前显示</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{selectedCategory}</div>
                <div className="text-xs text-gray-600">分类</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedPlatform === 'all' ? '全部' : platforms.find(p => p.value === selectedPlatform)?.label}
                </div>
                <div className="text-xs text-gray-600">平台</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              📊 数据每 {selectedTime === '1d' ? '天' : selectedTime === '7d' ? '周' : '月'} 更新
            </div>
          </div>

          {/* Hot Articles Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-2">平台</div>
              <div className="col-span-4">文章标题</div>
              <div className="col-span-1 text-center">阅读</div>
              <div className="col-span-1 text-center">点赞</div>
              <div className="col-span-1 text-center">评论</div>
              <div className="col-span-1 text-center">分享</div>
              <div className="col-span-2 text-center">发布时间</div>
            </div>

            {/* Table Body */}
            {articles.length > 0 ? (
              articles.map((article) => (
                <div 
                  key={article.id} 
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-orange-50 transition cursor-pointer"
                >
                  {/* Platform */}
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformBadgeClass(article.platform)}`}>
                      {article.platformName}
                    </span>
                    {article.hasVideo && (
                      <span className="ml-1 text-xs">🎬</span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="col-span-4 flex items-center">
                    <div>
                      <p className="font-medium text-gray-900 hover:text-orange-600 transition line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {article.author}
                        {article.favorites && (
                          <span className="ml-2">❤️ 收藏 {formatNumber(article.favorites)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Views */}
                  <div className="col-span-1 flex items-center justify-center text-gray-700 font-medium text-sm">
                    {formatNumber(article.views)}
                  </div>

                  {/* Likes */}
                  <div className="col-span-1 flex items-center justify-center text-red-500 font-medium text-sm">
                    {formatNumber(article.likes)}
                  </div>

                  {/* Comments */}
                  <div className="col-span-1 flex items-center justify-center text-blue-500 font-medium text-sm">
                    {formatNumber(article.comments)}
                  </div>

                  {/* Shares */}
                  <div className="col-span-1 flex items-center justify-center text-green-500 font-medium text-sm">
                    {formatNumber(article.shares)}
                  </div>

                  {/* Publish Time */}
                  <div className="col-span-2 flex items-center justify-center text-gray-500 text-xs">
                    {article.publishTime}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">📂</span>
                <p>暂无数据</p>
                <p className="text-sm mt-1">尝试更换筛选条件或搜索关键词</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-white shadow-sm text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              {totalPages > 10 && (
                <span className="px-4 py-2 text-gray-500">...</span>
              )}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white shadow-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
