import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

interface TitleRequest {
  topic: string
  industry?: string
  platform: string
  style: string
  count: number
}

const stylePrompts: Record<string, string> = {
  '悬念好奇型': '制造悬念和好奇心，让读者忍不住想点击',
  '数字吸引型': '使用具体数字，让标题更有说服力和吸引力',
  '情感共鸣型': '触动读者情感，引发共鸣和认同',
  '干货分享型': '突出实用价值和干货内容，让读者觉得有收获',
  '热点借势型': '结合热点话题，增加时效性和关注度',
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body: TitleRequest = await request.json()
    const { topic, industry, platform, style, count } = body

    if (!topic || !platform || !style) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: '未配置AI API Key' }, { status: 500 })
    }

    const stylePrompt = stylePrompts[style] || stylePrompts['悬念好奇型']
    const industryPrompt = industry ? `行业领域：${industry}` : ''
    const platformPrompt = platform === '小红书' ? '小红书风格，可以带emoji' :
                          platform === '公众号' ? '公众号风格，专业有深度' :
                          platform === '抖音' ? '抖音风格，简短有力' :
                          platform === '朋友圈' ? '朋友圈风格，亲切自然' : ''

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一位爆款标题创作专家。请根据主题生成${count}个吸引人的标题。
标题风格：${stylePrompt}
目标平台：${platform}，${platformPrompt}
${industryPrompt}
要求：
1. 每个标题都要独特，不要重复
2. 标题要有吸引力，能引发点击欲望
3. 标题长度适中，适合${platform}平台
4. 直接输出标题列表，每行一个，不要添加序号或解释`
          },
          {
            role: 'user',
            content: `请为"${topic}"生成${count}个${style}风格的爆款标题`
          }
        ],
        temperature: 0.9,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: '生成失败', details: error.message },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // 解析标题列表
    const titles = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .slice(0, count)

    return NextResponse.json({
      success: true,
      titles,
      count: titles.length
    })

  } catch (error: any) {
    console.error('Title generation error:', error)
    return NextResponse.json(
      { error: '服务器错误', message: error.message },
      { status: 500 }
    )
  }
}
