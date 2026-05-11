'use client'

import { useState, useEffect } from 'react'
import { getKnowledgeDocs } from '@/lib/knowledge-share'
import { generateContent } from '@/lib/ai'

const industryOptions = [
  '房地产', '科技数码', '教育培训', '金融财经', '医疗健康',
  '餐饮美食', '旅游出行', '美妆护肤', '家居生活', '娱乐休闲', '服装配饰'
]

const styleOptions = [
  { value: 'seeding', label: '种草案例' },
  { value: 'guide', label: '攻略' },
  { value: 'review', label: '测评' },
  { value: 'avoid-pit', label: '避坑指南' },
  { value: 'real-shot', label: '实拍探店' },
  { value: 'data-compare', label: '数据对比' },
]

const modelTierOptions = [
  { value: 'fast', label: '快速', desc: '最快速度生成' },
  { value: 'standard', label: '标准', desc: '推荐配置' },
  { value: 'thinking', label: '思考', desc: '深度推理' },
]

export default function XiaohongshuPage() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [industry, setIndustry] = useState('')
  const [modelTier, setModelTier] = useState('standard')
  const [requirements, setRequirements] = useState('')
  const [reference, setReference] = useState('')
  const [knowledge, setKnowledge] = useState('')
  const [knowledgeDocs, setKnowledgeDocs] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [result, setResult] = useState('')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState('')

  // 加载时读取知识库文件列表
  useEffect(() => {
    const docs = getKnowledgeDocs()
    setKnowledgeDocs(['不使用知识库', ...docs.filter(d => d.status === 'ready').map(d => d.name)])
  }, [])

  const handleGenerate = async () => {
    if (!topic) {
      alert('请输入主题/关键词')
      return
    }
    setIsGenerating(true)
    setError('')
    setGeneratedImages([])

    try {
      // 构建提示词
      let prompt = `请为${industry || '通用'}行业创作一篇小红书风格的图文内容。\n\n`
      prompt += `主题：${topic}\n`
      
      if (style) {
        const styleMap: Record<string, string> = {
          'seeding': '种草案例',
          'guide': '攻略',
          'review': '测评',
          'avoid-pit': '避坑指南',
          'real-shot': '实拍探店',
          'data-compare': '数据对比'
        }
        prompt += `风格：${styleMap[style] || style}\n`
      }
      
      prompt += `\n要求：
1. 标题要有吸引力，使用emoji，控制在20字以内
2. 正文要有种草感，口语化表达，像跟姐妹聊天
3. 分段清晰，每段3-5行
4. 添加3-5个相关话题标签
5. 字数控制在500-800字
6. 要有互动引导（如"评论区告诉我"、"你们觉得呢"等）`
      
      if (requirements) {
        prompt += `\n\n补充要求：${requirements}`
      }
      
      if (reference) {
        prompt += `\n\n参考素材：\n${reference}`
      }
      
      if (knowledge && knowledge !== '不使用知识库') {
        prompt += `\n\n请结合"${knowledge}"知识库的内容进行创作`
      }

      const systemPrompt = `你是一个小红书内容创作专家，擅长创作种草、攻略、测评类内容。你的风格是：口语化、有亲和力、像跟朋友聊天。你会使用emoji让内容更生动。`
      
      const content = await generateContent(prompt, systemPrompt, {
        temperature: modelTier === 'fast' ? 0.9 : modelTier === 'thinking' ? 0.5 : 0.7
      })
      
      setResult(content)
      
      // 自动生成配图
      try {
        setIsGeneratingImage(true)
        
        // 1. 根据文章内容生成图片提示词
        const imagePromptGenPrompt = `请根据以下小红书文章内容，生成一个适合AI图片生成的提示词（英文）。
要求：
1. 提取文章的核心视觉元素
2. 提示词要详细、具体，适合小红书风格
3. 图片要美观、吸引眼球
4. 直接输出提示词，不要有任何其他文字

文章内容：
${content.substring(0, 500)}`

        const imagePrompt = await generateContent(imagePromptGenPrompt, '你是一个提示词工程师，擅长将文章转化为AI图片生成提示词。', {
          temperature: 0.7
        })

        // 2. 调用图片生成API
        const imageRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imagePrompt.trim(),
            negativePrompt: '文字、水印、模糊、变形、低质量',
            size: '1024*1024', // 小红书适合方形图
            style: 'photographic', // 写实风格
            numImages: 1
          })
        })

        const imageData = await imageRes.json()

        if (imageData.success && imageData.images && imageData.images.length > 0) {
          setGeneratedImages(imageData.images)
        }
      } catch (imgErr) {
        console.error('生成配图失败:', imgErr)
        // 配图失败不影响正文生成，只记录错误
      } finally {
        setIsGeneratingImage(false)
      }
      
    } catch (err) {
      console.error('生成失败:', err)
      setError(`生成失败: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // 复制内容
  const copyContent = () => {
    navigator.clipboard.writeText(result)
    alert('已复制到剪贴板！')
  }

  // 导出内容
  const exportContent = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `小红书_${topic}_${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 下载图片
  const downloadImage = async (imgUrl: string, index: number) => {
    try {
      const response = await fetch(imgUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `小红书配图_${index + 1}.png`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请右键图片选择"图片另存为"')
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">小红书图文生成</h1>
        <p className="text-gray-600 mt-1">AI 智能生成适合小红书平台的种草文案和配图</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Input Form */}
        <div className="space-y-4">
          {/* 内容创作 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">内容创作</h2>
          
            {/* Topic */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题/关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：新手健身、护肤routine、旅游攻略"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Industry */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业分类</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">请选择行业</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Style - 下拉选择框 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">内容风格</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="">请选择风格</option>
                {styleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Model Tier - 横向排列 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">模型档位</label>
              <div className="grid grid-cols-3 gap-3">
                {modelTierOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setModelTier(opt.value)}
                    className={`p-3 rounded-lg border-2 text-center transition ${
                      modelTier === opt.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 补充要求 & 参考素材 & 上传参考图 & 引用知识库 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Requirements */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充要求</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="可以指定字数、语气、特定关键词等"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Reference Material */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">参考素材</label>
              <textarea
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="粘贴参考素材内容..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Upload Reference Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传参考图</label>
              <button
                onClick={() => alert('上传参考图功能开发中...')}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition"
              >
                📷 点击上传参考图片
              </button>
            </div>

            {/* Knowledge Base */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">引用知识库</label>
              <select
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                {knowledgeDocs.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  生成中...
                </span>
              ) : (
                <span>📕 开始生成图文+配图</span>
              )}
            </button>
          </div>
        </div>

        {/* Right - Result */}
        <div className="space-y-4">
          {/* 生成结果 */}
          <div className="bg-white rounded-xl shadow-sm p-6" style={{minHeight: '500px'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
              {result && (
                <div className="flex gap-2">
                  <button 
                    onClick={copyContent}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    复制
                  </button>
                  <button 
                    onClick={exportContent}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    导出
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            {result ? (
              <div className="space-y-4">
                {/* 正文内容 */}
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed overflow-y-auto" style={{maxHeight: '300px'}}>
                  {result}
                </div>

                {/* 配图展示 */}
                {generatedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">配图：</p>
                    <div className="grid grid-cols-1 gap-2">
                      {generatedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={imgUrl} 
                            alt={`配图 ${idx + 1}`}
                            className="w-full h-auto"
                            style={{maxHeight: '400px', objectFit: 'cover'}}
                          />
                          <div className="absolute bottom-2 right-2">
                            <button
                              onClick={() => downloadImage(imgUrl, idx)}
                              className="px-3 py-1 bg-white bg-opacity-90 text-xs rounded hover:bg-opacity-100"
                            >
                              下载
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 配图生成中 */}
                {isGeneratingImage && generatedImages.length === 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    配图生成中...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400" style={{height: '400px'}}>
                <span className="text-6xl mb-4">📕</span>
                <p>填写左侧信息，点击生成按钮</p>
                <p className="text-sm mt-1">AI 将为你创作优质图文和配图</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
