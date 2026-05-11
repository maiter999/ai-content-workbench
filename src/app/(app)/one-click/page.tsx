'use client'

import { useState, useEffect } from 'react'
import { getKnowledgeDocs } from '@/lib/knowledge-share'
import { generateContent } from '@/lib/ai'

const platforms = [
  { id: 'xiaohongshu', name: '小红书', icon: '📕', color: 'pink', desc: '种草文案+配图建议' },
  { id: 'wechat', name: '公众号', icon: '📰', color: 'green', desc: '专业深度文章' },
  { id: 'moments', name: '朋友圈', icon: '💬', color: 'blue', desc: '简短精炼分享' },
  { id: 'douyin', name: '抖音脚本', icon: '🎵', color: 'purple', desc: '短视频口播文案' },
  { id: 'weibo', name: '微信小绿书', icon: '🌐', color: 'orange', desc: '社交媒体内容' },
]

const industryOptions = [
  '房地产', '科技数码', '教育培训', '金融财经', '医疗健康',
  '餐饮美食', '旅游出行', '美妆护肤', '家居生活'
]

const modelTierOptions = [
  { value: 'fast', label: '快速', desc: '最快速度生成' },
  { value: 'standard', label: '标准', desc: '推荐配置' },
  { value: 'thinking', label: '思考', desc: '深度推理' },
]

