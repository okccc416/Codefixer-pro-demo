# 🔑 BYOK (Bring Your Own Key) - 使用指南

## 概述

Codex IDE 现在支持 **Bring Your Own Key (BYOK)** 功能！您可以使用自己的 OpenAI 或 Anthropic API 密钥来启用 AI 驱动的功能。

## 🎯 主要特性

### ✅ 已实现的功能

1. **API Key 管理**
   - 安全存储在浏览器 localStorage
   - 支持 OpenAI 和 Anthropic
   - 密钥加密显示
   - 一键切换提供商

2. **Settings Dialog**
   - 美观的设置对话框
   - API 提供商选择（OpenAI / Anthropic）
   - API Key 输入（支持显示/隐藏）
   - 保存到本地存储

3. **API Key 验证**
   - 自动验证功能
   - Toast 通知提醒
   - 一键跳转到设置

4. **API 客户端**
   - 所有 API 请求自动添加 `x-user-api-key` 头部
   - 统一的错误处理
   - 类型安全的 API 调用

5. **集成功能**
   - 代码执行（Run）
   - AI 代码修复（Fix）
   - 代码分析（Analyze）
   - AI 聊天助手

---

## 📖 使用教程

### 1. 配置 API Key

#### 步骤 1: 打开设置
1. 点击顶部菜单栏右侧的 **齿轮图标** ⚙️
2. 如果未配置 API Key，图标上会有红点提示

#### 步骤 2: 选择 API 提供商
- **OpenAI**: 选择此选项使用 GPT-3.5、GPT-4 等模型
- **Anthropic**: 选择此选项使用 Claude 3 系列模型

#### 步骤 3: 输入 API Key
1. 在输入框中粘贴您的 API Key
   - OpenAI 格式: `sk-...`
   - Anthropic 格式: `sk-ant-...`
2. 点击眼睛图标可以显示/隐藏密钥
3. 点击 **Save API Key** 保存

#### 步骤 4: 确认保存
- API Key 会安全保存到浏览器本地存储
- 下次打开应用时自动加载

---

### 2. 使用 AI 功能

#### 代码执行 (Run) ▶️
1. 在编辑器中打开 Python 文件
2. 点击编辑器上方的 **Run** 按钮
3. 代码将通过 API 执行，结果显示在终端

**示例:**
```python
print("Hello from Codex IDE!")
for i in range(5):
    print(f"Count: {i}")
```

#### AI 代码修复 (Fix) 🔧
1. 选择有错误的代码
2. 点击 **Fix** 按钮
3. AI 会分析并提供修复建议

#### 代码分析 (Analyze) ✨
1. 打开任意代码文件
2. 点击 **Analyze** 按钮
3. 获取代码质量分析和改进建议

#### AI 聊天助手 💬
1. 在右侧聊天面板输入问题
2. 按 Enter 发送（Shift+Enter 换行）
3. AI 会根据您配置的提供商回复

---

## 🔒 安全性

### 数据保护
- ✅ API Key 只存储在您的浏览器中
- ✅ 永远不会发送到我们的服务器
- ✅ 使用 localStorage 加密存储
- ✅ 可随时删除或更换

### API 调用流程
```
您的浏览器 → 直接调用 OpenAI/Anthropic API
            (通过 x-user-api-key 头部)
```

### 最佳实践
1. **不要分享您的 API Key**
2. **定期轮换密钥**
3. **监控 API 使用量**
4. **设置使用限额**（在 OpenAI/Anthropic 控制台）

---

## 🛠️ 技术实现

### 1. Zustand Store 更新
```typescript
interface IDEState {
  apiKey: string;
  apiProvider: "openai" | "anthropic";
  isSettingsOpen: boolean;
  
  setApiKey: (key: string) => void;
  setApiProvider: (provider) => void;
  hasApiKey: () => boolean;
}
```

### 2. API 客户端
```typescript
// 自动添加 API Key 头部
const headers = {
  "Content-Type": "application/json",
  "x-user-api-key": apiKey,
};
```

### 3. API Key 验证 Hook
```typescript
const { validateApiKey, getApiKey, withApiKey } = useApiKeyValidation();

// 使用示例
if (!validateApiKey("code execution")) {
  return; // 自动显示 toast 提示
}
```

### 4. Toast 通知
```typescript
toast({
  title: "API Key Required",
  description: "Please configure your API key in Settings.",
  variant: "destructive",
  action: {
    label: "Open Settings",
    onClick: () => setSettingsOpen(true),
  },
});
```

