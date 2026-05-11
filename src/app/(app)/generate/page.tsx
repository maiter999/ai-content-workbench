'use client'

import { useState, useEffect } from 'react'
import { platformNames, platformIcons, platformColors } from '@/lib/utils'

type Platform = 'xiaohongshu' | 'wechat' | 'douyin'

interface GenerateResult {
  title: string
  content: string
  hashtags?: string[]
}

export default function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [tone, setTone] = useState<'casual' | 'professional' | 'humorous'>('casual')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<Platform, GenerateResult> | null>(null)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(0)
  const [generating, setGenerating] = useState<Platform | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCredits(data.user.credits)
        }
      })
  }, [])

  const togglePlatform = (platform: Platform) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入内容主题')
      return
    }
    if (platforms.length === 0) {
      setError('请选择至少一个平台')
      return
    }
    if (credits < platforms.length) {
      setError('积分不足')
      return
    }

    setError('')
    setLoading(true)
    setResults(null)
    setGenerating(null)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platforms, tone, length })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '生成失败')
        return
      }

      setResults(data.results)
      setCredits(data.remainingCredits)
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
      setGenerating(null)
    }
  }

  const platformsList: Platform[] = ['xiaohongshu', 'wechat', 'douyin']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 内容生成</h1>
        <p className="text-gray-600 mt-1">输入主题，一键生成多平台内容</p>
      </div>

      {/* Generate Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容主题 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：春季穿搭分享、周末探店美食、职场技能提升..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            rows={3}
          />
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标平台 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {platformsList.map((platform) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  platforms.includes(platform)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{platformIcons[platform]}</span>
                <span className="font-medium">{platformNames[platform]}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            已选择 {platforms.length} 个平台，消耗 {platforms.length} 积分
          </p>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            语气风格
          </label>
          <div className="flex gap-3">
            {[
              { value: 'casual', label: '轻松活泼', icon: '😊' },
              { value: 'professional', label: '专业严谨', icon: '💼' },
              { value: 'humorous', label: '幽默风趣', icon: '😄' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTone(option.value as typeof tone)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                  tone === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容长度
          </label>
          <div className="flex gap-3">
            {[
              { value: 'short', label: '短内容', desc: '快速浏览' },
              { value: 'medium', label: '中等长度', desc: '内容详实' },
              { value: 'long', label: '深度长文', desc: '详细分享' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setLength(option.value as typeof length)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                  length === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Credits Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">剩余积分：</span>
            <span className="text-2xl font-bold text-purple-600">{credits}</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || platforms.length === 0 || !topic.trim()}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>开始生成</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">生成结果</h2>
          {platforms.map((platform) => (
            <div
              key={platform}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{platformIcons[platform]}</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {platformNames[platform]}版本
                </h3>
              </div>

              {results[platform] && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">标题</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {results[platform].title}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">正文内容</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
                      {results[platform].content}
                    </div>
                  </div>

                  {results[platform].hashtags && results[platform].hashtags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">话题标签</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {results[platform].hashtags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">
                      📋 复制内容
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
                      ✏️ 编辑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
