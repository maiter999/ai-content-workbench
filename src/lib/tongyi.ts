import OpenAI from 'openai'

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
})

/**
 * 通义万象文生图API调用
 */
export async function generateImageWithTongyi(
  prompt: string,
  size: string = '768*1152'  // 默认小红书封面比例 2:3（通义万象支持）
): Promise<string> {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.TONGYI_API_KEY || ''

  if (!apiKey) {
    throw new Error('未配置通义万象API密钥')
  }

  // 使用异步模式（同步模式不支持）
  const response = await fetch(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable'
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: prompt
        },
        parameters: {
          size: size,
          n: 1
        }
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`通义万象API错误: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // 异步模式返回 task_id，需要轮询获取结果
  if (data.output?.task_id) {
    return await pollTongyiTask(data.output.task_id, apiKey)
  }

  throw new Error('通义万象返回格式异常')
}

/**
 * 轮询通义万象任务结果
 * 动态间隔：开始等久，后面加快
 */
async function pollTongyiTask(taskId: string, apiKey: string, maxAttempts: number = 60): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    // 动态间隔：前面等2秒，后面等1秒
    const delay = i < 5 ? 2000 : 1000
    await new Promise(resolve => setTimeout(resolve, delay))

    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()

      if (data.output?.task_status === 'SUCCEEDED' && data.output?.results?.[0]?.url) {
        return data.output.results[0].url
      }

      if (data.output?.task_status === 'FAILED') {
        throw new Error('通义万象图片生成失败')
      }
    }
  }

  throw new Error('通义万象图片生成超时')
}

/**
 * 快速生成图片提示词（简化版）
 * 省去复杂描述，直接提取主题 + 拼接风格模板
 */
export async function generateImagePromptFast(
  articleContent: string,
  contentStyle: string
): Promise<string> {
  const styleTemplates: Record<string, string> = {
    '种草安利': 'Soft warm lighting, bokeh background, cream color tone, dreamy shallow depth of field, cozy lifestyle atmosphere',
    '攻略评测': 'Bright clean studio lighting, professional product showcase, organized minimalist composition, crisp and modern',
    '避坑指南': 'Dramatic contrast lighting, bold graphic design, strong shadows, warning atmosphere',
    '实拍探店': 'Natural window light, warm lifestyle mood, film grain texture, golden hour atmosphere, inviting cozy vibe',
    '数据对比': 'Futuristic tech aesthetic, clean digital visualization, modern sci-fi interface, cool blue tones',
  }

  // 简化prompt：提取主题 + 拼接风格
  const systemPrompt = `你是一个AI绘画助手。请从用户内容中提取1-2个核心视觉主题词（英文），如产品名、场景、地点。

输出格式：仅输出主题词，不要解释。`

  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `内容风格：${contentStyle}\n\n文章内容：\n${articleContent.substring(0, 500)}`
      }
    ],
    temperature: 0.3,
    max_tokens: 50  // 只提取主题词，极简
  })

  const topic = response.choices[0]?.message?.content?.trim() || 'beautiful scene'
  const style = styleTemplates[contentStyle] || styleTemplates['种草安利']

  // 拼接成最终提示词
  return `${topic}, ${style}, high quality, detailed, 4K`
}

/**
 * 使用DeepSeek生成图片提示词
 */
export async function generateImagePrompt(
  articleContent: string,
  contentStyle: string
): Promise<string> {
  // 使用快速版本
  return generateImagePromptFast(articleContent, contentStyle)
}
