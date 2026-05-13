'use client'

import { useState } from 'react'
import { Sparkles, Upload, FileText, Image, Copy, CheckCircle, Trash2 } from 'lucide-react'

const modelLevels = [
  { id: 'fast', name: '⚡ 快速', desc: 'AI 快速模式', color: 'bg-purple-500' },
  { id: 'standard', name: '📝 标准', desc: 'AI 专家模式', color: 'bg-purple-600' },
  { id: 'think', name: '🧠 思考', desc: '深度思考 + 智能搜索', color: 'bg-purple-700' },
]

const industries = ['房地产', '科技', '教育', '餐饮', '美妆', '旅游', '母婴', '健康', '金融', '医疗', '法律', '宠物', '汽车', '家居', '婚庆', '电商', '职场', '摄影', '农业']

const platforms = [
  { id: 'wechat', name: '公众号', color: 'green' },
  { id: 'xiaohongshu', name: '小红书', color: 'pink' },
  { id: 'moments', name: '朋友圈', color: 'blue' },
  { id: 'douyin', name: '抖音脚本', color: 'purple' },
  { id: 'miniprogram', name: '微信小绿书', color: 'orange' },
]

export default function OneClickPage() {
  const [topic, setTopic] = useState('')
  const [industry, setIndustry] = useState('')
  const [modelLevel, setModelLevel] = useState('standard')
  const [requirements, setRequirements] = useState('')
  const [materials, setMaterials] = useState('')
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['wechat', 'xiaohongshu'])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [results, setResults] = useState<Record<string, { content: string }>>({})
  const [platformImages, setPlatformImages] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!topic || selectedPlatforms.length === 0) return
    setIsGenerating(true)
    setResults({})
    setError('')

    const newResults: Record<string, { content: string }> = {}

    // 为每个选中的平台生成内容
    for (const pId of selectedPlatforms) {
      try {
        let apiUrl = ''
        let requestBody: any = {
          topic,
          industry,
          requirements,
          materials,
          modelLevel
        }

        // 根据平台选择API
        switch (pId) {
          case 'xiaohongshu':
            apiUrl = '/api/xiaohongshu/generate'
            requestBody.contentStyle = '种草安利'  // 默认风格
            break
          case 'wechat':
            apiUrl = '/api/wechat/generate'
            requestBody.contentStyle = '专业深度'  // 默认风格
            break
          case 'moments':
            apiUrl = '/api/moments/generate'
            requestBody.contentStyle = '吐槽共鸣'  // 默认风格
            break
          case 'douyin':
            // 抖音脚本使用小红书API（类似短视频脚本）
            apiUrl = '/api/xiaohongshu/generate'
            requestBody.contentStyle = '攻略评测'
            break
          case 'miniprogram':
            apiUrl = '/api/miniprogram/generate'
            requestBody.contentStyle = '探店旅行'  // 默认风格
            break
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        if (response.ok && data.content) {
          newResults[pId] = { content: data.content }
        }
      } catch (err) {
        console.error(`生成平台 ${pId} 内容失败:`, err)
      }
    }

    setResults(newResults)
    setIsGenerating(false)
  }

  const handleGenerateImages = async () => {
    if (Object.keys(results).length === 0) return
    setIsGeneratingImage(true)
    setImageErrors({})

    // 为每个平台生成配图
    const newImages: Record<string, string> = {}

    for (const pId of selectedPlatforms) {
      if (results[pId]) {
        try {
          // 根据平台确定风格和尺寸
          const platformStyle = getPlatformImageStyle(pId)

          const response = await fetch('/api/xiaohongshu/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              articleContent: results[pId].content,
              contentStyle: platformStyle.style,
              imageSize: platformStyle.size
            })
          })

          const data = await response.json()

          if (response.ok && data.imageUrl) {
            newImages[pId] = data.imageUrl
          }
        } catch (err) {
          console.error(`生成平台 ${pId} 配图失败:`, err)
          setImageErrors(prev => ({ ...prev, [pId]: '生成失败' }))
        }
      }
    }

    setPlatformImages(prev => ({ ...prev, ...newImages }))
    setIsGeneratingImage(false)
  }

  // 根据平台获取对应的图片风格和尺寸
  const getPlatformImageStyle = (platformId: string) => {
    const styles: Record<string, { style: string; size: string }> = {
      'xiaohongshu': { style: '种草安利', size: '768*1152' },      // 2:3 接近3:4
      'wechat': { style: '专业深度', size: '720*1280' },             // 9:16 竖版
      'moments': { style: '种草安利', size: '1024*1024' },          // 1:1
      'douyin': { style: '攻略评测', size: '768*1152' },            // 2:3 接近3:4
      'miniprogram': { style: '种草安利', size: '768*1152' },      // 2:3 接近3:4
    }
    return styles[platformId] || { style: '种草安利', size: '768*1152' }
  }

  const copyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = () => {
    const text = Object.entries(results).map(([id, data]) => {
      const platform = platforms.find(p => p.id === id)
      return `=== ${platform?.name || id} ===\n\n${data.content}`
    }).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* 标题 */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">AI一键生成</h1>
          <p className="text-sm text-gray-500 mt-1">一个主题，多平台同时出稿</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* 左侧表单 */}
          <div className="space-y-3">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-600 text-sm">
                <span className="shrink-0">⚠️</span>
                {error}
              </div>
            )}

            {/* 主题 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主题/关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="输入创作主题..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 行业领域 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业领域</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">通用</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* 模型档位 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模型档位 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {modelLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setModelLevel(level.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition ${
                      modelLevel === level.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">{level.name}</div>
                    <div className={`text-xs mt-0.5 ${modelLevel === level.id ? 'text-purple-200' : 'text-gray-400'}`}>
                      {level.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 补充要求 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充要求</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="输入补充要求..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 参考素材 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">参考素材</label>
              <textarea
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="输入参考素材链接或内容..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 上传参考图 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">上传参考图</label>
              <div className="relative">
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="预览" className="max-h-24 mx-auto rounded-lg" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center hover:border-purple-400 transition cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">拖拽或点击上传</p>
                    <p className="text-xs text-gray-400">支持 JPG、PNG</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer top-0"
                />
              </div>
            </div>

            {/* 引用知识库 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">引用知识库</label>
              <select
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">选择参考文档</option>
                <option value="product">产品知识库</option>
                <option value="brand">品牌故事库</option>
                <option value="case">案例库</option>
              </select>
            </div>

            {/* 生成平台 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                生成平台 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <label
                    key={p.id}
                    className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition ${
                      selectedPlatforms.includes(p.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                      className="sr-only"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 生成文章按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic || selectedPlatforms.length === 0}
              className="w-full py-3 bg-purple-600 text-white rounded-xl text-base font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? '生成中...' : `⚡ 生成文章（${selectedPlatforms.length}个平台）`}
            </button>
          </div>

          {/* 右侧输出 - 文章内容在上，配图在下 */}
          <div className="space-y-4">
            {/* 文章内容 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章内容</span>
                </div>
                {Object.keys(results).length > 0 && (
                  <button
                    onClick={copyAll}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded transition"
                  >
                    {copied === 'all' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'all' ? '已复制全部' : '复制全部'}
                  </button>
                )}
              </div>
              <div className="p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-gray-500">AI正在为{selectedPlatforms.length}个平台创作内容...</p>
                  </div>
                ) : Object.keys(results).length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-4">
                    {selectedPlatforms.map(pId => {
                      const platform = platforms.find(pl => pl.id === pId)
                      const data = results[pId]
                      if (!data) return null

                      return (
                        <div key={pId}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{platform?.name || pId}</span>
                            <button
                              onClick={() => copyContent(pId, data.content)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition"
                            >
                              {copied === pId ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                              {copied === pId ? '已复制' : '复制'}
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap text-gray-700">
                            {data.content}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">填写左侧表单，点击生成文案</p>
                  </div>
                )}
              </div>
            </div>

            {/* 配图区域 - 在文章内容下方 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">文章配图</span>
                </div>
                <button
                  onClick={handleGenerateImages}
                  disabled={Object.keys(results).length === 0 || isGeneratingImage}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  <Image className="w-4 h-4" />
                  {isGeneratingImage ? '生成中...' : '🎨 生成配图'}
                </button>
              </div>
              <div className="p-4">
                {isGeneratingImage ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : Object.keys(platformImages).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlatforms.map(pId => {
                      const platform = platforms.find(pl => pl.id === pId)
                      const img = platformImages[pId]
                      if (!img) return null
                      return (
                        <div key={pId}>
                          <span className="text-xs text-gray-500 mb-1 block">{platform?.name}</span>
                          <img src={img} alt="配图" className="w-full h-24 object-cover rounded-lg" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <Image className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">先生成文章，再点击生成配图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
