'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Copy, FileText, Zap, RefreshCw, TrendingUp, ExternalLink } from 'lucide-react'

// 行业配置 + 关键词匹配
const industries = [
  { id: 'all', name: '全部', icon: '📊', keywords: [] },
  { id: 'realestate', name: '房地产', icon: '🏠', keywords: ['房产', '房价', '楼市', '买房', '卖房', '租', '购房', '开盘', '万科', '恒大', '碧桂园', '地产', '住宅', '户型'] },
  { id: 'tech', name: '科技', icon: '💻', keywords: ['科技', 'AI', '互联网', '手机', '电脑', '芯片', '华为', '苹果', '小米', '腾讯', '阿里', '百度', '字节', 'OpenAI', 'ChatGPT', '大模型', '数码'] },
  { id: 'education', name: '教育', icon: '📚', keywords: ['教育', '学校', '学生', '老师', '高考', '中考', '考研', '留学', '培训', '补课', '作业', '大学', '小学', '考试', '成绩'] },
  { id: 'food', name: '餐饮', icon: '🍜', keywords: ['餐饮', '美食', '餐厅', '外卖', '厨师', '做菜', '食谱', '好吃', '火锅', '奶茶', '咖啡', '小吃', '烹饪', '食材', '厨房'] },
  { id: 'beauty', name: '美妆', icon: '💄', keywords: ['美妆', '护肤', '化妆', '美容', '口红', '面膜', '护肤品', '彩妆', '整形', '医美', '香水', '化妆品'] },
  { id: 'travel', name: '旅游', icon: '✈️', keywords: ['旅游', '旅行', '景区', '酒店', '机票', '民宿', '打卡', '攻略', '度假', '景点', '导游', '出国', '出境'] },
  { id: 'maternity', name: '母婴', icon: '👶', keywords: ['母婴', '宝宝', '育儿', '孕妇', '奶娃', '奶粉', '辅食', '童装', '早教', '儿童', '宝贝', '生育', '备孕'] },
  { id: 'health', name: '健康', icon: '❤️', keywords: ['健康', '养生', '锻炼', '运动', '减肥', '体检', '医院', '医生', '药品', '疾病', '身体', '保健'] },
  { id: 'finance', name: '金融', icon: '💰', keywords: ['金融', '银行', '理财', '投资', '股票', '基金', '保险', '贷款', '利率', '存款', '汇率', '黄金', '证券'] },
  { id: 'medical', name: '医疗', icon: '🏥', keywords: ['医疗', '医院', '医生', '手术', '治疗', '药品', '疾病', '患者', '医保', '挂号', '诊所'] },
  { id: 'law', name: '法律', icon: '⚖️', keywords: ['法律', '律师', '法院', '判决', '案件', '维权', '合同', '纠纷', '诉讼', '法规', '违法', '犯罪'] },
  { id: 'pet', name: '宠物', icon: '🐾', keywords: ['宠物', '猫', '狗', '养宠', '猫粮', '狗粮', '兽医', '犬', '宠物店', '萌宠', '动物'] },
  { id: 'car', name: '汽车', icon: '🚗', keywords: ['汽车', '车', '驾驶', '油价', '电动车', '特斯拉', '比亚迪', '新车', '二手车', '4S店', '车祸', '违章'] },
  { id: 'home', name: '家居', icon: '🏡', keywords: ['家居', '装修', '家具', '家电', '软装', '硬装', '地板', '窗帘', '沙发', '床', '衣柜'] },
  { id: 'wedding', name: '婚庆', icon: '💒', keywords: ['婚庆', '婚礼', '结婚', '婚纱', '摄影', '婚宴', '订婚', '彩礼', '嫁妆', '戒指', '钻戒'] },
  { id: 'ecommerce', name: '电商', icon: '🛒', keywords: ['电商', '购物', '直播', '带货', '淘宝', '京东', '拼多多', '抖音电商', '网店', '快递', '物流'] },
  { id: 'career', name: '职场', icon: '💼', keywords: ['职场', '工作', '求职', '招聘', '面试', '工资', '加班', '辞职', '同事', '领导', '简历'] },
  { id: 'photo', name: '摄影', icon: '📷', keywords: ['摄影', '拍照', '相机', '镜头', '写真', '婚纱照', '修图', '后期', '人像', '风景'] },
  { id: 'agriculture', name: '农业', icon: '🌾', keywords: ['农业', '农村', '农民', '农产品', '种植', '养殖', '农田', '粮食', '乡村振兴', '三农'] },
]

