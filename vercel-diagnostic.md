# Vercel 部署诊断指南

## 1. 环境变量检查（最关键）

登录 Vercel Dashboard → 你的项目 → Settings → Environment Variables

确认以下变量已设置：

```
DATABASE_URL=postgresql://neondb_owner:npg_QNsqP5JdaOZ1@ep-long-mud-ao0glb5k-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secure-random-string-here
```

**重要**：
- 确保不是示例值 `postgres://user:pass@db.example.com:5432/app`
- 修改后必须点击 "Save" 保存
- 保存后必须重新部署（Deploy → Redeploy）

## 2. 构建脚本检查

package.json 中已有：
```json
"build": "prisma generate && next build",
"postinstall": "prisma generate"
```

这确保 Prisma Client 在构建时生成。

## 3. 如何确认注册 API 是否正常工作

部署后，在浏览器控制台执行：
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test' + Date.now() + '@example.com',
    password: 'test123456'
  })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(e => console.error(e))
```

## 4. 查看 Vercel 函数日志

Vercel Dashboard → 项目 → Logs → 选择 "Functions"
查看 `/api/auth/register` 的调用日志

## 5. 常见问题

### 问题：DATABASE_URL 保存后消失
解决：确保点击了 Save 按钮，并且值正确无误

### 问题：Prisma 连接失败
解决：检查 DATABASE_URL 格式是否正确，Neon 数据库是否可访问

### 问题：JWT_SECRET 未设置
解决：设置一个随机字符串作为 JWT_SECRET
