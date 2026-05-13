// 聚合热榜爬虫数据源配置
// 支持多平台热榜数据抓取

export interface HotSource {
  id: string
  name: string
  nameCn: string
  icon: string
  url: string
  apiUrl?: string
  category: 'social' | 'tech' | 'news' | 'video' | 'ecommerce' | 'finance'
  enabled: boolean
  priority: number // 优先级，数字越小优先级越高
}

// 可用的热榜数据源
export const hotSources: HotSource[] = [
  // 社交媒体
  {
    id: 'zhihu',
    name: 'Zhihu',
    nameCn: '知乎',
    icon: '💬',
    url: 'https://www.zhihu.com/hot',
    category: 'social',
    enabled: true,
    priority: 1,
  },
  {
    id: 'weibo',
    name: 'Weibo',
    nameCn: '微博',
    icon: '📮',
    url: 'https://s.weibo.com/top/summary',
    category: 'social',
    enabled: true,
    priority: 2,
  },
  {
    id: 'baidu',
    name: 'Baidu',
    nameCn: '百度',
    icon: '🔍',
    url: 'https://top.baidu.com/board?tab=realtime',
    category: 'social',
    enabled: true,
    priority: 3,
  },
  
  // 科技媒体
  {
    id: '36kr',
    name: '36kr',
    nameCn: '36氪',
    icon: '🚀',
    url: 'https://36kr.com/',
    category: 'tech',
    enabled: true,
    priority: 1,
  },
  {
    id: 'huxiu',
    name: 'Huxiu',
    nameCn: '虎嗅',
    icon: '🐯',
    url: 'https://www.huxiu.com/',
    category: 'tech',
    enabled: true,
    priority: 2,
  },
  {
    id: 'ithome',
    name: 'IT之家',
    nameCn: 'IT之家',
    icon: '💻',
    url: 'https://www.ithome.com/',
    category: 'tech',
    enabled: true,
    priority: 3,
  },
  {
    id: 'ifeng',
    name: '爱范儿',
    nameCn: '爱范儿',
    icon: '📱',
    url: 'https://www.ifeng.com/',
    category: 'tech',
    enabled: true,
    priority: 4,
  },
  
  // 视频平台
  {
    id: 'douyin_hot',
    name: 'DouyinHot',
    nameCn: '抖音热榜',
    icon: '🎵',
    url: 'https://www.douyin.com/aweme/v1/web/hot/search/list/',
    category: 'video',
    enabled: true,
    priority: 1,
  },
  {
    id: 'bilibili',
    name: 'Bilibili',
    nameCn: 'B站',
    icon: '📺',
    url: 'https://www.bilibili.com/v/popular/rank/all',
    category: 'video',
    enabled: true,
    priority: 2,
  },
  
  // 电商
  {
    id: 'taobao_hot',
    name: 'TaobaoHot',
    nameCn: '淘宝热搜',
    icon: '🛒',
    url: 'https://top.taobao.com/',
    category: 'ecommerce',
    enabled: true,
    priority: 1,
  },
  {
    id: 'jd_hot',
    name: 'JDHot',
    nameCn: '京东热榜',
    icon: '📦',
    url: 'https://top.jd.com/',
    category: 'ecommerce',
    enabled: true,
    priority: 2,
  },
  
  // 财经
  {
    id: 'eastmoney',
    name: 'EastMoney',
    nameCn: '东方财富',
    icon: '💹',
    url: 'https://www.eastmoney.com/',
    category: 'finance',
    enabled: true,
    priority: 1,
  },
  {
    id: 'xueqiu',
    name: 'Xueqiu',
    nameCn: '雪球',
    icon: '🎱',
    url: 'https://xueqiu.com/',
    category: 'finance',
    enabled: true,
    priority: 2,
  },
]

// 分类配置
export const categories = [
  { id: 'all', name: '全部', icon: '📊' },
  { id: 'social', name: '社交媒体', icon: '💬' },
  { id: 'tech', name: '科技媒体', icon: '🚀' },
  { id: 'video', name: '视频平台', icon: '🎬' },
  { id: 'ecommerce', name: '电商热搜', icon: '🛒' },
  { id: 'finance', name: '财经热榜', icon: '💹' },
  { id: 'news', name: '资讯热点', icon: '📰' },
]

// 行业分类（用于内容分析）
export const industryCategories = [
  '房地产', '科技', '教育', '餐饮', '美妆', '旅游', 
  '母婴', '健康', '金融', '医疗', '法律', '宠物', 
  '汽车', '家居', '婚庆', '电商', '职场', '摄影', '农业'
]

export default hotSources
