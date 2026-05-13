import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// 风格映射：前端格式 -> API 格式
const styleMap: Record<string, string> = {
  'photographic': '<photography>',
  'cartoon': '<3d cartoon>',
  'anime': '<anime>',
  'oil_painting': '<oil painting>',
  'watercolor': '<watercolor>',
  'chinese_painting': '<chinese painting>',
  'sketch': '<sketch>',
  'flat_illustration': '<flat illustration>',
  'portrait': '<portrait>',
  'auto': '<auto>',
}

interface GenerateImageRequest {
  prompt: string
  negativePrompt?: string
  size?: '1024*1024' | '720*1280' | '1280*720' | '1024*1792' | '1792*1024'
  style?: 'photographic' | 'cartoon' | 'anime' | 'oil_painting' | 'watercolor' | 'chinese_painting' | 'sketch'
  numImages?: number
  seed?: number
  ref_image?: string  // Base64 编码的参考图
  ref_image_strength?: number  // 参考图强度 0-1
}

export async function POST(request: Request) {
  try {
    // 检查用户登录（使用 Cookie 认证）
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body: GenerateImageRequest = await request.json()
    const { prompt, negativePrompt, size, style, numImages, seed, ref_image, ref_image_strength } = body

    // 验证必填参数
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '请输入图片描述（prompt）' },
        { status: 400 }
      )
    }

    // 获取AI生图大模型API Key
    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: '未配置AI生图大模型API Key，请在 .env.local 中配置 DASHSCOPE_API_KEY' },
        { status: 500 }
      )
    }

    // 构建请求体
    // 转换风格参数为 API 格式
    const apiStyle = style ? (styleMap[style] || '<photography>') : '<photography>'
    
    const requestBody: any = {
      model: 'wanx-v1', // AI生图大模型
      input: {
        prompt: prompt.trim(),
      },
      parameters: {
        size: size || '1024*1024',
        style: apiStyle,
        n: Math.min(numImages || 1, 4), // 最多4张
      }
    }

    // 添加负面提示词
    if (negativePrompt && negativePrompt.trim()) {
      requestBody.input.negative_prompt = negativePrompt.trim()
    }

    // 添加随机种子
    if (seed !== undefined && seed !== null) {
      requestBody.parameters.seed = seed
    } else {
      requestBody.parameters.seed = Math.floor(Math.random() * 1000000)
    }

    // 添加参考图（如果有）
    if (ref_image && ref_image_strength !== undefined) {
      requestBody.input.ref_image = ref_image
      requestBody.parameters.ref_image_strength = ref_image_strength
    }

    // 调用AI生图大模型API（使用异步模式）
    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-DashScope-Async': 'enable' // 异步调用
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('AI生图大模型API错误:', errorData)
      return NextResponse.json(
        { 
          error: '图片生成失败',
          details: errorData.message || errorData.code || `HTTP ${response.status}`
        },
        { status: response.status }
      )
    }

    // 获取异步任务ID
    const asyncData = await response.json()
    const taskId = asyncData.output?.task_id
    
    if (!taskId) {
      console.error('无法获取task_id:', asyncData)
      return NextResponse.json(
        { error: '无法获取异步任务ID' },
        { status: 500 }
      )
    }

    // 轮询等待任务完成（最多等待90秒）
    const maxAttempts = 45
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 每2秒检查一次
      
      const statusRes = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      )

      if (statusRes.ok) {
        const statusData = await statusRes.json()
        const status = statusData.output?.task_status
        console.log(`任务状态 [${i+1}/${maxAttempts}]:`, status)
        
        if (status === 'SUCCEEDED') {
          // 任务成功，获取结果
          const results = statusData.output?.results || []
          if (results.length === 0) {
            return NextResponse.json(
              { error: '生成的图片数据为空' },
              { status: 500 }
            )
          }
          
          const imageUrls = results.map((r: any) => r.url)
          return NextResponse.json({
            success: true,
            images: imageUrls,
            requestId: taskId,
            seed: requestBody.parameters.seed,
            mode: 'async'
          })
        } else if (status === 'FAILED') {
          return NextResponse.json(
            { 
              error: '图片生成任务失败', 
              details: statusData.output?.message || statusData.output?.code 
            },
            { status: 500 }
          )
        }
        // 继续等待...
      } else {
        console.error('查询任务状态失败:', statusRes.status)
      }
    }

    return NextResponse.json(
      { error: '图片生成超时，请稍后重试' },
      { status: 504 }
    )

  } catch (error: any) {
    console.error('图片生成错误:', error)
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// 获取图片生成配置信息
export async function GET() {
  return NextResponse.json({
    models: [
      {
        id: 'wanx-v1',
        name: 'AI生图大模型 v1',
        description: 'AI生图大模型，支持多种风格',
        sizes: ['1024*1024', '720*1280', '1280*720', '1024*1792', '1792*1024'],
        styles: [
          { id: 'photographic', name: '写实摄影' },
          { id: 'cartoon', name: '动漫卡通' },
          { id: 'oil_painting', name: '油画' },
          { id: 'watercolor', name: '水彩' },
          { id: 'chinese_painting', name: '国风' },
          { id: 'sketch', name: '素描' },
        ]
      }
    ],
    maxImagesPerRequest: 4,
    supportedFormats: ['PNG', 'JPEG']
  })
}
