'use client'

import { useState, useEffect, ReactNode } from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export function Loading({ size = 'md', text = '加载中...', fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  }

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-purple-600 border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-3 text-gray-600 text-sm">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ message = '加载失败，请重试', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          重试
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6 max-w-md">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

interface SkeletonProps {
  lines?: number
  height?: string
}

export function Skeleton({ lines = 3, height = 'h-4' }: SkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded ${height}`} style={{ width: `${100 - i * 15}%` }}></div>
      ))}
    </div>
  )
}

// 高阶组件：添加加载和错误状态
interface WithLoadingAndErrorProps {
  loading: boolean
  error?: string | null
  onRetry?: () => void
  children: ReactNode
  loadingText?: string
}

export function WithLoadingAndError({
  loading,
  error,
  onRetry,
  children,
  loadingText
}: WithLoadingAndErrorProps) {
  if (loading) {
    return <Loading text={loadingText} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />
  }

  return <>{children}</>
}
