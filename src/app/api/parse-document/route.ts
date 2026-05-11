import { NextRequest, NextResponse } from 'next/server'
const PDFParser = require('pdf2json')
const mammoth = require('mammoth')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileType = file.name.split('.').pop()?.toLowerCase()
    let content = ''

    switch (fileType) {
      case 'txt':
      case 'md':
        content = buffer.toString('utf-8')
        break

      case 'pdf':
        content = await parsePDF(buffer)
        break

      case 'docx':
      case 'doc':
        const result = await mammoth.extractRawText({ buffer })
        content = result.value
        break

      default:
        return NextResponse.json(
          { error: `不支持的文件类型: ${fileType}` },
          { status: 400 }
        )
    }

    // 内容分块（每块500字符）
    const chunkSize = 500
    const chunks = []
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize))
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType,
      fileSize: file.size,
      content,
      chunks,
      chunkCount: chunks.length,
      parsedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('文档解析错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '文档解析失败'
      },
      { status: 500 }
    )
  }
}

// 使用 pdf2json 解析 PDF
function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error(errData.parserError))
    })

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      // 提取文本内容
      let text = ''
      for (let page of pdfData.Pages) {
        for (let textItem of page.Texts) {
          const decoded = decodeURIComponent(textItem.R[0].T)
          text += decoded + ' '
        }
        text += '\n'
      }
      resolve(text)
    })

    pdfParser.parseBuffer(buffer)
  })
}
