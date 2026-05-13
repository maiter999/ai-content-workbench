import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    // 尝试连接数据库
    await prisma.$connect()
    
    // 检查 DATABASE_URL 是否正确配置
    const dbUrl = process.env.DATABASE_URL || 'NOT_SET'
    const maskedUrl = dbUrl.includes('@') 
      ? dbUrl.replace(/\/\/.*@/, '//***@') 
      : dbUrl
    
    // 尝试查询用户数
    let userCount = 0
    let tableInfo = 'unknown'
    
    try {
      userCount = await prisma.user.count()
      tableInfo = 'exists'
    } catch (dbError: any) {
      if (dbError.code === 'P2021') {
        tableInfo = 'MISSING - 需要执行 db push'
      } else {
        tableInfo = `Error: ${dbError.message}`
      }
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true,
      database: {
        url: maskedUrl,
        tables: tableInfo,
        userCount: userCount,
        hint: tableInfo === 'MISSING - 需要执行 db push' 
          ? '请在本地执行: DATABASE_URL="你的neon连接字符串" npx prisma db push' 
          : '数据库已正确初始化'
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: '数据库连接失败',
      details: error.message,
      code: error.code,
      hint: '检查 DATABASE_URL 环境变量是否正确配置'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { action, secret } = await request.json()
  
  // 简单的密钥验证
  if (secret !== 'init-db-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (action === 'reset') {
    return NextResponse.json({ 
      message: '如需重置数据库，请在本地执行:',
      command: 'npx prisma db push --force-reset',
      warning: '这会删除所有数据！'
    })
  }
  
  return NextResponse.json({ 
    message: 'Use GET to check database status'
  })
}
