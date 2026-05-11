'use client'

import { useState, useEffect } from 'react'
import { getKnowledgeDocs } from '@/lib/knowledge-share'
import { generateContent } from '@/lib/ai'

const headlineStyles = [
  { value: 'suspense', label: '悬念好奇型', icon: '🤔' },
  { value: 'number', label: '数字清单型', icon: '📊' },
  { value: 'contrast', label: '对比反差型', icon: '⚡' },
  { value: 'pain', label: '痛点扎心型', icon: '💔' },
  { value: 'authority', label: '权威背书型', icon: '🏆' },
  { value: 'urgency', label: '紧迫感型', icon: '⏰' },
  { value: 'story', label: '故事代入型', icon: '📖' },
  { value: 'mixed', label: '混合多风格', icon: '🎯' },
]

const industryOptions = [
  { value: '', label: '请选择行业领域' },
  { value: 'real-estate', label: '房地产' },
  { value: 'tech', label: '科技数码' },
  { value: 'education', label: '教育培训' },
  { value: 'finance', label: '金融财经' },
  { value: 'healthcare', label: '医疗健康' },
  { value: 'food', label: '餐饮美食' },
  { value: 'travel', label: '旅游出行' },
  { value: 'beauty', label: '美妆护肤' },
  { value: 'home', label: '家居生活' },
  { value: 'entertainment', label: '娱乐休闲' },
  { value: 'fashion', label: '服装配饰' },
  { value: 'parenting', label: '母婴亲子' },
  { value: 'fitness', label: '运动健身' },
  { value: 'automotive', label: '汽车出行' },
  { value: 'law', label: '法律咨询' },
  { value: 'agriculture', label: '农林牧渔' },
  { value: 'culture', label: '文化艺术' },
  { value: 'pets', label: '宠物用品' },
  { value: 'other', label: '其他行业' },
]

const rewriteTypes = [
  { value: 'keep-style', label: '保留风格改写' },
  { value: 'change-persona', label: '换人设改写' },
  { value: 'simplify', label: '精简缩写' },
  { value: 'expand', label: '扩写丰富' },
  { value: 'colloquial', label: '口语化改写' },
  { value: 'formal', label: '书面化改写' },
  { value: 'reverse', label: '反转视角改写' },
]

const platformOptions = [
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'wechat', label: '公众号' },
  { value: 'moments', label: '朋友圈' },
  { value: 'douyin', label: '抖音脚本' },
  { value: 'xiaolvshu', label: '微信小绿书' },
]

