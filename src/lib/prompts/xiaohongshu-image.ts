// 小红书配图生成 - 文生图提示词配置
// 作用：将文章内容通过DeepSeek分析，生成适合通义万象的英文提示词

export const imagePromptConfig = {
  systemPrompt: `你是一个顶尖的AI艺术指导，专门将小红书笔记转化为超高质量的通义万象文生图提示词。

你的任务是根据用户提供的小红书笔记正文和内容风格，生成一个能直接输入通义万象的视觉描述。

要求：
1. 必须使用英文提示词（通义万象对英文效果最优），但要包含关键的中文元素词（如中国地名、品牌中文名）。
2. 提示词必须包含：主体描述、环境/背景、灯光氛围、构图角度、风格滤镜（如电影感、日系胶片、极简主义、高细节C4D渲染等）。
3. 根据风格调整视觉风格：
   - 种草安利：产品摆拍，柔光，景深，干净背景，奶油色调，高细节特写
   - 攻略测评：信息图风格，对比图布局，明亮的工作室灯光，干净简约
   - 避坑指南：夸张对比，红黑撞色，警示感，新闻快照风格，强烈阴影
   - 实拍探店：治愈感，窗边自然光，烟火气，暖色调，浅景深，胶片质感
   - 数据对比：未来科技感图表，分屏对比，冷色与暖色冲突，3D数据图
4. 不要包含任何文字水印描述，但要描述图片上的文字位置内容（如"左边标红X，右边标绿勾"）。
5. 输出只包含图片提示词本身，不要添加解释。

请根据以下内容生成提示词：`,

  // 风格对应的视觉关键词
  styleKeywords: {
    '种草安利': 'soft lighting, bokeh background, cream color tone, high detail close-up, product photography, dreamy atmosphere, shallow depth of field, clean minimalist background, warm highlights',
    '攻略评测': 'infographic style, comparison layout, bright studio lighting, clean and minimalist, professional product shot, organized grid composition, crisp and clear',
    '避坑指南': 'dramatic contrast, red and black color clash, warning mood, news snapshot style, strong shadows, bold graphic design, satirical undertone',
    '实拍探店': 'healing vibe, natural window light, lifestyle atmosphere, warm tones, shallow depth of field, film grain texture, cozy and inviting, golden hour lighting',
    '数据对比': 'futuristic tech aesthetic, split screen comparison, cool vs warm color clash, 3D data visualization, sci-fi interface, modern digital art style, clean charts and graphs',
  },
}

// 构建生成图片提示词的函数
export function buildImagePrompt(
  articleContent: string,
  contentStyle: string
): { systemPrompt: string; userPrompt: string } {
  const styleKeywords = imagePromptConfig.styleKeywords
  const styleKeyword = styleKeywords[contentStyle as keyof typeof styleKeywords] || styleKeywords['种草安利']

  return {
    systemPrompt: imagePromptConfig.systemPrompt,
    userPrompt: `## 内容风格：${contentStyle}

## 风格参考关键词：
${styleKeyword}

## 小红书笔记正文：
${articleContent}

---

请根据以上内容，生成一个能直接输入通义万象的图片提示词。输出格式：仅输出英文提示词，不要任何解释或其他内容。`,
  }
}

// 通义万象API配置
export const tongyiWanxiangConfig = {
  // 通义万象 API endpoint
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',

  // 常用图片尺寸
  sizes: {
    '小红书封面': '768*1152',  // 2:3 接近3:4比例（通义万象支持）
    '朋友圈1:1': '1024*1024',
    '朋友圈3:4': '768*1152',
    '公众号封面': '720*1280',  // 9:16 竖版
  },

  // 图片风格选项
  styles: [
    { id: 'auto', name: '智能优化', desc: '自动匹配最佳风格' },
    { id: 'realistic', name: '真实摄影', desc: '照片级真实感' },
    { id: 'anime', name: '动漫插画', desc: '二次元动漫风格' },
    { id: 'illustration', name: '商业插画', desc: '扁平插画风格' },
  ],
}
