import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const platformNames: Record<string, string> = {
  xiaohongshu: '小红书',
  wechat: '公众号',
  douyin: '抖音'
}

export const platformColors: Record<string, string> = {
  xiaohongshu: 'text-pink-500 bg-pink-50',
  wechat: 'text-green-600 bg-green-50',
  douyin: 'text-black bg-gray-100'
}

export const platformIcons: Record<string, string> = {
  xiaohongshu: '📕',
  wechat: '📰',
  douyin: '🎵'
}
