/**
 * 环境变量类型定义
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // DeepSeek (推荐)
    NEXT_PUBLIC_DEEPSEEK_API_KEY?: string
    
    // 通义千问
    NEXT_PUBLIC_QWEN_API_KEY?: string
    NEXT_PUBLIC_QWEN_MODEL?: string
    
    // 文心一言
    NEXT_PUBLIC_WENXIN_API_KEY?: string
    NEXT_PUBLIC_WENXIN_SECRET_KEY?: string
    
    // 讯飞星火
    NEXT_PUBLIC_SPARK_API_KEY?: string
    NEXT_PUBLIC_SPARK_APP_ID?: string
    
    // 智谱 ChatGLM
    NEXT_PUBLIC_GLM_API_KEY?: string
    
    // 默认模型
    NEXT_PUBLIC_DEFAULT_AI_MODEL?: 'deepseek' | 'qwen' | 'wenxin' | 'spark' | 'glm'
    
    // 图片生成
    NEXT_PUBLIC_IMAGE_GEN_API_KEY?: string
  }
}
