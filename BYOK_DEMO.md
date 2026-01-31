# 🎬 BYOK 功能演示指南

## 🚀 快速开始（5分钟）

### 步骤 1: 启动应用
```bash
npm run dev
```
访问: **http://localhost:3000**

---

### 步骤 2: 注意设置按钮
👀 查看顶部右侧的**齿轮图标** ⚙️
- 有**红色闪烁圆点** = 需要配置 API Key

---

### 步骤 3: 配置 API Key

#### 3.1 打开设置
点击齿轮图标 ⚙️

#### 3.2 选择提供商
- **OpenAI** (GPT-3.5/GPT-4)
- **Anthropic** (Claude 3)

#### 3.3 输入 API Key
```
OpenAI: sk-proj-...
Anthropic: sk-ant-api...
```

#### 3.4 保存
点击 **Save API Key** 按钮
✅ 红点消失 = 配置成功！

---

### 步骤 4: 测试功能

#### 4.1 测试代码执行 ▶️
1. 点击左侧 **src/main.py**
2. 查看编辑器上方的 **Run** 按钮（绿色）
3. 点击 Run
4. 查看底部终端输出

**预期效果:**
```
[Executing code...]
[Success]
Fibonacci(0) = 0
Fibonacci(1) = 1
...
```

#### 4.2 测试 AI 修复 🔧
1. 在代码中制造一个错误
2. 点击 **Fix** 按钮（蓝色）
3. 等待 AI 分析
4. 查看修复建议

#### 4.3 测试代码分析 ✨
1. 打开任意代码文件
2. 点击 **Analyze** 按钮（紫色）
3. 查看分析结果

#### 4.4 测试 AI 聊天 💬
1. 在右侧聊天面板输入问题
   ```
   如何优化这段 Fibonacci 代码？
   ```
2. 按 Enter 发送
3. 等待 AI 回复

---

## 🧪 测试场景

### 场景 A: 未配置 API Key
```
✅ 点击 Run → Toast 提示 "API Key Required"
✅ 点击 Toast 中的 "Open Settings"
✅ 跳转到设置对话框
✅ 配置后功能可用
```

### 场景 B: 已配置 API Key
```
✅ 红点消失
✅ 所有功能按钮可点击
✅ API 调用自动添加 x-user-api-key 头部
✅ 错误时显示 Toast 通知
```

### 场景 C: 刷新页面
```
✅ API Key 自动从 localStorage 加载
✅ 功能保持可用状态
✅ 提供商设置保持不变
```

### 场景 D: 切换提供商
```
✅ 打开设置
✅ 从 OpenAI 切换到 Anthropic
✅ 输入新的 API Key
✅ 保存
✅ 后续调用使用新提供商
```

---

## 🎨 UI 元素说明

### 1. 设置图标（顶部右侧）
```
⚙️ 无红点 = 已配置 ✅
⚙️ 红点闪烁 = 未配置 ⚠️
```

### 2. 设置对话框
```
┌─────────────────────────────────┐
│ 🔑 Settings                     │
│─────────────────────────────────│
│ API Provider:                   │
│ [✓ OpenAI]  [Anthropic]        │
│                                 │
│ OpenAI API Key:                 │
│ [sk-••••••••••••••] 👁         │
│                                 │
│ 🔒 BYOK Info Box                │
│                                 │
│ Current: sk-proj-•••••          │
│                                 │
│     [Cancel]  [Save API Key]    │
└─────────────────────────────────┘
```

### 3. 代码操作栏
```
┌─────────────────────────────────┐
│ ▶ Run  🔧 Fix  ✨ Analyze      │
└─────────────────────────────────┘
```

### 4. Toast 通知
```
未配置时:
╔═══════════════════════════════╗
║ ⚠️ API Key Required           ║
║ Please configure your API key ║
║          [Open Settings]      ║
╚═══════════════════════════════╝

成功时:
╔═══════════════════════════════╗
║ ✅ Code Executed              ║
║ Your code ran successfully!   ║
╚═══════════════════════════════╝

错误时:
╔═══════════════════════════════╗
║ ❌ Execution Failed           ║
║ Error message here            ║
╚═══════════════════════════════╝
```

---

## 📊 功能矩阵

