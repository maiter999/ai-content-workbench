import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

interface RewriteRequest {
  originalText: string
  mode: string
  target: string
  requirements?: string
}

const modePrompts: Record<string, string> = {
  '保留风格改写': '保留原文的写作风格和语气，对内容进行重新组织和表达，让文章更加流畅自然',
  '换人设改写': '换一个不同的人设角度来改写这篇文章，保持核心信息不变，但表达方式要符合新的人设特征',
  '精简缩写': '将原文精简压缩，保留核心要点，去除冗余内容，让文章更加简洁有力',
  '扩写丰富': '在原文基础上进行扩写，增加细节描述、案例说明和数据支撑，让内容更加丰富饱满',
  '口语化改写': '将原文改写成更加口语化、接地气的表达方式，像朋友聊天一样自然亲切',
  '书面化改写': '将原文改写成更加正式、专业的书面表达，适合正式场合和商务场景',
  '反转角色改写': '从相反的角度或对立面来重新阐述原文内容，提供不同的视角和思考',
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body: RewriteRequest = await request.json()
    const { originalText, mode, target, requirements } = body

    if (!originalText || !mode) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: '未配置AI API Key' }, { status: 500 })
    }

    const modePrompt = modePrompts[mode] || modePrompts['保留风格改写']
    const platformPrompt = target === '小红书' ? '适合小红书平台风格，带emoji，口语化' :
                          target === '公众号' ? '适合公众号平台风格，专业有深度' :
                          target === '抖音' ? '适合抖音平台风格，简短有力，有冲击力' :
                          target === '朋友圈' ? '适合朋友圈风格，亲切自然，不刻意' : ''

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
            content: `你是一位专业的内容改写专家。请根据用户要求对原文进行改写。
改写要求：${modePrompt}
目标平台：${target}，${platformPrompt}
${requirements ? '补充要求：' + requirements : ''}
请直接输出改写后的文章，不要添加任何解释说明。`
          },
          {
            role: 'user',
            content: `请改写以下文章：\n\n${originalText}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: '改写失败', details: error.message },
        { status: response.status }
      )
    }

    const data = await response.json()
    const rewrittenText = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      result: rewrittenText,
      mode,
      target
    })

  } catch (error: any) {
    console.error('Rewrite error:', error)
    return NextResponse.json(
      { error: '服务器错误', message: error.message },
      { status: 500 }
    )
  }
}
