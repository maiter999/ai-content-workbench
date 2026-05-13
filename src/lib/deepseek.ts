import OpenAI from 'openai'

function createDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }
  return new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey
  })
}

// 懒加载，只在第一次调用时创建客户端
let _deepseek: OpenAI | null = null
function getDeepSeekClient() {
  if (!_deepseek) {
    _deepseek = createDeepSeekClient()
  }
  return _deepseek
}

export { getDeepSeekClient }

export type Platform = 'xiaohongshu' | 'wechat' | 'douyin'

export interface GenerateRequest {
  topic: string
  platforms: Platform[]
  tone?: 'casual' | 'professional' | 'humorous'
  length?: 'short' | 'medium' | 'long'
}

const platformPrompts: Record<Platform, { system: string; length: Record<string, string> }> = {
  xiaohongshu: {
    system: `你是一个专业的小红书内容创作者，擅长写吸引人的小红书笔记。

特点：
- 开头用emoji和口语化表达吸引注意
- 使用"姐妹们！"、"救命！"、"绝绝子！"等口头禅
- 文中加入适量emoji增加趣味
- 结尾加上话题标签如 #生活 #好物分享 #穿搭 等
- 内容真实、有共鸣、实用性强
- 分段清晰，每段2-3句话`,
    length: {
      short: '100-200字，适合快速浏览',
      medium: '300-500字，内容详实',
      long: '600-800字，深度分享'
    }
  },
  wechat: {
    system: `你是一个资深的微信公众号作者，擅长写有深度的公众号文章。

特点：
- 标题有吸引力，引发好奇或共鸣
- 开篇点题，直接切入主题
- 逻辑清晰，层层递进
- 内容专业、有观点、有干货
- 结尾有总结和引导互动
- 适合500-2000字的中长内容`,
    length: {
      short: '500-800字，快餐式阅读',
      medium: '1000-1500字，深度文章',
      long: '1800-2500字，深度长文'
    }
  },
  douyin: {
    system: `你是一个专业的抖音短视频脚本创作者，擅长写吸引人的短视频脚本。

特点：
- 前3秒必须有爆点或悬念，抓住注意力
- 节奏感强，每5-10秒一个转折或亮点
- 语言口语化、有感染力
- 可以加入"转场"、"特效"、"BGM建议"等
- 结尾有引导互动（评论、点赞、关注）
- 脚本格式清晰，方便拍摄`,
    length: {
      short: '30-60秒短视频脚本',
      medium: '60-90秒短视频脚本',
      long: '90-120秒短视频脚本'
    }
  }
}

export async function generateContent(req: GenerateRequest) {
  const { topic, platforms, tone = 'casual', length = 'medium' } = req

  const toneInstruction = {
    casual: '轻松随意的风格，像朋友聊天',
    professional: '专业严谨的风格，权威可信',
    humorous: '幽默风趣的风格，让人开心'
  }

  const results: Record<Platform, { title: string; content: string; hashtags?: string[] }> = {} as any

  for (const platform of platforms) {
    const config = platformPrompts[platform]
    const lengthDesc = config.length[length]

    const messages = [
      { role: 'system' as const, content: config.system },
      {
        role: 'user' as const,
        content: `请为以下主题创作内容：
主题：${topic}
语气风格：${toneInstruction[tone]}
内容长度：${lengthDesc}

请直接输出内容，不要额外解释。`
      }
    ]

    if (platform === 'xiaohongshu') {
      messages.push({
        role: 'user' as const,
        content: '最后请列出5-8个适合的话题标签。'
      })
    }

    if (platform === 'douyin') {
      messages.push({
        role: 'user' as const,
        content: '最后请给出3-5个热门话题标签。'
      })
    }

    const response = await getDeepSeekClient().chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })

    const fullContent = response.choices[0]?.message?.content || ''

    // 解析标题和内容
    if (platform === 'xiaohongshu') {
      const lines = fullContent.split('\n').filter(l => l.trim())
      const hashtags = lines.filter(l => l.startsWith('#')).map(h => h.trim())
      const bodyLines = lines.filter(l => !l.startsWith('#'))
      results[platform] = {
        title: bodyLines[0]?.slice(0, 100) || topic,
        content: bodyLines.slice(1).join('\n') || fullContent,
        hashtags
      }
    } else if (platform === 'douyin') {
      const lines = fullContent.split('\n').filter(l => l.trim())
      const hashtags = lines.filter(l => l.startsWith('#')).map(h => h.trim())
      results[platform] = {
        title: lines[0]?.slice(0, 50) || topic,
        content: fullContent,
        hashtags
      }
    } else {
      const lines = fullContent.split('\n').filter(l => l.trim())
      results[platform] = {
        title: lines[0]?.slice(0, 100) || topic,
        content: fullContent
      }
    }
  }

  return results
}

export async function generateContentStream(req: GenerateRequest) {
  const { topic, platforms, tone = 'casual', length = 'medium' } = req

  const toneInstruction = {
    casual: '轻松随意的风格，像朋友聊天',
    professional: '专业严谨的风格，权威可信',
    humorous: '幽默风趣的风格，让人开心'
  }

  // 为每个平台创建流
  const streams = await Promise.all(
    platforms.map(async (platform) => {
      const config = platformPrompts[platform]
      const lengthDesc = config.length[length]

      const messages = [
        { role: 'system' as const, content: config.system },
        {
          role: 'user' as const,
          content: `请为以下主题创作内容：
主题：${topic}
语气风格：${toneInstruction[tone]}
内容长度：${lengthDesc}

请直接输出内容。`
        }
      ]

      if (platform === 'xiaohongshu') {
        messages.push({
          role: 'user' as const,
          content: '最后请列出5-8个适合的话题标签。'
        })
      }

      if (platform === 'douyin') {
        messages.push({
          role: 'user' as const,
          content: '最后请给出3-5个热门话题标签。'
        })
      }

      const stream = await getDeepSeekClient().chat.completions.create({
        model: 'deepseek-chat',
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })

      return { platform, stream }
    })
  )

  return streams
}