| 功能 | API Key 未配置 | API Key 已配置 |
|------|---------------|---------------|
| Run 按钮 | 灰色 + Toast | 可用 ✅ |
| Fix 按钮 | 灰色 + Toast | 可用 ✅ |
| Analyze 按钮 | 灰色 + Toast | 可用 ✅ |
| AI 聊天 | Toast 提示 | 可用 ✅ |
| 设置图标 | 红点闪烁 | 无红点 ✅ |

---

## 💡 提示与技巧

### 获取 API Key

#### OpenAI
1. 访问: https://platform.openai.com/api-keys
2. 登录账户
3. 点击 "Create new secret key"
4. 复制密钥（sk-proj-...）
5. 粘贴到 Codex IDE 设置中

#### Anthropic
1. 访问: https://console.anthropic.com/
2. 登录账户
3. 进入 API Keys 页面
4. 创建新密钥
5. 复制并粘贴到设置中

---

### 密钥安全
```
✅ DO:
- 使用环境变量（生产环境）
- 定期轮换密钥
- 监控使用量
- 设置支出限额

❌ DON'T:
- 分享您的 API Key
- 提交到 Git 仓库
- 在公共电脑上保存
- 使用过期密钥
```

---

### 调试技巧

#### 问题: 功能按钮灰色
```bash
# 解决方案
1. 检查设置图标是否有红点
2. 打开设置配置 API Key
3. 刷新页面
```

#### 问题: API 调用失败
```bash
# 检查清单
□ API Key 是否正确？
□ 网络连接正常？
□ API 额度是否充足？
□ 提供商选择正确？

# 查看详细错误
□ 打开浏览器控制台 (F12)
□ 查看 Console 标签
□ 搜索错误消息
```

#### 问题: Toast 不显示
```bash
# 解决方案
1. 检查 IDELayout 中是否有 <Toaster />
2. 刷新页面
3. 查看控制台错误
```

---

## 🔍 深入探索

### localStorage 检查
```javascript
// 打开浏览器控制台 (F12)
// 查看存储的数据
localStorage.getItem('codex-ide-storage')

// 清除数据
localStorage.removeItem('codex-ide-storage')
```

### 网络请求检查
```
F12 → Network 标签 → 搜索 "api"
查看:
- Request Headers
- x-user-api-key 头部
- Response
```

### React DevTools
```
安装 React DevTools 扩展
查看:
- useIDEStore 状态
- apiKey 值
- apiProvider 值
```

---

## 📹 演示视频脚本

### 场景 1: 首次使用（2分钟）
```
1. [00:00] 启动应用
2. [00:10] 指出设置图标的红点
3. [00:15] 点击 Run 按钮
4. [00:20] Toast 提示 "API Key Required"
5. [00:25] 点击 "Open Settings"
6. [00:30] 选择 OpenAI
7. [00:35] 输入 API Key
8. [00:40] 点击 Save
9. [00:45] 红点消失
10. [00:50] 再次点击 Run
11. [00:55] 代码成功执行
12. [01:00] 终端显示输出
```

### 场景 2: 完整功能演示（3分钟）
```
1. Run - 执行 Python 代码
2. Fix - AI 修复代码错误
3. Analyze - 分析代码质量
4. Chat - AI 聊天问答
5. Settings - 切换提供商
```

---

## 🎯 成功标准

### 用户能够:
- ✅ 轻松找到设置入口
- ✅ 理解 API Key 的作用
- ✅ 成功配置 API Key
- ✅ 使用所有 AI 功能
- ✅ 看到清晰的错误提示
- ✅ 快速解决问题

### 系统表现:
- ✅ Toast 通知及时准确
- ✅ API Key 持久化正常
- ✅ 验证逻辑正确
- ✅ 错误处理完善
- ✅ 加载状态明确
- ✅ UI 响应流畅

---

## 📞 获取帮助

### 文档资源
- **BYOK_GUIDE.md** - 完整使用指南
- **BYOK_IMPLEMENTATION.md** - 技术实现详情
- **README.md** - 项目总览

### 常见问题
- 查看 BYOK_GUIDE.md 的 "常见问题" 部分
- 检查浏览器控制台错误
- 验证 API Key 格式

---

## 🎊 享受 BYOK 功能！

**准备好了吗？**
1. 🚀 启动应用: `npm run dev`
2. ⚙️ 点击设置图标
3. 🔑 输入 API Key
4. ✨ 开始使用 AI 功能！

---

**快乐编码！🎉**

*演示指南版本: 1.0 | 日期: 2026-01-31*
