'use client'

import { useState } from 'react'

const platforms = [
  { id: 'xiaohongshu', name: '小红书', icon: '📕' },
  { id: 'wechat', name: '公众号', icon: '📰' },
  { id: 'douyin', name: '抖音', icon: '🎵' },
  { id: 'weibo', name: '微博', icon: '🌐' },
]

const industries = [
  '房地产', '科技数码', '教育培训', '金融财经', '医疗健康',
  '餐饮美食', '旅游出行', '美妆护肤', '家居生活'
]

const styleOptions = [
  { value: 'curiosity', label: '引发好奇', desc: '制造悬念，吸引点击' },
  { value: 'emotional', label: '情感共鸣', desc: '触动情感，引发讨论' },
  { value: 'data', label: '数据冲击', desc: '数字量化，增强说服' },
  { value: 'question', label: '疑问句式', desc: '抛出问题，引发思考' },
]

export default function HeadlinesPage() {
  const [topic, setTopic] = useState('')
  const [industry, setIndustry] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['xiaohongshu'])
  const [selectedStyles, setSelectedStyles] = useState(['curiosity'])
  const [count, setCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id))
    } else {
      setSelectedPlatforms([...selectedPlatforms, id])
    }
  }

  const toggleStyle = (value: string) => {
    if (selectedStyles.includes(value)) {
      setSelectedStyles(selectedStyles.filter(s => s !== value))
    } else {
      setSelectedStyles([...selectedStyles, value])
    }
  }

  const handleGenerate = async () => {
    if (!topic) {
      alert('请输入主题/关键词')
      return
    }
    setIsGenerating(true)
    setResults([])

    await new Promise(resolve => setTimeout(resolve, 2000))

    const sampleHeadlines = [
      `【必看】${topic}，99%的人都踩过这个坑！`,
      `${topic}的真实体验｜附详细攻略`,
      `后悔没早点知道${topic}的这些技巧！`,
      `${topic}指南｜看完这篇就够了`,
      `月薪3000到30000，我只做了${topic}这件事`,
      `关于${topic}，这是最实在的一篇！`,
      `${topic}大揭秘｜内部人士透露`,
      `为什么${topic}突然火了？`,
    ]

    setResults(sampleHeadlines.slice(0, count))
    setIsGenerating(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">爆款标题生成</h1>
        <p className="text-gray-600 mt-1">AI 智能生成吸引眼球的爆款标题</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Input */}
        <div className="col-span-1 space-y-6">
          {/* Topic */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创作主题</h2>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="输入内容主题"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">行业领域</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">请选择行业</option>
                {industries.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Platforms */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">目标平台</h2>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <span className="ml-auto text-purple-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">标题风格</h2>
            <div className="space-y-2">
              {styleOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => toggleStyle(style.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    selectedStyles.includes(style.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{style.label}</div>
                  <div className="text-xs text-gray-500">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">生成数量</h2>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    count === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num}条
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {isGenerating ? '生成中...' : '💡 生成标题'}
          </button>
        </div>

        {/* Right - Results */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
              {results.length > 0 && (
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  全部复制
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((headline, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{headline}</p>
                      </div>
                      <button className="flex-shrink-0 px-3 py-1 text-sm bg-white text-gray-700 rounded border hover:bg-gray-50">
                        复制
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <span className="text-8xl mb-4">💡</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">爆款标题生成器</h3>
                <p className="text-gray-500 text-center">
                  输入主题，选择风格<br/>AI 帮你生成吸引眼球的标题
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
