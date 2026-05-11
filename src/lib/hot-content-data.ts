// 爆文排行榜模拟数据生成器（优化版）
// 支持多平台：小红书、微信公众号、抖音

export interface HotArticle {
  id: number
  platform: 'xiaohongshu' | 'wechat' | 'douyin'
  platformName: string
  title: string
  author: string
  avatar: string
  views: number // 真实数字，显示时格式化
  likes: number
  comments: number
  shares: number
  favorites?: number // 小红书有收藏数
  category: string
  publishTime: string // 发布时间
  captureTime: string // 抓取时间
  ranking: number // 排名
  tags: string[]
  hasVideo: boolean // 是否视频内容
  coverImage?: string // 封面图（可选）
}

// 平台配置
const platforms = {
  xiaohongshu: { name: '小红书', color: 'bg-red-100 text-red-700' },
  wechat: { name: '微信公众号', color: 'bg-green-100 text-green-700' },
  douyin: { name: '抖音', color: 'bg-gray-900 text-white' }
}

// 更真实的标题模板
const titleTemplates = {
  xiaohongshu: [
    '🔥{product}真的绝了！{benefit}',
    '姐妹们！发现一个宝藏{product}💰只要{price}',
    '{count}天{description}，效果惊到我了😱',
    '后悔没早点知道！{product}这样用才对',
    '🏆2024年度最爱{product}，回购N次！',
    '真实测评｜{product}到底值不值得买？',
    '{city}探店｜这家{store}太好吃了！',
    '超详细{topic}攻略，新手必看✅',
    '月薪{salary}也能拥有的{product}🎁',
    '⚠️避坑！{product}这些雷点一定要注意'
  ],
  wechat: [
    '深度解析：{topic}的未来发展趋势',
    '{count}年从业经验总结：{description}',
    '重磅！{event}对{industry}的影响分析',
    '【独家】{expert}：关于{description}的几点思考',
    '{year}年{business}行业白皮书（完整版）',
    '案例研究：{company}是如何实现{achievement}的',
    '深度长文｜重新理解{description}',
    '{topic}：从入门到精通（{count}字干货）',
    '为什么{product}能成功？核心逻辑分析',
    '年度盘点：{year}年{business}十大事件'
  ],
  douyin: [
    '{product}实测！结果超出预期🎬',
    '{count}秒学会{description}💪',
    '今天教大家{howto}🔥',
    '花了{price}元买{product}，值不值？',
    '{city}人的一天📱',
    '挑战{description}，结局太意外了😂',
    '{celebrity}同款{product}，我找到了！',
    '这个{product}改变了我的生活✨',
    '{count}个信号说明{description}',
    '不建议{audience}买{product}的原因'
  ]
}

// 分类对应的关键词
const categoryKeywords: Record<string, string[]> = {
  '房地产': ['学区房', '买房攻略', '房价走势', '装修避坑', '家居布置', '贷款计算'],
  '科技': ['AI助手', '智能手表', '手机评测', '数码好物', '黑科技', '编程技巧'],
  '教育': ['学习方法', '家庭教育', '考试攻略', '留学申请', '职业培训', '亲子互动'],
  '餐饮': ['探店', '美食教程', '食材选购', '厨房好物', '减肥餐', '网红店'],
  '美妆': ['护肤心得', '彩妆教程', '产品测评', '成分分析', '平价替代', '化妆技巧'],
  '旅游': ['旅行攻略', '民宿推荐', '景点打卡', '旅行vlog', '省钱技巧', '小众目的地'],
  '母婴': ['育儿经验', '宝宝好物', '早教游戏', '辅食添加', '孕期护理', '亲子关系'],
  '健康': ['健身计划', '营养搭配', '心理健康', '养生之道', '体检报告', '慢病管理'],
  '金融': ['理财规划', '基金投资', '房产投资', '保险配置', '税务筹划', '财务自由'],
  '医疗': ['健康科普', '疾病预防', '就医指南', '医疗政策', '新药资讯', '医患关系'],
  '法律': ['法律科普', '合同审查', '劳动纠纷', '婚姻家事', '房产纠纷', '知识产权'],
  '宠物': ['养宠攻略', '宠物好物', '训练技巧', '宠物医疗', '宠物食品', '萌宠日常'],
  '汽车': ['新车评测', '用车技巧', '汽车改装', '新能源车', '自驾游', '汽车保养'],
  '家居': ['装修设计', '家具选购', '收纳技巧', '智能家居', 'DIY改造', '家居好物'],
  '娱乐': ['明星八卦', '影视推荐', '音乐分享', '综艺盘点', '网红打卡', '粉丝互动'],
  '电商': ['购物攻略', '好物推荐', '优惠券', '直播带货', '店铺运营', '爆款分析'],
  '职场': ['职业规划', '面试技巧', '办公效率', '人际关系', '副业赚钱', '职场心理'],
  '摄影': ['摄影技巧', '器材评测', '后期修图', '构图方法', '人像摄影', '风光摄影'],
  '农业': ['种植技术', '农产品', '乡村振兴', '农业政策', '生态农业', '农村生活']
}

