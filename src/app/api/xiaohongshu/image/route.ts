import { NextRequest, NextResponse } from 'next/server'
import { generateImagePrompt, generateImageWithTongyi } from '@/lib/tongyi'
import { getCurrentUser } from '@/lib/auth'
import { createTransaction } from '@/lib/transactions'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { articleContent, contentStyle, imageSize = '768*1152' } = body

    if (!articleContent) {
      return NextResponse.json(
        { error: '缺少文章内容' },
        { status: 400 }
      )
    }

    // 检查积分
    const userData = await prisma.user.findUnique({ where: { id: user.id } })
    if (!userData || userData.credits < 1) {
      return NextResponse.json({ error: '积分不足，请充值' }, { status: 403 })
    }

    // 检查API密钥
    const deepseekKey = process.env.DEEPSEEK_API_KEY
    const tongyiKey = process.env.DASHSCOPE_API_KEY || process.env.TONGYI_API_KEY

    if (!deepseekKey || !tongyiKey) {
      return NextResponse.json(
        {
          error: 'API密钥未配置',
          details: !deepseekKey ? '缺少DeepSeek API密钥' : '缺少通义万象API密钥（DASHSCOPE_API_KEY）'
        },
        { status: 500 }
      )
    }

    // 步骤1: 使用DeepSeek生成图片提示词
    console.log('[配图生成] 步骤1: 生成图片提示词...')
    const imagePrompt = await generateImagePrompt(articleContent, contentStyle || '种草安利')
    console.log('[配图生成] 生成的提示词:', imagePrompt.substring(0, 100) + '...')

    // 步骤2: 使用通义万象生成图片
    console.log('[配图生成] 步骤2: 调用通义万象生成图片...')
    const imageUrl = await generateImageWithTongyi(imagePrompt, imageSize)
    console.log('[配图生成] 生成的图片URL:', imageUrl)

    // 步骤3: 扣除积分（创建交易记录）
    await createTransaction(
      user.id,
      'consume',
      -1,
      `生成小红书配图（${contentStyle || '种草安利'}风格）`,
      'xiaohongshu-image'
    )

    return NextResponse.json({
      success: true,
      imageUrl,
      imagePrompt,
      style: contentStyle || '种草安利'
    })

  } catch (error: any) {
    console.error('[配图生成] 错误:', error)

    return NextResponse.json(
      {
        error: error.message || '生成配图失败',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
