# Vercel 部署完整指南

## 📋 部署前检查清单

- [x] Git仓库已初始化
- [x] 代码已提交
- [x] .gitignore 配置正确（忽略.env、.next、dev.db等）
- [x] 项目可以本地构建（`npm run build` 成功）
- [ ] 创建GitHub仓库
- [ ] 推送代码到GitHub
- [ ] 注册Vercel账号
- [ ] 配置Vercel部署
- [ ] 配置环境变量
- [ ] 配置生产数据库（PostgreSQL）

---

## 🚀 步骤1：创建GitHub仓库并推送代码

### 1.1 在GitHub上创建新仓库
1. 访问 https://github.com 并登录
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `ai-content-workbench`
   - **Description**: `AI内容创作平台 - 支持爆文分析、AI生成、多平台内容创作`
   - 选择 **Public** 或 **Private**
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 1.2 将本地代码推送到GitHub
在项目根目录执行以下命令（替换为你的GitHub用户名）：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-content-workbench.git

# 验证远程仓库
git remote -v

# 推送代码到GitHub
git push -u origin master
```

**如果推送失败**，可能需要：
- 配置Git凭据管理器
- 或使用SSH密钥（推荐）
- 或使用GitHub CLI: `gh auth login`

---

## 🌐 步骤2：注册并配置Vercel

### 2.1 注册Vercel账号
1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 选择 **Continue with GitHub**（推荐）
4. 授权Vercel访问你的GitHub账号

### 2.2 导入项目
1. 登录Vercel后，点击 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 页面，选择 `ai-content-workbench` 仓库
3. 点击 **"Import"**

---

## ⚙️ 步骤3：配置项目设置

### 3.1 基本配置
Vercel会自动检测Next.js项目，通常无需修改：

- **Framework Preset**: `Next.js` (自动检测)
- **Root Directory**: `./` (默认)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `.next` (默认)
- **Install Command**: `npm install` (默认)

### 3.2 配置环境变量
**重要**：Vercel部署需要配置以下环境变量：

在Vercel项目设置中，找到 **"Settings"** → **"Environment Variables"**，添加以下变量：

#### 必需的环境变量：

```bash
# 数据库（生产环境必须使用PostgreSQL）
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# DeepSeek API Key
DEEPSEEK_API_KEY="sk-your-actual-deepseek-api-key"

# JWT Secret（生成一个强密钥）
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters"
```

#### 如何获取这些值：

1. **DATABASE_URL**:
   - 选项A: 使用 [Vercel Postgres](https://vercel.com/storage/postgres)（推荐）
   - 选项B: 使用 [Supabase](https://supabase.com)（免费）
   - 选项C: 使用 [Neon](https://neon.tech)（免费 tier）
   - 选项D: 使用 [Railway](https://railway.app)

2. **DEEPSEEK_API_KEY**:
   - 访问 https://platform.deepseek.com/
   - 注册并获取API Key

3. **JWT_SECRET**:
   - 生成一个随机字符串（至少32字符）
   - 可以使用: `openssl rand -base64 32`

### 3.3 添加环境变量步骤：
1. 在Vercel项目页面，点击 **"Settings"**
2. 左侧菜单选择 **"Environment Variables"**
3. 逐个添加上述环境变量
4. 选择环境：**Production**, **Preview**, **Development** 全部勾选
5. 点击 **"Save"**

---

## 🗄️ 步骤4：配置生产数据库（PostgreSQL）

### 4.1 为什么需要PostgreSQL？
- Vercel的函数是**无状态**的，无法使用文件数据库（SQLite）
- SQLite的 `dev.db` 文件在Vercel上无法正常工作
- 必须使用云数据库（PostgreSQL、MySQL等）

### 4.2 推荐方案：Vercel Postgres（最简单）
1. 在Vercel项目页面，点击 **"Storage"** 标签
2. 点击 **"Create Database"** → 选择 **"Postgres"**
3. 填写数据库名称：`ai-content-workbench-db`
4. 选择区域（推荐选择离用户最近的地区）
5. 创建后，Vercel会自动将 `POSTGRES_URL` 等环境变量添加到项目中
6. **需要将 `DATABASE_URL` 设置为 `POSTGRES_URL` 的值**

### 4.3 更新Prisma配置
创建 `postgres.prisma` 配置或修改 `schema.prisma`：

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // 改为 postgresql
  url      = env("DATABASE_URL")
}

// ... 其他model定义保持不变
```

