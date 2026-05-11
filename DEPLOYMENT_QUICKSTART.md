# 🚀 Vercel 部署快速开始

## ✅ 已完成的准备工作

- ✅ Git仓库已初始化
- ✅ 代码已提交 (commit: 78c6c3c)
- ✅ package.json 已更新（添加 prisma generate 到 build 脚本）
- ✅ Next.js 版本降级到 14.2.5（提高稳定性）
- ✅ .gitignore 配置正确（忽略 .env、dev.db 等）
- ✅ 创建详细的部署指南 (VERCEL_DEPLOYMENT.md)

---

## 📋 立即开始：3步部署到Vercel

### 步骤1️⃣：创建GitHub仓库（5分钟）

1. **登录GitHub**: https://github.com
2. **创建新仓库**:
   - 点击右上角 `+` → `New repository`
   - **Repository name**: `ai-content-workbench`
   - **Description**: `AI内容创作平台`
   - 选择 `Public` 或 `Private`
   - ⚠️ **不要**勾选 "Initialize with README"
   - 点击 `Create repository`

3. **推送代码到GitHub**（复制GitHub提供的命令）:
   ```bash
   # 在项目根目录执行（替换为你的GitHub用户名）
   cd /c/Users/lujie/WorkBuddy/2026-05-11-task-3/ai-content-workbench
   
   # 添加远程仓库（替换 YOUR_USERNAME）
   git remote add origin https://github.com/YOUR_USERNAME/ai-content-workbench.git
   
   # 推送代码
   git push -u origin master
   ```

   **如果遇到认证问题**:
   - 方案A: 使用GitHub CLI（推荐）: `gh auth login`
   - 方案B: 生成Personal Access Token: https://github.com/settings/tokens
   - 方案C: 配置SSH密钥: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

### 步骤2️⃣：注册Vercel并导入项目（10分钟）

1. **注册Vercel**:
   - 访问 https://vercel.com
   - 点击 `Sign Up`
   - 选择 `Continue with GitHub`（推荐）
   - 授权Vercel访问你的GitHub账号

2. **导入项目**:
   - 登录后，点击 `Add New...` → `Project`
   - 在 `Import Git Repository` 页面，找到 `ai-content-workbench` 仓库
   - 点击 `Import`

3. **配置项目（使用默认设置即可）**:
   - **Framework Preset**: `Next.js` (自动检测)
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - 点击 `Deploy` （先不要急着部署，先配置环境变量）

---

### 步骤3️⃣：配置环境变量（关键步骤！）

在点击 `Deploy` 之前，必须先配置环境变量！

#### 3.1 配置数据库（PostgreSQL）

**问题**: Vercel不支持SQLite（文件数据库），必须使用PostgreSQL。

**推荐方案：使用Vercel Postgres（最简单）**:
1. 在Vercel项目页面，点击 `Storage` 标签
2. 点击 `Create Database` → 选择 `Postgres`
3. 填写数据库名称: `ai-content-workbench-db`
4. 选择区域（推荐 `Washington, D.C., USA (iad1)` 或 `Hong Kong (hkg1)`）
5. 点击 `Create`
6. **Vercel会自动添加 `POSTGRES_URL` 等环境变量**

**或者，使用免费的PostgreSQL服务**:
- [Supabase](https://supabase.com)（推荐，有免费tier）
- [Neon](https://neon.tech)（推荐，有免费tier）
- [Railway](https://railway.app)

创建数据库后，获取 `DATABASE_URL`（连接字符串）。

#### 3.2 配置其他环境变量

在Vercel项目页面:
1. 点击 `Settings` → `Environment Variables`
2. 添加以下变量:

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | 你的PostgreSQL连接字符串 | Production, Preview, Development |
| `DEEPSEEK_API_KEY` | 你的DeepSeek API Key | Production, Preview, Development |
| `JWT_SECRET` | 随机生成的密钥（至少32字符） | Production, Preview, Development |

**如何生成JWT_SECRET**:
```bash
# 在终端执行
openssl rand -base64 32
```

**如何获取DEEPSEEK_API_KEY**:
1. 访问 https://platform.deepseek.com/
2. 注册/登录
3. 进入 `API Keys` 页面
4. 创建新的API Key
5. 复制并保存到安全地方

#### 3.3 保存并部署

1. 确保所有环境变量已添加
2. 回到项目首页
3. 点击 `Deploy` 按钮
4. 等待部署完成（通常2-5分钟）

---

## 🎉 部署成功后

### 访问你的应用
- Vercel会提供一个 `.vercel.app` 域名，例如:
  - `https://ai-content-workbench.vercel.app`
  - 或 `https://ai-content-workbench-YOUR_USERNAME.vercel.app`

### 测试功能
1. ✅ 首页加载正常
2. ✅ 用户注册/登录功能
3. ✅ 数据库连接正常（查看Prisma错误日志）
4. ✅ AI生成功能（需要配置DeepSeek API Key）

---

## 🔧 常见问题排查

### 问题1: 构建失败 - Prisma错误
**错误信息**: `Prisma Client was not generated`

**解决方案**:
- 确保 `package.json` 中的 `build` 脚本包含 `prisma generate`
- 已修复！你的 `package.json` 已更新

### 问题2: 数据库连接失败
**错误信息**: `Can't reach database server`

**解决方案**:
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 确保数据库允许外部连接
3. 如果使用Vercel Postgres，确保数据库已创建并且环境变量已自动添加

### 问题3: 推送代码到GitHub失败
**错误信息**: `Authentication failed` 或 `Permission denied`

**解决方案**:
1. 使用GitHub CLI: 
   ```bash
   # 安装GitHub CLI: https://cli.github.com/
   gh auth login
   git push -u origin master
   ```
2. 或使用Personal Access Token:
   - 生成Token: https://github.com/settings/tokens
   - 推送时使用Token作为密码

---

## 📚 下一步

部署成功后，你可以:
1. **自定义域名**: 在Vercel项目设置中配置
2. **启用Analytics**: Vercel提供内置分析
3. **设置预览部署**: 每个PR自动创建预览环境
4. **配置CI/CD**: 推送到master分支自动部署

---

## 🆘 需要帮助？

- **查看构建日志**: 在Vercel项目页面的 `Deployments` 标签
- **Vercel文档**: https://vercel.com/docs
- **Next.js部署文档**: https://nextjs.org/docs/deployment
- **Prisma部署指南**: https://www.prisma.io/docs/guides/deployment

---

**现在开始吧！** 🚀

按照上述3个步骤操作，预计15-30分钟内可以完成部署。

如果遇到任何问题，随时问我！
