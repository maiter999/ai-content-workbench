import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildPrompt, type XiaohongshuStyle } from '@/lib/prompts/xiaohongshu'
import { createTransaction } from '@/lib/transactions'
import { getDeepSeekClient } from '@/lib/deepseek'

// 模型档位配置
interface ModelConfig {
  model: string
  temperature: number
  max_tokens: number
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
    temperature: 0.8,
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

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const { topic, contentStyle, industry, requirements, materials, modelLevel = 'standard' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: '请输入创作主题' }, { status: 400 })
    }

    // 检查积分
    const userData = await prisma.user.findUnique({ where: { id: user.id } })
    if (!userData || userData.credits < 1) {
      return NextResponse.json({ error: '积分不足，请充值' }, { status: 400 })
    }

    // 构建提示词
    const { systemPrompt, userPrompt } = buildPrompt(contentStyle as XiaohongshuStyle, {
      topic,
      industry,
      requirements,
      materials
    })

    // 调用 DeepSeek
    const config = modelConfig[modelLevel as keyof typeof modelConfig] || modelConfig.standard
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

    // 扣除积分（创建交易记录）
    await createTransaction(
      user.id,
      'consume',
      -1,
      `生成小红书文章：${topic}`,
      'xiaohongshu'
    )

    // 保存内容记录
    await prisma.content.create({
      data: {
        userId: user.id,
        title: topic,
        topic,
        body: content,
        status: 'draft'
      }
    })

    return NextResponse.json({
      success: true,
      content,
      remainingCredits: userData.credits - 1
    })
  } catch (error: any) {
    console.error('小红书生成失败:', error)
    return NextResponse.json(
      { error: error.message || '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
