import { NextResponse } from 'next/server'

// Tmini 免费热榜API
const TMINI_API = 'https://tmini.net/api/Collection'

// 平台类型映射
const typeMap: Record<string, { type: string; name: string; icon: string; category: string }> = {
  '000': { type: '000', name: '抖音', icon: '🎵', category: 'video' },
  '111': { type: '111', name: '微博', icon: '📮', category: 'social' },
  '222': { type: '222', name: '全网热搜', icon: '🌐', category: 'all' },
  '333': { type: '333', name: '大众点评', icon: '📍', category: 'ecommerce' },
  '444': { type: '444', name: '资讯新闻', icon: '📰', category: 'news' },
  '555': { type: '555', name: 'QQ音乐', icon: '🎵', category: 'video' },
  '666': { type: '666', name: '多看小说', icon: '📚', category: 'social' },
  '777': { type: '777', name: '女频小说', icon: '📖', category: 'social' },
  '888': { type: '888', name: '小游戏', icon: '🎮', category: 'social' },
  '999': { type: '999', name: '知乎', icon: '💬', category: 'social' },
}

// 获取单个平台热榜
async function fetchTminiHot(type: string): Promise<any[]> {
  try {
    const config = typeMap[type]
    if (!config) return []
    
    const response = await fetch(`${TMINI_API}?type=${type}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 180 } // 缓存3分钟
    })
    
    if (!response.ok) {
      console.error(`获取 ${config.name} 失败:`, response.status)
      return []
    }
    
    const data = await response.json()
    
    if (data.code !== 200 || !data.data?.data) {
      return []
    }
    
    return data.data.data.map((item: any, index: number) => ({
      id: `${type}_${index}`,
      platform: config.name,
      platformId: type,
      title: item.text,
      excerpt: item.abstract_info || '',
      url: item.h5_url || '',
      hotValue: 0, // Tmini没有热度值
      heatLevel: index + 1,
      publishTime: new Date().toISOString(),
      coverImage: item.img_url || null,
      category: config.category,
      tags: item.tags || [],
    }))
  } catch (error) {
    console.error(`获取 ${type} 热榜失败:`, error)
    return []
  }
}

// 查重：计算文本相似度
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (t: string) => t.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, '')
  const s1 = normalize(text1)
  const s2 = normalize(text2)
  
  if (s1 === s2) return 1
  if (s1.length < 3 || s2.length < 3) return 0
  
  const set1 = new Set(s1)
  const set2 = new Set(s2)
  let common = 0
  for (const char of set1) {
    if (set2.has(char)) common++
  }
  
  return common / Math.max(set1.size, set2.size)
}

// 去重
function deduplicateItems(items: any[], threshold: number = 0.7): any[] {
  const uniqueItems: any[] = []
  
  for (const item of items) {
    const isDuplicate = uniqueItems.some(existing => 
      calculateSimilarity(item.title, existing.title) >= threshold
    )
    
    if (!isDuplicate) {
      uniqueItems.push(item)
    }
  }
  
  return uniqueItems
}

// GET: 获取热榜数据
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') || '222' // 默认全网热搜
  const category = searchParams.get('category')
  const keyword = searchParams.get('keyword')
  const dedup = searchParams.get('dedup') !== 'false'
  const limit = parseInt(searchParams.get('limit') || '50')
  
  try {
    let data: any[] = []
    
    // 如果是全网热搜，获取多个平台数据
    if (platform === '222' || platform === 'all') {
      const promises = Object.keys(typeMap).map(t => fetchTminiHot(t))
      const results = await Promise.allSettled(promises)
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          data.push(...result.value)
        }
      }
    } else {
      // 获取指定平台
      data = await fetchTminiHot(platform)
    }
    
    // 分类筛选（仅过滤非全网热搜的情况）
    if (category && category !== 'all' && platform !== '222' && platform !== 'all') {
      data = data.filter(item => item.category === category)
    }
    
    // 关键词筛选
    if (keyword) {
      const kw = keyword.toLowerCase()
      data = data.filter(item => 
        item.title.toLowerCase().includes(kw) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(kw))
      )
    }
    
    // 去重
    if (dedup && data.length > 10) {
      data = deduplicateItems(data, 0.75)
    }
    
    // 限制数量
    data = data.slice(0, limit)
    
    // 分配全局排名
    data.forEach((item, index) => {
      item.globalRanking = index + 1
    })
    
    return NextResponse.json({
      success: true,
      data: {
        items: data,
        total: data.length,
        platforms: Object.entries(typeMap).map(([id, config]) => ({
          id,
          type: config.type,
          name: config.name,
          icon: config.icon,
          category: config.category,
        })),
        fetchedAt: new Date().toISOString(),
        source: 'Tmini API',
      },
    })
  } catch (error) {
    console.error('热榜API错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取热榜数据失败',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