// 平台配置
const platformConfig: Record<string, { name: string; color: string; bg: string }> = {
  '知乎': { name: '知乎', color: 'text-blue-600', bg: 'bg-blue-50' },
  '微博': { name: '微博', color: 'text-orange-500', bg: 'bg-orange-50' },
  '抖音': { name: '抖音', color: 'text-gray-900', bg: 'bg-gray-100' },
  '微信': { name: '微信', color: 'text-green-600', bg: 'bg-green-50' },
  '百度': { name: '百度', color: 'text-blue-600', bg: 'bg-blue-50' },
  '小红书': { name: '小红书', color: 'text-red-600', bg: 'bg-red-50' },
  '全网热搜': { name: '全网', color: 'text-purple-600', bg: 'bg-purple-50' },
  '大众点评': { name: '点评', color: 'text-orange-600', bg: 'bg-orange-50' },
  '资讯新闻': { name: '新闻', color: 'text-blue-600', bg: 'bg-blue-50' },
  'QQ音乐': { name: '音乐', color: 'text-green-600', bg: 'bg-green-50' },
  '多看小说': { name: '小说', color: 'text-purple-600', bg: 'bg-purple-50' },
  '女频小说': { name: '小说', color: 'text-pink-600', bg: 'bg-pink-50' },
  '小游戏': { name: '游戏', color: 'text-indigo-600', bg: 'bg-indigo-50' },
}

const timeFilters = [
  { id: '1d', name: '1天内' },
  { id: '3d', name: '3天内' },
  { id: '7d', name: '7天内' },
  { id: '30d', name: '30天' },
]

interface HotItem {
  id: string
  platform: string
  platformId: string
  title: string
  excerpt: string
  url: string
  hotValue: number
  heatLevel: number
  globalRanking: number
  publishTime: string
  coverImage: string | null
  category: string
  author?: string
  matchedKeywords?: string[]
}

