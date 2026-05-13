import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildMiniprogramPrompt, MiniprogramStyle } from '@/lib/prompts/miniprogram'

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
})

// 模型档位配置
interface ModelConfig {
  model: string
  temperature: number
  max_tokens: number
  search_replace_newline?: boolean
  thinking_depth?: string
}

const modelConfig: Record<string, ModelConfig> = {
  'fast': {
    model: 'deepseek-chat',
    temperature: 0.9,
    max_tokens: 800
  },
  'standard': {
    model: 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 1000
  },
  'think': {
    model: 'deepseek-reasoner',
    temperature: 0.5,
    max_tokens: 2000,
    search_replace_newline: true,
    thinking_depth: 'high'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, contentStyle, industry, requirements, materials, modelLevel = 'standard' } = body

    if (!topic) {
      return NextResponse.json(
        { error: '请输入主题' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API密钥未配置' },
        { status: 500 }
      )
    }

    // 验证风格
    const validStyles: MiniprogramStyle[] = ['探店旅行', '好物穿搭', '攻略教程']
    const style = (validStyles.includes(contentStyle) ? contentStyle : '探店旅行') as MiniprogramStyle

    // 构建提示词
    const { systemPrompt, userPrompt } = buildMiniprogramPrompt(style, {
      topic,
      industry,
      requirements,
      materials
    })

    // 调用DeepSeek
    const config = modelConfig[modelLevel] || modelConfig.standard
    const requestParams: any = {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: config.temperature,
      max_tokens: config.max_tokens
    }

    // 思考模式额外参数
    if (config.search_replace_newline) {
      requestParams.search_replace_newline = true
    }
    if (config.thinking_depth) {
      requestParams.thinking_depth = config.thinking_depth
    }

    const response = await deepseek.chat.completions.create(requestParams)

    const content = response.choices[0]?.message?.content || ''

    if (!content) {
      return NextResponse.json(
        { error: '生成内容为空，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      content,
      style,
      model: modelLevel
    })

  } catch (error: any) {
    console.error('[小绿书生成] 错误:', error)

    return NextResponse.json(
      {
        error: error.message || '生成失败，请稍后重试'
      },
      { status: 500 }
    )
  }
}
