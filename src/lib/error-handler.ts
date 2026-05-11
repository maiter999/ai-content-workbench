// 统一错误处理工具

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// API错误处理
export function handleAPIError(error: any): { error: string; status: number } {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return {
      error: error.message,
      status: error.statusCode
    }
  }

  if (error.code === 'P2002') {
    return { error: '数据已存在', status: 409 }
  }

  if (error.code === 'P2025') {
    return { error: '数据不存在', status: 404 }
  }

  return {
    error: error.message || '服务器错误',
    status: 500
  }
}

// 客户端错误处理
export function showError(message: string) {
  // 可以集成 toast 通知
  alert(message)
}

export function showSuccess(message: string) {
  alert(message)
}

// 表单验证
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: '密码至少6位' }
  }
  if (password.length > 50) {
    return { valid: false, message: '密码最多50位' }
  }
  return { valid: true }
}
