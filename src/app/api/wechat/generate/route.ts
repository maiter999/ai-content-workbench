import { NextRequest, NextResponse } from 'next/server'
import { getDeepSeekClient } from '@/lib/deepseek'
import { buildPrompt, WechatStyle } from '@/lib/prompts/wechat'
// 模型档位配置
interface ModelConfig {
  model: string
  temperature: number
  max_tokens: number
  reasoning_level?: string  // 快速模式用
  search_replace_newline?: boolean  // 智能搜索
  thinking_depth?: string  // 思考深度
}

const modelConfig: Record<string, ModelConfig> = {
  // 快速模式 - DeepSeek 快速响应
  'fast': {
    model: 'deepseek-chat',
    temperature: 0.9,
    max_tokens: 1500
  },
  // 标准模式 - DeepSeek 专家模式
  'standard': {
    model: 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 2000
  },
  // 思考模式 - DeepSeek 专家 + 深度思考 + 智能搜索
  'think': {
    model: 'deepseek-reasoner',
    temperature: 0.5,
    max_tokens: 4000,
    search_replace_newline: true,
    thinking_depth: 'high'
  }
}

export type ModelLevel = 'fast' | 'standard' | 'think'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, contentStyle, industry, requirements, materials, modelLevel = 'standard' } = body

    if (!topic) {
      return NextResponse.json(
        { error: '请输入文章主题' },
        { status: 400 }
      )
    }

    // 检查API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API密钥未配置' },
        { status: 500 }
      )
    }

    // 验证风格
    const validStyles: WechatStyle[] = ['专业深度', '故事叙事', '干货清单', '热点评论', '通知公告']
    const style = (validStyles.includes(contentStyle) ? contentStyle : '专业深度') as WechatStyle

    // 构建提示词
    const { systemPrompt, userPrompt } = buildPrompt(style, {
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

    const response = await getDeepSeekClient().chat.completions.create(requestParams)

    const content = response.choices[0]?.message?.content || ''

    if (!content) {
      return NextResponse.json(
        { error: '生成内容为空，请稍后重试' },
        { status: 500 }
      )
    }

    // TODO: 扣除用户积分
    // TODO: 保存生成记录到数据库

    return NextResponse.json({
      success: true,
      content,
      style,
      model: modelLevel
    })

  } catch (error: any) {
    console.error('[公众号文章生成] 错误:', error)

    return NextResponse.json(
      {
        error: error.message || '生成失败，请稍后重试'
      },
      { status: 500 }
    )
  }
}
