import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function POST(request: Request) {
  const { secret } = await request.json()
  
  // 简单的密钥验证（生产环境应使用更安全的方式）
  if (secret !== 'init-db-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const prisma = new PrismaClient()
    
    // 尝试查询数据库
    await prisma.$connect()
    
    // 尝试查询用户表（会自动创建）
    await prisma.user.findFirst()
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: '数据库连接正常，表结构已存在'
    })
  } catch (error: any) {
    // 如果是表不存在错误
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return NextResponse.json({ 
        error: '数据库表未初始化',
        hint: '请在本地执行 npx prisma db push 后重新部署',
        code: 'TABLE_NOT_EXISTS'
      }, { status: 500 })
    }
    
    // 其他错误
    return NextResponse.json({ 
      error: '数据库连接失败',
      debug: error.message,
      code: error.code
    }, { status: 500 })
  }
}
