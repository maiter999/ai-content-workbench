// AI 模型调用工具函数（客户端版本 - 通过 API Route 调用）
// 所有 API Key 都在服务器端保护，前端不直接调用 AI API

const API_BASE = '/api'

// 统一的 AI 内容生成函数
export async function generateContent(
  prompt: string,
  systemPrompt?: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      systemPrompt,
      options
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API 调用失败: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content
}

// 检查 AI 配置状态（通过 API Route）
export async function checkAIConfig() {
  // 由于 API Keys 现在在服务器端，我们无法直接检查
  // 但可以通过尝试调用一个测试 generations 来验证
  // 这里返回一个默认配置
  return {
    deepseek: true, // 假设已配置，实际由服务器端验证
    qwen: false,
    wenxin: false,
    spark: false,
    glm: false,
    defaultModel: 'deepseek'
  }
}

// 获取默认系统提示词
export function getDefaultSystemPrompt(type: string): string {
  const prompts: Record<string, string> = {
    xiaohongshu: `你是一位资深的小红书内容创作者，擅长创作爆款笔记。
要求：
1. 标题要吸引眼球，使用emoji
2. 内容简洁有力，段落清晰
3. 使用小红书常用语（如：姐妹们、宝藏、绝绝子）
4. 添加相关话题标签
5. 字数控制在300-800字`,

    wechat: `你是一位专业的公众号内容编辑，擅长创作高质量的原创文章。
要求：
1. 标题要吸引人但不标题党
2. 文章结构清晰，逻辑严密
3. 语言流畅，有深度有温度
4. 适合公众号阅读习惯
5. 字数1000-3000字`,

    rewrite: `你是一位内容优化专家，擅长改进文章的可读性和吸引力。
要求：
1. 保持原文核心观点和事实
2. 改进表达方式，提升可读性
3. 优化标题，增加点击率
4. 调整结构，增强逻辑性
5. 适合目标平台风格`
  }

  return prompts[type] || ''
}

export default {
  generateContent,
  checkAIConfig,
  getDefaultSystemPrompt
}