export default function RewritePage() {
  const [originalContent, setOriginalContent] = useState('')
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('')
  const [headlineStyle, setHeadlineStyle] = useState('suspense')
  const [headlinePlatform, setHeadlinePlatform] = useState('xiaohongshu')
  const [headlineCount, setHeadlineCount] = useState(5)
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false)
  const [headlines, setHeadlines] = useState<string[]>([])
  const [knowledgeDocs, setKnowledgeDocs] = useState<string[]>([])
  const [knowledge, setKnowledge] = useState('')
  const [error, setError] = useState('')

  const [rewriteType, setRewriteType] = useState('keep-style')
  const [targetPlatform, setTargetPlatform] = useState('xiaohongshu')
  const [requirements, setRequirements] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState('')

  // 加载时读取知识库文件列表
  useEffect(() => {
    const docs = getKnowledgeDocs()
    setKnowledgeDocs(['不使用知识库', ...docs.filter(d => d.status === 'ready').map(d => d.name)])
  }, [])

  const handleGenerateHeadline = async () => {
    if (!keyword) {
      alert('请输入主题关键词')
      return
    }
    setIsGeneratingHeadline(true)
    setError('')

    try {
      // 构建提示词
      let prompt = `请为以下主题生成${headlineCount}个爆款标题：\n\n`
      prompt += `主题：${keyword}\n`
      
      if (industry) {
        const industryLabel = industryOptions.find(opt => opt.value === industry)?.label
        prompt += `行业：${industryLabel || industry}\n`
      }
      
      const styleMap: Record<string, string> = {
        'suspense': '悬念好奇型 - 引发好奇心，让人忍不住点击',
        'number': '数字清单型 - 用数字增加可信度和吸引力',
        'contrast': '对比反差型 - 用反差制造冲突感',
        'pain': '痛点扎心型 - 直击用户痛点，引发共鸣',
        'authority': '权威背书型 - 用权威增加可信度',
        'urgency': '紧迫感型 - 制造紧迫感，促进行动',
        'story': '故事代入型 - 用故事吸引人继续阅读',
        'mixed': '混合多风格 - 生成不同风格的标题'
      }
      
      prompt += `风格：${styleMap[headlineStyle] || '混合多风格'}\n\n`
      
      prompt += `要求：
1. 标题要吸引人，让人忍不住点击
2. 使用emoji增加视觉吸引力
3. 控制在20字以内
4. 符合${headlinePlatform}平台风格
5. 生成${headlineCount}个标题，每个标题单独一行`

      const systemPrompt = `你是一个爆款标题专家，擅长创作吸引点击的标题。你会根据不同平台和风格创作合适的标题。`
      
      const content = await generateContent(prompt, systemPrompt, {
        temperature: 0.9  // 标题生成需要更多创意
      })
      
      // 解析生成的标题（按行分割）
      const lines = content.split('\n').filter(line => line.trim().length > 0)
      setHeadlines(lines.slice(0, headlineCount))
      
    } catch (err) {
      console.error('生成标题失败:', err)
      setError(`生成标题失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setIsGeneratingHeadline(false)
    }
  }

  const handleGenerate = async () => {
    if (!originalContent) {
      alert('请输入原文内容')
      return
    }
    setIsGenerating(true)
    setError('')

    try {
      // 构建提示词
      let prompt = `请将以下原文改写成适合目标平台的内容：\n\n`
      prompt += `原文：\n${originalContent}\n\n`
      
      const platformMap: Record<string, string> = {
        'xiaohongshu': '小红书',
        'wechat': '公众号',
        'moments': '朋友圈',
        'douyin': '抖音脚本',
        'xiaolvshu': '微信小绿书'
      }
      
      const rewriteTypeMap: Record<string, string> = {
        'keep-style': '保留风格改写 - 保持原文风格，优化表达',
        'change-persona': '换人设改写 - 改变人称和语气',
        'simplify': '精简缩写 - 保留核心，删除冗余',
        'expand': '扩写丰富 - 增加细节和例子',
        'colloquial': '口语化改写 - 更口语、更亲切',
        'formal': '书面化改写 - 更正式、更专业',
        'reverse': '反转视角改写 - 从相反角度重写'
      }
      
      prompt += `目标平台：${platformMap[targetPlatform] || targetPlatform}\n`
      prompt += `改写类型：${rewriteTypeMap[rewriteType] || rewriteType}\n\n`
      
      prompt += `要求：
1. 根据目标平台调整语言风格
2. 根据改写类型进行相应处理
3. 保持原文核心信息和观点
4. 优化表达，提升可读性
5. 添加平台合适的元素（如话题标签、emoji等）`
      
      if (requirements) {
        prompt += `\n\n补充要求：${requirements}`
      }
      
      if (knowledge && knowledge !== '不使用知识库') {
        prompt += `\n\n请结合"${knowledge}"知识库的内容进行改写`
      }

      const systemPrompt = `你是一个内容改写专家，擅长根据不同平台和改写需求优化内容。你会保留核心价值，同时让内容更适合目标平台和改写类型。`
      
      const content = await generateContent(prompt, systemPrompt, {
        temperature: 0.7
      })
      
      setResult(content)
      
    } catch (err) {
      console.error('改写失败:', err)
      setError(`改写失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">爆文改写</h1>
        <p className="text-gray-600 mt-1">将现有内容改写适配不同平台风格</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - 爆款标题生成 */}
        <div className="space-y-4">
          {/* 标题风格 & 目标平台 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题风格</label>
                <select
                  value={headlineStyle}
                  onChange={(e) => setHeadlineStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  {headlineStyles.map((style) => (
                    <option key={style.value} value={style.value}>{style.icon} {style.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标平台</label>
                <select
                  value={headlinePlatform}
                  onChange={(e) => setHeadlinePlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform.value} value={platform.value}>{platform.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 主题关键词 & 行业领域 & 生成数量 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主题关键词</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="输入主题关键词，如：减肥、AI工具、装修避坑..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">行业领域</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  {industryOptions.map((opt) => (
                    <option key={opt.value} value={opt.label}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
                <select
                  value={headlineCount}
                  onChange={(e) => setHeadlineCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value={3}>3条</option>
                  <option value={5}>5条</option>
                  <option value={10}>10条</option>
                </select>
              </div>
            </div>
          </div>

          {/* 生成爆款标题按钮 */}
          <button
            onClick={handleGenerateHeadline}
            disabled={isGeneratingHeadline}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isGeneratingHeadline ? '生成中...' : '🔥 生成爆款标题'}
          </button>

          {/* 标题输出框 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">生成的标题</h2>
              {headlines.length > 0 && (
                <button
                  onClick={() => copyToClipboard(headlines.join('\n'))}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  复制全部
                </button>
              )}
            </div>
            {headlines.length > 0 ? (
              <div className="space-y-2 min-h-[200px]">
                {headlines.map((headline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => copyToClipboard(headline)}
                  >
                    <span className="text-gray-700">{headline}</span>
                    <span className="text-orange-600 text-sm">点击复制</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                <span className="text-6xl mb-2">💡</span>
                <p className="text-center">生成的标题将显示在这里</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - 爆文改写 */}
        <div className="space-y-4">
          {/* 改写类型 & 目标平台 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">改写类型</label>
                <select
                  value={rewriteType}
                  onChange={(e) => setRewriteType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {rewriteTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标平台</label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform.value} value={platform.value}>{platform.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 原文内容 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">原文内容</h2>
            <textarea
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="粘贴需要改写的内容..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 补充要求 & 引用知识库 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">补充要求</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="可以指定保留关键词、调整语气等"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">引用知识库</label>
                <select
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  {knowledgeDocs.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 开始改写按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isGenerating ? '改写中...' : '✏️ 开始改写'}
          </button>

          {/* 改写结果输出框 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">改写结果</h2>
              {result && (
                <button
                  onClick={() => copyToClipboard(result)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  复制
                </button>
              )}
            </div>
            {result ? (
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm min-h-[200px]">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                <span className="text-6xl mb-2">✏️</span>
                <p className="text-center">改写后的内容将显示在这里</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
