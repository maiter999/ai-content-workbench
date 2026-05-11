import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTransaction, calculateCreditsNeeded } from '@/lib/transactions'

// 支持的平台配置（服务器端，API Key受保护）
const AI_PLATFORMS = {
  deepseek: {
    name: 'DeepSeek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    enabled: !!process.env.DEEPSEEK_API_KEY
  },
  qwen: {
    name: '通义千问',
    apiKey: process.env.QWEN_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: process.env.QWEN_MODEL || 'qwen-turbo',
    enabled: !!process.env.QWEN_API_KEY
  },
  wenxin: {
    name: '文心一言',
    apiKey: process.env.WENXIN_API_KEY,
    secretKey: process.env.WENXIN_SECRET_KEY,
    enabled: !!process.env.WENXIN_API_KEY
  },
  spark: {
    name: '讯飞星火',
    apiKey: process.env.SPARK_API_KEY,
    appId: process.env.SPARK_APP_ID,
    enabled: !!process.env.SPARK_API_KEY
  },
  glm: {
    name: '智谱ChatGLM',
    apiKey: process.env.GLM_API_KEY,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    model: 'glm-4-flash',
    enabled: !!process.env.GLM_API_KEY
  }
}

// 调用DeepSeek (OpenAI兼容接口)
async function callDeepSeek(prompt: string, systemPrompt?: string, options?: any) {
  const config = AI_PLATFORMS.deepseek

  if (!config.apiKey) {
    throw new Error('DeepSeek API Key 未配置')
  }

  const messages: any[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`DeepSeek API 错误: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// 调用通义千问 (OpenAI兼容接口)
async function callQwen(prompt: string, systemPrompt?: string, options?: any) {
  const config = AI_PLATFORMS.qwen

  if (!config.apiKey) {
    throw new Error('通义千问 API Key 未配置')
  }

  const messages: any[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`通义千问 API 错误: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// 调用智谱ChatGLM (OpenAI兼容接口)
async function callGLM(prompt: string, systemPrompt?: string, options?: any) {
  const config = AI_PLATFORMS.glm

  if (!config.apiKey) {
    throw new Error('智谱 ChatGLM API Key 未配置')
  }

  const messages: any[] = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`智谱 ChatGLM API 错误: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// 统一生成入口
async function generateContent(
  prompt: string,
  systemPrompt?: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
) {
  const model = options?.model || process.env.DEFAULT_AI_MODEL || 'deepseek'

  switch (model) {
    case 'deepseek':
      return await callDeepSeek(prompt, systemPrompt, options)
    case 'qwen':
      return await callQwen(prompt, systemPrompt, options)
    case 'glm':
      return await callGLM(prompt, systemPrompt, options)
    default:
      // 默认使用DeepSeek
      return await callDeepSeek(prompt, systemPrompt, options)
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. 获取当前用户
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, systemPrompt, options, platforms } = body

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt' },
        { status: 400 }
      )
    }

    // 2. 计算所需积分
    const creditsNeeded = calculateCreditsNeeded(platforms || ['default'], false)
    
    // 3. 检查积分是否充足
    if (user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: `积分不足，需要 ${creditsNeeded} 积分，当前余额 ${user.credits}` },
        { status: 403 }
      )
    }

    // 4. 生成内容
    const content = await generateContent(prompt, systemPrompt, options)

    // 5. 扣除积分（创建交易记录）
    const description = `内容生成（${platforms?.join(', ') || '默认'}）`
    await createTransaction(
      user.id,
      'consume',
      -creditsNeeded,
      description,
      platforms?.[0]
    )

    // 6. 保存到数据库
    const title = prompt.substring(0, 50) // 使用prompt前50字符作为标题
    await prisma.content.create({
      data: {
        userId: user.id,
        title,
        body: content,
        topic: prompt,
        status: 'published',
        platforms: JSON.stringify(platforms || []),
        creditsUsed: creditsNeeded
      }
    })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('API生成错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '生成失败，请稍后重试'
      },
      { status: 500 }
    )
  }
}
