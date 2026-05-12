// Vercel 注册 API 诊断脚本
// 在浏览器控制台或使用 curl 运行

const API_BASE = 'https://ai-content-workbench.vercel.app'; // 请确认你的 Vercel URL

async function testRegister() {
  console.log('=== 注册 API 诊断开始 ===\n');

  // 1. 测试数据库连接（通过注册失败信息判断）
  console.log('1. 测试注册 API...');
  const testEmail = `diagnostic_${Date.now()}@test.com`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'test123456',
        name: 'Diagnostic Test'
      })
    });

    const data = await res.json();
    console.log('   状态码:', res.status);
    console.log('   响应:', JSON.stringify(data, null, 2));

    if (res.ok) {
      console.log('   ✅ 注册成功！');
    } else {
      console.log('   ❌ 注册失败');
      if (data.debug) {
        console.log('   调试信息:', data.debug);
      }
      if (data.code) {
        console.log('   错误代码:', data.code);
      }
    }
  } catch (err) {
    console.log('   ❌ 网络错误:', err.message);
  }

  console.log('\n=== 诊断结束 ===');
}

// 如果在 Node.js 环境中运行
if (typeof window === 'undefined') {
  testRegister().catch(console.error);
} else {
  // 在浏览器中直接执行
  testRegister();
}