### 4.4 数据库迁移
在推送代码前，本地测试PostgreSQL迁移：

```bash
# 安装PostgreSQL（本地测试用）
# Windows: 下载安装 https://www.postgresql.org/download/windows/

# 设置本地DATABASE_URL
# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_content_workbench"

# 推送schema到数据库
npx prisma db push

# 或使用迁移
npx prisma migrate dev --name init
```

---

## 🚀 步骤5：部署项目

### 5.1 自动部署
完成上述配置后：
1. 回到Vercel项目页面
2. 点击 **"Deploy"** 按钮
3. Vercel会自动：
   - 安装依赖 (`npm install`)
   - 构建项目 (`npm run build`)
   - 部署到全球CDN

### 5.2 监控部署日志
- 在部署过程中，可以实时查看日志
- 如果有错误，会显示在 "Build Logs" 中
- 常见问题：
  - ❌ `DATABASE_URL` 未配置 → 检查环境变量
  - ❌ Prisma Client未生成 → 在 package.json 添加 `prisma generate`
  - ❌ 构建超时 → 优化依赖或增加构建时间

### 5.3 添加Build脚本
确保 `package.json` 包含生成Prisma Client的脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## ✅ 步骤6：验证部署

部署成功后：
1. Vercel会提供一个 `.vercel.app` 域名（如 `ai-content-workbench.vercel.app`）
2. 访问该域名，测试以下功能：
   - ✅ 首页加载正常
   - ✅ 用户注册/登录
   - ✅ 数据库连接正常
   - ✅ AI生成功能（需要配置DeepSeek API Key）

---

## 🔧 常见问题排查

### 问题1: 构建失败 - Prisma错误
**错误信息**: `Prisma Client was not generated`

**解决方案**:
1. 在 `package.json` 的 `build` 脚本中添加 `prisma generate`:
   ```json
   "build": "prisma generate && next build"
   ```

2. 确保 `prisma` 在 `devDependencies` 中

### 问题2: 数据库连接失败
**错误信息**: `Can't reach database server`

**解决方案**:
1. 检查 `DATABASE_URL` 环境变量是否正确
2. 确保数据库允许外部连接（检查IP白名单）
3. 使用Vercel Postgres或Supabase等云服务

### 问题3: 环境变量未生效
**解决方案**:
1. 在Vercel项目设置中，检查环境变量是否正确
2. 重新部署项目（每次修改环境变量后需要重新部署）
3. 确保环境变量名称拼写正确

### 问题4: Next.js版本兼容性
**注意**: 你的项目使用的是 Next.js 16.2.6（非常新的版本）

如果遇到构建问题，可以降级到稳定版本：
```bash
npm install next@14.2.5
```

---

## 🎉 部署成功后的下一步

1. **自定义域名**（可选）:
   - 在Vercel项目设置中，点击 **"Domains"**
   - 添加你的域名并按照指示配置DNS

2. **启用Analytics**:
   - Vercel提供内置的Web Analytics
   - 在项目设置中启用

3. **设置CI/CD**:
   - Vercel会自动为每个分支创建Preview部署
   - 主分支自动部署到Production

4. **监控和日志**:
   - 使用Vercel Dashboard查看访问日志
   - 集成错误监控工具（如Sentry）

---

## 📝 快速命令参考

```bash
# 本地构建测试（确保构建成功）
npm run build

# 本地运行生产版本
npm run start

# 检查Prisma schema
npx prisma validate

# 生成Prisma Client
npx prisma generate

# 推送schema到数据库
npx prisma db push

# 创建迁移
npx prisma migrate dev --name init
```

---

## 🔐 安全提醒

- ✅ **不要**将 `.env` 文件提交到Git
- ✅ **不要**在代码中硬编码API Key
- ✅ **使用**强JWT Secret（至少32字符随机字符串）
- ✅ **启用**HTTPS（Vercel默认提供）
- ✅ **定期**更新依赖包

---

## 📚 相关资源

- [Vercel部署文档](https://vercel.com/docs/deployments/overview)
- [Next.js部署文档](https://nextjs.org/docs/deployment)
- [Prisma部署指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres文档](https://vercel.com/storage/postgres)

---

**需要帮助？**
- 查看Vercel构建日志获取详细错误信息
- 访问 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 查看项目Issues页面

祝部署顺利！🚀