export default function HotContentPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState('7d')
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<HotItem[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 检查文章是否匹配行业关键词
  const matchIndustry = (item: HotItem, industryId: string, searchKw: string): { matched: boolean; keywords: string[] } => {
    if (industryId === 'all' && !searchKw) return { matched: true, keywords: [] }
    
    const industry = industries.find(i => i.id === industryId)
    
    // 合并行业关键词和搜索关键词
    const allKeywords: string[] = []
    if (industry && industry.keywords.length > 0) {
      allKeywords.push(...industry.keywords)
    }
    if (searchKw) {
      allKeywords.push(searchKw)
    }
    
    if (allKeywords.length === 0) return { matched: true, keywords: [] }
    
    const text = (item.title + ' ' + item.excerpt).toLowerCase()
    const matchedKeywords: string[] = []
    
    for (const keyword of allKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)
      }
    }
    
    return { matched: matchedKeywords.length > 0, keywords: matchedKeywords }
  }

  // 加载数据
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (searchQuery) {
        params.set('keyword', searchQuery)
      }
      params.set('dedup', 'true')
      
      const response = await fetch(`/api/hot-content?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setArticles(result.data.items)
        setLastUpdate(new Date(result.data.fetchedAt))
      } else {
        setError(result.error || '获取数据失败')
      }
    } catch (err) {
      setError('网络请求失败，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadData()
  }, [])

  // 根据行业筛选文章
  const filteredArticles = articles
    .map(item => {
      const match = matchIndustry(item, selectedIndustry, searchQuery)
      return { ...item, matchedKeywords: match.keywords }
    })
    .filter(item => selectedIndustry === 'all' || item.matchedKeywords.length > 0)

  // 格式化热度值
  const formatHotValue = (value: number): string => {
    if (value >= 100000000) return (value / 100000000).toFixed(1) + '亿'
    if (value >= 10000) return (value / 10000).toFixed(1) + '万'
    return value.toLocaleString()
  }

  // 格式化时间
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  // 收藏
  const handleCollect = (id: string) => {
    console.log('收藏:', id)
    alert('已收藏到知识库')
  }

  // 复制
  const handleCopy = async (item: HotItem) => {
    try {
      await navigator.clipboard.writeText(item.title)
      alert('已复制标题')
    } catch {
      console.log('复制失败')
    }
  }

  // 改写
  const handleRewrite = (item: HotItem) => {
    console.log('改写:', item)
    window.open(`/rewrite?content=${encodeURIComponent(item.title)}`, '_blank')
  }

  // 一键生成
  const handleGenerate = (item: HotItem) => {
    console.log('一键生成:', item)
    window.open(`/one-click?topic=${encodeURIComponent(item.title)}`, '_blank')
  }

  // 打开链接
  const openArticle = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    }
  }

  // 获取排名徽章样式
  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200'
    if (rank === 2) return 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-200'
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-200'
    return 'bg-gray-100 text-gray-500'
  }

  const currentIndustry = industries.find(i => i.id === selectedIndustry)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题区 */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">爆文排行榜</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  全网热榜聚合 · 实时追踪热点趋势
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadData()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full hover:bg-purple-100 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-purple-600 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-purple-700">刷新</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* 行业分类标签 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  selectedIndustry === industry.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {industry.icon} {industry.name}
              </button>
            ))}
          </div>
        </div>

        {/* 时间筛选 + 搜索 */}
        <div className="flex items-center gap-3 mb-4">
          {/* 时间筛选 */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {timeFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  timeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索关键词..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition"
          >
            搜索
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 当前筛选提示 */}
        {selectedIndustry !== 'all' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentIndustry?.icon}</span>
              <span className="text-sm text-purple-700">
                当前显示 <strong>{currentIndustry?.name}</strong> 相关内容
              </span>
            </div>
            <button
              onClick={() => setSelectedIndustry('all')}
              className="text-xs text-purple-600 hover:text-purple-800 underline"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 内容区 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">正在获取热榜数据...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-16">排名</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-24">来源</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">文章标题</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-500 w-28">热度值</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-500 w-20">时间</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-500 w-40">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article, index) => {
                  const platformInfo = platformConfig[article.platform] || { name: article.platform, color: 'text-gray-600', bg: 'bg-gray-50' }
                  const rank = index + 1
                  return (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${getRankBadge(rank)}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${platformInfo.bg} ${platformInfo.color}`}>
                          {platformInfo.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openArticle(article.url)}
                          className="text-sm text-gray-900 hover:text-purple-600 text-left line-clamp-2 transition-colors"
                        >
                          {article.title}
                        </button>
                        {selectedIndustry !== 'all' && article.matchedKeywords && article.matchedKeywords.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {article.matchedKeywords.slice(0, 3).map((kw, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-red-500">
                          🔥 {formatHotValue(article.hotValue)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-400">
                        {formatTime(article.publishTime)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleCollect(article.id)}
                            className="p-1.5 text-gray-300 hover:text-yellow-500 hover:bg-yellow-50 rounded transition"
                            title="收藏"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopy(article)}
                            className="p-1.5 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded transition"
                            title="复制"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRewrite(article)}
                            className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="改写"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleGenerate(article)}
                            className="p-1.5 text-gray-300 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title="一键生成"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openArticle(article.url)}
                            className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                            title="查看原文"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">{currentIndustry?.icon || '📊'}</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">
                {selectedIndustry === 'all' 
                  ? '暂无热榜数据' 
                  : `暂无「${currentIndustry?.name}」行业的相关热榜内容`
                }
              </p>
              <p className="text-gray-400 text-xs">
                {selectedIndustry === 'all' 
                  ? '请检查网络连接或稍后重试' 
                  : '请尝试选择其他行业分类'
                }
              </p>
              {selectedIndustry !== 'all' && (
                <button
                  onClick={() => setSelectedIndustry('all')}
                  className="mt-3 text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  查看全部热榜
                </button>
              )}
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>
            {lastUpdate && `更新于 ${lastUpdate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}
          </span>
          <span>共获取 {filteredArticles.length} 条热榜内容</span>
        </div>
      </div>
    </div>
  )
}
