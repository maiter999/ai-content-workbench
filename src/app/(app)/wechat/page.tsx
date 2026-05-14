'use client'

import { useState } from 'react'
import { Sparkles, Upload, FileText, Image, Copy, CheckCircle } from 'lucide-react'

const contentStyles = ['专业深度', '故事叙事', '干货清单', '热点评论', '通知公告']

const modelLevels = [
  { id: 'fast', name: '⚡ 快速', desc: 'AI 快速模式', color: 'bg-green-500' },
  { id: 'standard', name: '📝 标准', desc: 'AI 专家模式', color: 'bg-green-600' },
  { id: 'think', name: '🧠 思考', desc: '深度思考 + 智能搜索', color: 'bg-green-700' },
]

const industries = ['房地产', '科技', '教育', '餐饮', '美妆', '旅游', '母婴', '健康', '金融', '医疗', '法律', '宠物', '汽车', '家居', '婚庆', '电商', '职场', '摄影', '农业']

export default function WechatPage() {
  const [topic, setTopic] = useState('')
  const [contentStyle, setContentStyle] = useState('专业深度')
  const [industry, setIndustry] = useState('')
  const [modelLevel, setModelLevel] = useState('standard')
  const [requirements, setRequirements] = useState('')
  const [materials, setMaterials] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [result, setResult] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!topic) return
    setIsGenerating(true)
    setResult('')
    setError('')

    try {
      const response = await fetch('/api/wechat/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, contentStyle, industry, requirements, materials, modelLevel })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || '生成失败')
      } else {
        setResult(data.content)
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCover = async () => {
    if (!result) return
    setIsGeneratingImage(true)

    try {
      const response = await fetch('/api/xiaohongshu/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleContent: result, contentStyle, imageSize: '720*1280' })
      })

      const data = await response.json()
      if (response.ok) {
        setCoverImage(data.imageUrl)
      }
    } catch {
      setError('生成配图失败')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 统一的表单样式
  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"
  const cardClass = "bg-white rounded-xl border border-gray-200 p-4"

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">公众号文章生成</h1>
          <p className="text-sm text-gray-500 mt-1">撰写专业的公众号长文</p>
        </div>

        {/* PC端：左右两列 */}
        <div className="hidden md:grid md:grid-cols-2 gap-5">
          {/* 左侧表单 */}
          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className={cardClass}>
              <label className={labelClass}>主题/关键词 <span className="text-red-500">*</span></label>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="输入文章主题..." className={inputClass} />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>内容风格 <span className="text-red-500">*</span></label>
              <select value={contentStyle} onChange={e => setContentStyle(e.target.value)} className={inputClass}>
                {contentStyles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={cardClass}>
              <label className={labelClass}>行业领域</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} className={inputClass}>
                <option value="">通用</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className={cardClass}>
              <label className={labelClass}>模型档位 <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {modelLevels.map(level => (
                  <button key={level.id} onClick={() => setModelLevel(level.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${modelLevel === level.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <div className="font-medium">{level.name}</div>
                    <div className={`text-xs mt-0.5 ${modelLevel === level.id ? 'text-green-200' : 'text-gray-400'}`}>{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={cardClass}>
              <label className={labelClass}>补充要求</label>
              <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="输入补充要求..." rows={2} className={`${inputClass} resize-none`} />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>参考素材</label>
              <textarea value={materials} onChange={e => setMaterials(e.target.value)} placeholder="输入参考素材链接或内容..." rows={2} className={`${inputClass} resize-none`} />
            </div>

            <button onClick={handleGenerate} disabled={isGenerating || !topic}
              className="w-full py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-green-200">
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : '📰 生成文章'}
            </button>
          </div>

          {/* 右侧输出 */}
          <div className="space-y-4">
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章内容</span>
                </div>
                {result && (
                  <button onClick={copyContent} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                )}
              </div>
              <div className="min-h-[200px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-gray-500">AI正在创作中...</p>
                  </div>
                ) : result ? (
                  <div className="text-sm whitespace-pre-wrap text-gray-700 max-h-60 overflow-y-auto">{result}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">填写左侧表单，点击生成文章</p>
                  </div>
                )}
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章配图</span>
                </div>
                <button onClick={handleGenerateCover} disabled={!result || isGeneratingImage}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  <Image className="w-4 h-4" />
                  {isGeneratingImage ? '生成中...' : '🎨 生成配图'}
                </button>
              </div>
              <div className="min-h-[120px]">
                {isGeneratingImage ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : coverImage ? (
                  <img src={coverImage} alt="封面图" className="w-full h-40 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <Image className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">先生成文章，再点击生成配图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 手机端：垂直布局 */}
        <div className="md:hidden space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className={cardClass}>
            <label className={labelClass}>主题/关键词 <span className="text-red-500">*</span></label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="输入文章主题..." className={inputClass} />
          </div>

          <div className={cardClass}>
            <label className={labelClass}>内容风格 <span className="text-red-500">*</span></label>
            <select value={contentStyle} onChange={e => setContentStyle(e.target.value)} className={inputClass}>
              {contentStyles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={cardClass}>
            <label className={labelClass}>行业领域</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)} className={inputClass}>
              <option value="">通用</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className={cardClass}>
            <label className={labelClass}>模型档位 <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              {modelLevels.map(level => (
                <button key={level.id} onClick={() => setModelLevel(level.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm transition ${modelLevel === level.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <div className="font-medium text-xs">{level.name}</div>
                  <div className={`text-xs mt-0.5 ${modelLevel === level.id ? 'text-green-200' : 'text-gray-400'}`}>{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <label className={labelClass}>补充要求</label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="输入补充要求..." rows={2} className={`${inputClass} resize-none`} />
          </div>

          <div className={cardClass}>
            <label className={labelClass}>参考素材</label>
            <textarea value={materials} onChange={e => setMaterials(e.target.value)} placeholder="输入参考素材链接或内容..." rows={2} className={`${inputClass} resize-none`} />
          </div>

          {/* 生成文章按钮 */}
          <button onClick={handleGenerate} disabled={isGenerating || !topic}
            className="w-full py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-green-200">
            <Sparkles className="w-5 h-5" />
            {isGenerating ? '生成中...' : '📰 生成文章'}
          </button>

          {/* 文章内容 */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">文章内容</span>
              </div>
              {result && (
                <button onClick={copyContent} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </button>
              )}
            </div>
            <div className="min-h-[150px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-500">AI正在创作中...</p>
                </div>
              ) : result ? (
                <div className="text-sm whitespace-pre-wrap text-gray-700 max-h-80 overflow-y-auto">{result}</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">点击上方按钮生成文章</p>
                </div>
              )}
            </div>
          </div>

          {/* 文章配图 */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">文章配图</span>
              </div>
              <button onClick={handleGenerateCover} disabled={!result || isGeneratingImage}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg disabled:opacity-50">
                <Image className="w-3 h-3" />
                {isGeneratingImage ? '生成中...' : '生成配图'}
              </button>
            </div>
            <div className="min-h-[100px]">
              {isGeneratingImage ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : coverImage ? (
                <img src={coverImage} alt="封面图" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                  <Image className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">先生成文章，再生成配图</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