export default function OneClickPage() {
  const [topic, setTopic] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['xiaohongshu', 'wechat'])
  const [industry, setIndustry] = useState('')
  const [modelTier, setModelTier] = useState('standard')
  const [requirements, setRequirements] = useState('')
  const [reference, setReference] = useState('')
  const [knowledge, setKnowledge] = useState('')
  const [knowledgeDocs, setKnowledgeDocs] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<Record<string, string>>({})
  const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({})
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const docs = getKnowledgeDocs()
    setKnowledgeDocs(['不使用知识库', ...docs.filter(d => d.status === 'ready').map(d => d.name)])
  }, [])

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id))
    } else {
      setSelectedPlatforms([...selectedPlatforms, id])
    }
  }

  const handleGenerate = async () => {
    if (!topic) {
      alert('请输入主题/关键词')
      return
    }
    if (selectedPlatforms.length === 0) {
      alert('请至少选择一个平台')
      return
    }
    
    setIsGenerating(true)
    setResults({})
    setGeneratedImages({})
    setError('')

    for (const platform of selectedPlatforms) {
      try {
        const platformInfo = platforms.find(p => p.id === platform)
        const platformName = platformInfo?.name || platform
        
        // 构建提示词
        let prompt = `请为${industry || '通用'}行业创作一篇适合${platformName}平台的内容。\n\n`
        prompt += `主题：${topic}\n\n`
        
        if (platform === 'xiaohongshu') {
          prompt += `要求：
1. 标题要吸引人，使用emoji
2. 正文要有种草感，口语化表达
3. 添加相关话题标签
4. 字数控制在500-800字`
        } else if (platform === 'wechat') {
          prompt += `要求：
1. 标题要有深度，吸引点击
2. 正文要有逻辑性，分段清晰
3. 适合公众号长文风格
4. 字数控制在1500-2000字`
        } else if (platform === 'moments') {
          prompt += `要求：
1. 简短精炼，控制在200字以内
2. 口语化，有亲和力
3. 适合朋友圈分享`
        } else if (platform === 'douyin') {
          prompt += `要求：
1. 写成口播脚本形式
2. 开头要有钩子，吸引注意力
3. 适合短视频节奏
4. 控制在300-500字`
        } else {
          prompt += `要求：
1. 内容生动有趣
2. 适合社交媒体传播
3. 字数控制在800-1200字`
        }
        
        if (requirements) {
          prompt += `\n\n补充要求：${requirements}`
        }
        
        if (reference) {
          prompt += `\n\n参考素材：\n${reference}`
        }
        
        if (knowledge && knowledge !== '不使用知识库') {
          prompt += `\n\n请结合"${knowledge}"知识库的内容进行创作`
        }

        const systemPrompt = `你是一个专业的内容创作者，擅长多平台内容创作。请根据平台特点创作优质内容。`
        
        const content = await generateContent(prompt, systemPrompt, {
          temperature: modelTier === 'fast' ? 0.9 : modelTier === 'thinking' ? 0.5 : 0.7
        })
        
        setResults(prev => ({
          ...prev,
          [platform]: content
        }))

        // 自动生成配图
        try {
          setIsGeneratingImage(true)
          
          // 1. 根据文章内容生成图片提示词
          const imagePromptGenPrompt = `请根据以下文章内容，生成一个适合AI图片生成的提示词（英文）。
要求：
1. 提取文章的核心视觉元素
2. 提示词要详细、具体
3. 适合${platformName}平台的风格
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
              size: platform === 'douyin' ? '720*1280' : '1024*1024',
              style: platform === 'xiaohongshu' || platform === 'wechat' ? 'photographic' : 'cartoon',
              numImages: 1
            })
          })

          const imageData = await imageRes.json()

          if (imageData.success && imageData.images && imageData.images.length > 0) {
            setGeneratedImages(prev => ({
              ...prev,
              [platform]: imageData.images
            }))
          }
        } catch (imgErr) {
          console.error(`为${platform}生成配图失败:`, imgErr)
          // 配图失败不影响正文生成，只记录错误
        } finally {
          setIsGeneratingImage(false)
        }
        
      } catch (err) {
        console.error(`生成${platform}内容失败:`, err)
        setError(`生成${platform}内容失败: ${err instanceof Error ? err.message : '未知错误'}`)
        setResults(prev => ({
          ...prev,
          [platform]: `❌ 生成失败: ${err instanceof Error ? err.message : '未知错误'}`
        }))
      }
    }
    
    setIsGenerating(false)
  }

  // 复制全部结果
  const copyAllResults = () => {
    const text = Object.entries(results).map(([platformId, content]) => {
      const platform = platforms.find(p => p.id === platformId)
      return `=== ${platform?.name || platformId} ===\n\n${content}`
    }).join('\n\n')
    
    navigator.clipboard.writeText(text)
    alert('已复制全部内容到剪贴板')
  }

  // 导出全部结果
  const exportAllResults = () => {
    const text = Object.entries(results).map(([platformId, content]) => {
      const platform = platforms.find(p => p.id === platformId)
      return `=== ${platform?.name || platformId} ===\n\n${content}`
    }).join('\n\n')
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AI生成内容_${topic}_${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI一键生成</h1>
        <p className="text-gray-600 mt-1">输入一个主题，AI 同时生成多个平台的内容</p>
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
                placeholder="输入创作主题"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Industry */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业分类</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">请选择行业</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
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
                        ? 'border-purple-500 bg-purple-50'
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Upload Reference Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传参考图</label>
              <button
                onClick={() => alert('上传参考图功能开发中...')}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500 transition"
              >
                📎 点击上传参考图片
              </button>
            </div>

            {/* Knowledge Base */}
            <div className="mb-6">
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

          {/* 选择平台 - 移到引用知识库后面 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">选择平台</h2>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.desc}</div>
                  </div>
                  {selectedPlatforms.includes(platform.id) && (
                    <span className="text-purple-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成中... ({Object.keys(results).length}/{selectedPlatforms.length}个平台)
              </span>
            ) : (
              <span>⚡ AI一键成文+配图 ({selectedPlatforms.length}个平台)</span>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

          {/* Right - Result */}
        <div className="space-y-4">
          {/* 生成结果 */}
          <div className="bg-white rounded-xl shadow-sm p-6" style={{minHeight: '500px'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
              {Object.keys(results).length > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={copyAllResults}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    全部复制
                  </button>
                  <button 
                    onClick={exportAllResults}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                  >
                    全部导出
                  </button>
                </div>
              )}
            </div>
            
            {Object.keys(results).length > 0 ? (
              <div className="space-y-6 overflow-y-auto" style={{maxHeight: '600px'}}>
                {platforms.filter(p => selectedPlatforms.includes(p.id)).map((platform) => (
                  <div key={platform.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{platform.icon}</span>
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      </div>
                      {results[platform.id] && !results[platform.id].startsWith('❌') && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(results[platform.id])
                            alert(`${platform.name}内容已复制！`)
                          }}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                        >
                          复制
                        </button>
                      )}
                    </div>
                    
                    {/* 正文内容 */}
                    {results[platform.id] ? (
                      <div className={`text-sm text-gray-700 whitespace-pre-wrap leading-relaxed ${
                        results[platform.id].startsWith('❌') ? 'text-red-600' : ''
                      }`} style={{maxHeight: '200px', overflowY: 'auto'}}>
                        {results[platform.id]}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        生成中...
                      </div>
                    )}

                    {/* 配图展示 */}
                    {generatedImages[platform.id] && generatedImages[platform.id].length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">配图：</p>
                        <div className="grid grid-cols-1 gap-2">
                          {generatedImages[platform.id].map((imgUrl, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100" style={{maxWidth: '400px'}}>
                              <img 
                                src={imgUrl} 
                                alt={`${platform.name}配图 ${idx + 1}`}
                                className="w-full h-auto"
                                style={{maxHeight: '300px', objectFit: 'cover'}}
                              />
                              <div className="absolute bottom-2 right-2 flex gap-1">
                                <button
                                  onClick={async () => {
                                    const response = await fetch(imgUrl)
                                    const blob = await response.blob()
                                    const url = window.URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = `${platform.name}配图_${idx + 1}.png`
                                    a.click()
                                    window.URL.revokeObjectURL(url)
                                  }}
                                  className="px-2 py-1 bg-white bg-opacity-90 text-xs rounded hover:bg-opacity-100"
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
                    {isGeneratingImage && results[platform.id] && !generatedImages[platform.id] && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        配图生成中...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400" style={{height: '400px'}}>
                <span className="text-6xl mb-4">⚡</span>
                <p>填写左侧信息，点击生成按钮</p>
                <p className="text-sm mt-1">AI 将为你生成多平台内容和配图</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
