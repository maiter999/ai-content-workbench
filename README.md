# AI 内容工坊 (AI Content Workbench)

一个强大的多平台 AI 内容创作平台，支持小红书、微信公众号、抖音等多平台内容生成。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![License](https://img.shields.io/badge/license-MIT-green)

## 功能特性

### 核心功能

- **AI 一键生成** - 输入主题，自动生成多平台内容
- **小红书图文** - 专为小红书优化的种草文案生成
- **公众号文章** - 专业深度文章创作
- **爆文改写** - 快速改写现有内容
- **AI 图片生成** - 通义万象图片生成
- **知识库** - 上传文档，构建专属知识库
- **爆款标题** - 生成吸引眼球的标题
- **爆文排行** - 查看热门内容趋势

### 技术特点

- 🚀 基于 Next.js 14 + React 18
- 💾 Prisma ORM + SQLite（可选 PostgreSQL）
- 🤖 DeepSeek / 通义千问 / 智谱 GLM 多 AI 支持
- 🔐 JWT 安全认证
- 💳 支付宝/微信支付集成
- 📱 响应式设计

## 快速开始

### 环境要求

- Node.js 18+
- npm / yarn / pnpm

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd ai-content-workbench

# 2. 安装依赖
npm install

# 3. 复制环境变量配置
cp .env.example .env

# 4. 编辑 .env 文件，配置必要的环境变量
# - DATABASE_URL
# - JWT_SECRET
# - DEEPSEEK_API_KEY

# 5. 初始化数据库
npm run prisma:push

# 6. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境变量配置

创建 `.env` 文件，配置以下变量：

### 必需配置

```env
# 数据库
DATABASE_URL="file:./dev.db"

# JWT 密钥（生产环境请使用强密码）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# DeepSeek API（推荐）
# 获取地址: https://platform.deepseek.com/
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

### 可选 AI 配置

```env
# 通义千问
QWEN_API_KEY="your-qwen-api-key"

# 文心一言
WENXIN_API_KEY="your-wenxin-api-key"
WENXIN_SECRET_KEY="your-wenxin-secret-key"

# 讯飞星火
SPARK_API_KEY="your-spark-api-key"
SPARK_APP_ID="your-spark-app-id"

# 智谱 GLM
GLM_API_KEY="your-glm-api-key"

# 图片生成（通义万象）
DASHSCOPE_API_KEY="your-dashscope-api-key"
```

### 支付宝配置（可选）

```env
# 应用 ID
ALIPAY_APP_ID="your-alipay-app-id"

# 应用私钥（RSA2）
ALIPAY_PRIVATE_KEY="your-private-key"

# 支付宝公钥
ALIPAY_ALIPAY_PUBLIC_KEY="your-alipay-public-key"

# 回调地址
ALIPAY_NOTIFY_URL="https://your-domain.com/api/payments/alipay-callback"
```

## 项目结构

```
ai-content-workbench/
├── prisma/
│   └── schema.prisma      # 数据库模型
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (app)/        # 已登录用户页面组
│   │   │   ├── dashboard/
│   │   │   ├── one-click/
│   │   │   ├── xiaohongshu/
│   │   │   ├── wechat/
│   │   │   └── ...
│   │   ├── api/          # API 路由
│   │   │   ├── auth/
│   │   │   ├── generate/
│   │   │   ├── payments/
│   │   │   └── ...
│   │   ├── login/
│   │   └── register/
│   ├── components/       # React 组件
│   │   └── layout/
│   ├── lib/              # 工具函数和 SDK
│   │   ├── auth.ts       # 认证
│   │   ├── deepseek.ts   # DeepSeek API
│   │   ├── alipay.ts     # 支付宝
│   │   └── ...
│   └── types/            # TypeScript 类型
├── .env                  # 环境变量
├── .env.example          # 环境变量示例
└── package.json
```

## API 文档

### 认证接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户 |

### 内容生成

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/generate` | POST | AI 内容生成 |
| `/api/generate-image` | POST | 图片生成 |
| `/api/ai/generate` | POST | 多平台 AI 生成 |
| `/api/contents` | GET | 内容列表 |

### 支付相关

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/payments` | POST | 创建订单 |
| `/api/payments` | PUT | 支付回调 |

### 其他

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/stats` | GET | 统计数据 |
| `/api/transactions` | GET | 交易记录 |
| `/api/parse-document` | POST | 文档解析 |

## 套餐定价

| 套餐 | 积分 | 价格 | 描述 |
|------|------|------|------|
| 基础套餐 | 500 | ¥99 | 适合个人用户 |
| 标准套餐 | 1500 | ¥299 | 适合内容创作者 |
| 专业套餐 | 5000 | ¥499 | 适合专业团队 |

**积分说明：**
- 文本生成：约 10 积分/次
- 图片生成：约 20 积分/张

## 部署指南

### Vercel 部署（推荐）

1. Fork 或克隆项目到 GitHub
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project" 导入项目
4. 配置环境变量
5. 点击 Deploy

### Docker 部署

```bash
# 构建镜像
docker build -t ai-content-workbench .

# 运行容器
docker run -p 3000:3000 --env-file .env ai-content-workbench
```

### 独立服务器部署

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
npm install -g pm2

# 3. 部署
git clone <repository-url>
cd ai-content-workbench
npm install
npm run build
pm2 start npm --name "ai-content-workbench" -- start
```

## 数据库

### 开发环境（SQLite）

默认使用 SQLite，数据库文件位于 `prisma/dev.db`。

```bash
# 重置数据库
npm run prisma:reset
```

### 生产环境（PostgreSQL）

推荐使用 PostgreSQL，如 [Neon](https://neon.tech) 或 [Supabase](https://supabase.com)。

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

```bash
# 推送 schema
npm run prisma:push

# 或执行迁移
npm run prisma:migrate
```

## 常见问题

### Q: 提示 "DeepSeek API Key 无效"？

确保在 `.env` 中正确配置了 `DEEPSEEK_API_KEY`，并且 Key 有余额。

### Q: 支付后积分没到账？

检查：
1. 订单状态是否已更新为 "paid"
2. 数据库连接是否正常
3. 支付宝回调是否成功

### Q: 图片生成失败？

确保配置了 `DASHSCOPE_API_KEY`（通义万象）。

## 开发指南

### 添加新的 AI 模型

在 `src/lib/` 下创建新的 AI 适配器文件：

```typescript
// src/lib/new-ai.ts
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: 'https://api.new-ai.com',
  apiKey: process.env.NEW_AI_API_KEY
})

export async function generateContent(topic: string) {
  // 实现生成逻辑
}
```

### 添加新的页面

1. 在 `src/app/(app)/` 下创建页面文件夹
2. 添加 `page.tsx` 文件
3. 在 Sidebar 中添加导航项

## License

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 联系方式

- 邮箱: support@example.com
- 问题反馈: [GitHub Issues](https://github.com/your-repo/issues)

---

Made with ❤️ using Next.js
