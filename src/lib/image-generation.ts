/**
 * 通义万象（阿里云）图片生成工具库
 * 文档：https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-wanxiang-wenstext-to-image-api
 */

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'

export interface ImageGenerationOptions {
  prompt: string
  negativePrompt?: string
  size?: '1024*1024' | '720*1280' | '1280*720'
  style?: 'photographic' | 'cartoon' | 'oil_painting' | 'watercolor'
  numImages?: number
  seed?: number
}

export interface ImageGenerationResult {
  success: boolean
  images: string[] // 图片URL数组
  requestId: string
  usage?: {
    image_count: number
  }
  error?: string
}

/**
 * 调用通义万象API生成图片
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY

  if (!apiKey) {
    return {
      success: false,
      images: [],
      requestId: '',
      error: '未配置 DASHSCOPE_API_KEY 环境变量'
    }
  }

  const {
    prompt,
    negativePrompt,
    size = '1024*1024',
    style = 'photographic',
    numImages = 1,
    seed = Math.floor(Math.random() * 1000000)
  } = options

  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'disable' // 同步调用
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt,
          ...(negativePrompt && { negative_prompt: negativePrompt })
        },
        parameters: {
          size,
          style,
          n: numImages,
          seed
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        images: [],
        requestId: '',
        error: errorData.message || `HTTP ${response.status}`
      }
    }

    const data = await response.json()

    // 解析返回的图片URL
    if (!data.output?.results || data.output.results.length === 0) {
      return {
        success: false,
        images: [],
        requestId: data.request_id || '',
        error: '生成的图片数据格式异常'
      }
    }

    const images = data.output.results.map((result: any) => result.url)

    return {
      success: true,
      images,
      requestId: data.request_id,
      ...(data.usage && { usage: data.usage })
    }

  } catch (error: any) {
    return {
      success: false,
      images: [],
      requestId: '',
      error: error.message || '网络错误'
    }
  }
}

/**
 * 验证API Key是否有效
 */
export async function validateApiKey(): Promise<boolean> {
  const apiKey = process.env.DASHSCOPE_API_KEY
  if (!apiKey) return false

  try {
    // 发送一个简单的测试请求
    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: { prompt: 'test' },
        parameters: { size: '1024*1024', n: 1 }
      })
    })

    // 如果返回 401 或 403，说明API Key无效
    if (response.status === 401 || response.status === 403) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * 获取可用的图片尺寸
 */
export function getAvailableSizes(): { value: string; label: string; desc: string }[] {
  return [
    { value: '1024*1024', label: '1024×1024', desc: '方形 1:1，适合社交媒体' },
    { value: '720*1280', label: '720×1280', desc: '竖版 9:16，适合手机壁纸' },
    { value: '1280*720', label: '1280×720', desc: '横版 16:9，适合封面图' }
  ]
}

/**
 * 获取可用的图片风格
 */
export function getAvailableStyles(): { value: string; label: string; icon: string }[] {
  return [
    { value: 'photographic', label: '写实摄影', icon: '📷' },
    { value: 'cartoon', label: '卡通动漫', icon: '🎨' },
    { value: 'oil_painting', label: '油画风格', icon: '🖼️' },
    { value: 'watercolor', label: '水彩画', icon: '🎨' }
  ]
}