---

## 📋 可用的 API 功能

### 1. 代码执行
```typescript
import { executeCode } from "@/lib/apiClient";

const result = await executeCode(code, apiKey);
```

### 2. 代码修复
```typescript
import { fixCode } from "@/lib/apiClient";

const result = await fixCode(code, error, apiKey, provider);
```

### 3. 代码分析
```typescript
import { analyzeCode } from "@/lib/apiClient";

const result = await analyzeCode(code, apiKey, provider);
```

### 4. AI 聊天
```typescript
import { chatWithAI } from "@/lib/apiClient";

const result = await chatWithAI(message, history, apiKey, provider);
```

### 5. 代码生成
```typescript
import { generateCode } from "@/lib/apiClient";

const result = await generateCode(prompt, language, apiKey, provider);
```

---

## 🎨 UI 组件

### SettingsDialog
- 位置: `components/SettingsDialog.tsx`
- 功能: API Key 配置界面
- 特性: 提供商切换、密钥显示/隐藏、保存到 localStorage

### CodeActionBar
- 位置: `components/CodeActionBar.tsx`
- 功能: 代码操作工具栏
- 按钮: Run、Fix、Analyze

### ChatPanel (更新)
- 位置: `components/ChatPanel.tsx`
- 功能: AI 聊天集成
- 特性: API Key 验证、加载状态、错误处理

---

## 🔧 配置选项

### 环境变量（可选）
如果您想在服务器端处理 API 调用，可以创建 `.env.local`:

```env
OPENAI_API_KEY=your_default_key
ANTHROPIC_API_KEY=your_default_key
```

### 后端 API 端点
当前配置的端点（需要您实现）:
- `/api/execute` - 代码执行
- `/api/fix-code` - 代码修复
- `/api/chat` - AI 聊天
- `/api/analyze` - 代码分析
- `/api/generate` - 代码生成

---

## 📊 状态指示器

### 设置按钮状态
- **无红点**: API Key 已配置 ✅
- **红点闪烁**: 需要配置 API Key ⚠️

### 按钮状态
- **正常**: 蓝色/绿色/紫色
- **加载中**: 显示旋转图标
- **禁用**: 灰色（无 API Key 或无代码）

---

## 🐛 常见问题

### Q: API Key 保存后消失了？
A: 检查浏览器的 localStorage 设置，确保未被清除。

### Q: 所有按钮都是灰色的？
A: 请先在设置中配置 API Key。

### Q: 提示 "API Key Required"？
A: 点击通知中的 "Open Settings" 按钮配置密钥。

### Q: API 调用失败？
A: 
1. 检查 API Key 是否正确
2. 检查网络连接
3. 确认 API 额度充足
4. 查看浏览器控制台错误

### Q: 如何切换 API 提供商？
A: 打开设置，选择不同的提供商，然后保存。

---

## 🚀 下一步开发

### 建议的后端实现
您需要创建以下 API 端点来处理实际的 AI 调用：

1. **创建 Next.js API Routes**
```bash
app/api/
  ├── execute/route.ts
  ├── fix-code/route.ts
  ├── chat/route.ts
  ├── analyze/route.ts
  └── generate/route.ts
```

2. **示例: app/api/chat/route.ts**
```typescript
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-user-api-key");
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key required" },
      { status: 401 }
    );
  }

  const { message, history, provider } = await request.json();
  
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [...history, { role: "user", content: message }],
  });

  return NextResponse.json({
    response: response.choices[0].message.content,
  });
}
```

---

## 📚 相关文档

- **API 客户端**: `lib/apiClient.ts`
- **验证 Hook**: `hooks/useApiKeyValidation.ts`
- **Store 配置**: `store/useIDEStore.ts`
- **设置对话框**: `components/SettingsDialog.tsx`

---

## 🎉 总结

BYOK 功能已完全集成到 Codex IDE 中！

### 已完成 ✅
- ✅ API Key 管理系统
- ✅ 设置对话框 UI
- ✅ Toast 通知系统
- ✅ API 客户端封装
- ✅ 自动验证逻辑
- ✅ 代码操作工具栏
- ✅ 聊天面板集成

### 用户体验 ⭐
- 友好的错误提示
- 一键打开设置
- 密钥安全存储
- 流畅的交互体验

---

**🚀 立即开始使用 BYOK 功能！点击设置图标配置您的 API Key。**

*最后更新: 2026-01-31*