// 生成随机数字（真实分布）
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 格式化数字（万为单位）
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 生成时间字符串
function generateTimeAgo(hoursAgo: number): string {
  if (hoursAgo < 1) return '刚刚'
  if (hoursAgo < 24) return `${Math.floor(hoursAgo)}小时前`
  if (hoursAgo < 48) return '昨天'
  if (hoursAgo < 168) return `${Math.floor(hoursAgo / 24)}天前`
  return `${Math.floor(hoursAgo / 168)}周前`
}

// 生成作者名
function generateAuthor(platform: 'xiaohongshu' | 'wechat' | 'douyin'): string {
  const prefixes: Record<string, string[]> = {
    xiaohongshu: ['小', '阿', '老', '大'],
    wechat: ['', '', '', ''],
    douyin: ['', '主播', '说', '聊'] 
  }
  
  const names: Record<string, string[]> = {
    xiaohongshu: ['美美', '婷婷', '露露', '小红', '桃子', '圆圆', '小雅', '安妮'],
    wechat: ['财经观察', '深度解析', '行业洞察', '商业评论', '智库', '研究室'],
    douyin: ['大伟', '小明', '阿强', '小仙女', '老李', '张老师'] 
  }
  
  const preList = prefixes[platform] || []
  const nameList = names[platform] || []
  const pre = preList.length > 0 ? preList[randomInt(0, preList.length - 1)] : ''
  const name = nameList.length > 0 ? nameList[randomInt(0, nameList.length - 1)] : '用户'
  
  return pre + name
}

// 生成爆文数据
export function generateHotArticles(
  category: string = '房地产',
  platform?: string,
  count: number = 100
): HotArticle[] {
  const articles: HotArticle[] = []
  const now = new Date()
  
  // 确定平台
  const targetPlatforms = platform 
    ? [platform as 'xiaohongshu' | 'wechat' | 'douyin'] 
    : (['xiaohongshu', 'wechat', 'douyin'] as const)
  
  for (let i = 0; i < count; i++) {
    const p = targetPlatforms[randomInt(0, targetPlatforms.length - 1)]
    const platformConfig = platforms[p]
    
    // 获取分类关键词
    const keywords = categoryKeywords[category] || ['热门']
    const keyword = keywords[randomInt(0, keywords.length - 1)]
    
    // 生成标题
    const templates = titleTemplates[p]
    const template = templates[randomInt(0, templates.length - 1)]
    const title = template
      .replace('{product}', keyword)
      .replace('{benefit}', '性价比超高')
      .replace('{price}', `${randomInt(10, 999)}元`)
      .replace('{count}', `${randomInt(3, 30)}`)
      .replace('{description}', keyword)
      .replace('{city}', ['北京', '上海', '广州', '深圳', '成都'][randomInt(0, 4)])
      .replace('{store}', '宝藏小店')
      .replace('{topic}', category)
      .replace('{salary}', `${randomInt(5, 50)}K`)
      .replace('{event}', '新政出台')
      .replace('{industry}', category)
      .replace('{expert}', '专家')
      .replace('{year}', '2024')
      .replace('{business}', category)
      .replace('{company}', '某公司')
      .replace('{achievement}', '业绩翻倍')
      .replace('{howto}', '变美')
      .replace('{celebrity}', '明星')
      .replace('{audience}', '普通人')
    
    // 生成互动数据（真实分布：少数爆文，多数普通）
    const isViral = Math.random() < 0.2 // 20%是爆文
    const viewsBase = isViral ? 100000 : 10000
    const viewsMultiplier = isViral ? randomInt(5, 100) : randomInt(1, 10)
    const views = viewsBase * viewsMultiplier + randomInt(0, 9999)
    
    const likesRatio = p === 'douyin' ? 0.05 : 0.03 // 抖音点赞率高
    const commentRatio = 0.005
    const shareRatio = 0.002
    
    const hoursAgo = randomInt(1, 720) // 1小时到30天内
    const captureTime = new Date(now.getTime() - hoursAgo * 3600000)
    
    articles.push({
      id: i + 1,
      platform: p,
      platformName: platformConfig.name,
      title,
      author: generateAuthor(p),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      views,
      likes: Math.floor(views * likesRatio * (0.5 + Math.random())),
      comments: Math.floor(views * commentRatio * (0.5 + Math.random())),
      shares: Math.floor(views * shareRatio * (0.5 + Math.random())),
      favorites: p === 'xiaohongshu' ? Math.floor(views * 0.02 * (0.5 + Math.random())) : undefined,
      category,
      publishTime: generateTimeAgo(hoursAgo),
      captureTime: captureTime.toISOString(),
      ranking: i + 1,
      tags: [category, keyword, ['热门', '推荐', '精选'][randomInt(0, 2)]],
      hasVideo: p === 'douyin' || Math.random() < 0.3
    })
  }
  
  // 按阅读量排序
  articles.sort((a, b) => b.views - a.views)
  
  // 重新分配排名
  articles.forEach((article, index) => {
    article.ranking = index + 1
  })
  
  return articles
}

// 获取数据采集时间
export function getDataCaptureTime(): string {
  const now = new Date()
  const timeStr = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  return timeStr
}

// 模拟API延迟
export function simulateDelay(ms: number = 800): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  generateHotArticles,
  formatNumber,
  getDataCaptureTime,
  simulateDelay
}
