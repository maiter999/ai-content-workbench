import { NextResponse } from 'next/server'

interface GenerateImageRequest {
  prompt: string
  negativePrompt?: string
  size?: '1024*1024' | '720*1280' | '1280*720'
  style?: 'photographic' | 'cartoon' | 'oil_painting' | 'watercolor'
  numImages?: number
}

export async function POST(request: Request) {
  try {
    // 检查用户登录
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body: GenerateImageRequest = await request.json()
    const { prompt, negativePrompt, size, style, numImages } = body

    // 验证必填参数
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '请输入图片描述（prompt）' },
        { status: 400 }
      )
    }

    // 获取通义万象API Key
    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: '未配置通义万象API Key，请在 .env.local 中配置 DASHSCOPE_API_KEY' },
        { status: 500 }
      )
    }

    // 构建请求体
    const requestBody = {
      model: 'wanx-v1', // 通义万象文生图模型
      input: {
        prompt: prompt.trim(),
        ...(negativePrompt && { negative_prompt: negativePrompt.trim() })
      },
      parameters: {
        size: size || '1024*1024',
        style: style || 'photographic',
        n: numImages || 1,
        seed: Math.floor(Math.random() * 1000000)
      }
    }

    // 调用通义万象API
    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-DashScope-Async': 'disable' // 同步调用，等待生成完成
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('通义万象API错误:', errorData)
      return NextResponse.json(
        { 
          error: '图片生成失败',
          details: errorData.message || `HTTP ${response.status}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // 解析返回的图片URL
    // 通义万象返回格式: data.output.results[0].url
    if (!data.output || !data.output.results || data.output.results.length === 0) {
      return NextResponse.json(
        { error: '生成的图片数据格式异常' },
        { status: 500 }
      )
    }

    const imageUrls = data.output.results.map((result: any) => result.url)

    return NextResponse.json({
      success: true,
      images: imageUrls,
      requestId: data.request_id,
      ...(data.usage && { usage: data.usage })
    })

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
        name: '通义万象 v1',
        description: '阿里云通义万象文生图模型，支持多种风格',
        sizes: ['1024*1024', '720*1280', '1280*720'],
        styles: ['photographic', 'cartoon', 'oil_painting', 'watercolor']
      }
    ],
    maxImagesPerRequest: 4,
    supportedFormats: ['PNG', 'JPEG']
  })
}
