# 🔍 终端输出调试指南

## 🚨 问题：Run 后终端仍然空白

如果点击 Run 按钮后终端还是没有输出，请按照以下步骤诊断：

---

## ✅ 步骤 1: 硬刷新浏览器

**浏览器可能缓存了旧代码！**

### Windows:
```
Ctrl + Shift + R  (硬刷新)
或
Ctrl + F5
```

### Mac:
```
Cmd + Shift + R
```

**关键**: 普通 F5 刷新**不够**，必须是硬刷新！

---

## ✅ 步骤 2: 检查浏览器控制台

### 打开开发者工具:
- **Windows**: `F12` 或 `Ctrl + Shift + I`
- **Mac**: `Cmd + Option + I`

### 查看 Console 标签:

**应该看到的调试日志** ✅:
```javascript
[TerminalPanel] terminalOutput changed: 2 items
[TerminalPanel] Writing output 1: ╔════════════════════════════════════════╗
[TerminalPanel] Writing output 2: ✓ Execution completed (500ms)
[TerminalPanel] Writing output 3: Output: Hello from Codex IDE!
```

**如果看到错误** ❌:
```javascript
Error: Cannot read properties of undefined
TypeError: terminal.write is not a function
```
→ **请截图并反馈！**

---

## ✅ 步骤 3: 检查 Settings 配置

### 3.1 检查 E2B API Key
1. 点击右上角 **⚙️ Settings**
2. 向下滚动查看 "E2B API Key" 部分
3. 应该显示: `e2b_6212...` (已配置 ✅)

### 3.2 检查 AI Provider
1. 在 Settings 中
2. 查看 "API Provider" 选择
3. 确保选择了 **Google Gemini** 或 **OpenAI**
4. 输入相应的 API Key

---

## ✅ 步骤 4: 测试最简单代码

### 在编辑器中输入:
```python
print("TEST")
```

### 点击 Run ▶️

### 检查以下位置的输出:

#### 位置 1: 终端面板 (底部)
- 应该显示: `Output: TEST`

#### 位置 2: 浏览器控制台
- 应该显示: `[TerminalPanel] Writing output...`

#### 位置 3: Toast 通知 (右上角)
- 应该显示: `✓ Code Executed`

---

## ✅ 步骤 5: 检查网络请求

### 在浏览器开发者工具中:
1. 打开 **Network** 标签
2. 点击 Run ▶️
3. 查找 `/api/sandbox/run` 请求

### 应该看到:
```
POST /api/sandbox/run
Status: 200 OK
Response: {
  "success": true,
  "output": "TEST\n",
  "stdout": "TEST\n",
  "executionTime": 500
}
```

### 如果看到:
- **401 Unauthorized**: API key 未配置
- **500 Error**: E2B 服务错误
- **404 Not Found**: API 路由问题

---

## 🐛 常见问题排查

### 问题 1: 终端显示欢迎消息，但无 Run 输出
**原因**: useEffect 监听未触发  
**解决**: 检查浏览器控制台是否有 `[TerminalPanel]` 日志

### 问题 2: Toast 显示成功，但终端无输出
**原因**: 数据写入 Zustand，但 xterm 未读取  
**解决**: 
1. 硬刷新浏览器
2. 检查控制台日志
3. 确认 `terminalOutput.length` 在增加

### 问题 3: 完全无反应
**原因**: API 请求失败  
**解决**:
1. 检查 Network 标签
2. 确认 E2B key 正确
3. 检查后端日志

---

## 🔧 手动调试命令

### 在浏览器控制台运行:

#### 1. 检查 Zustand 状态
```javascript
// 获取 store 状态
const store = window.__ZUSTAND_STORE__;
console.log("Terminal Output:", store.getState().terminalOutput);
```

#### 2. 手动触发输出
```javascript
// 手动添加输出（测试）
store.getState().addTerminalOutput("TEST OUTPUT\n");
```

#### 3. 检查 xterm 实例
```javascript
// 查看 xterm 是否初始化
console.log("Xterm ref:", xtermRef.current);
```

---

## 📊 完整诊断清单

运行以下测试并记录结果:

- [ ] 1. 硬刷新浏览器 (Ctrl+Shift+R)
- [ ] 2. 打开浏览器控制台 (F12)
- [ ] 3. 点击 Run 按钮
- [ ] 4. 查看控制台是否有 `[TerminalPanel]` 日志
- [ ] 5. 查看 Network 标签是否有 `/api/sandbox/run` 请求
- [ ] 6. 检查响应是否包含 `output` 字段
- [ ] 7. 查看终端面板是否有输出
- [ ] 8. 截图所有错误信息

---

## 🆘 如果还是不行

### 请提供以下信息:

1. **浏览器控制台截图** (F12 → Console)
2. **Network 请求截图** (F12 → Network → /api/sandbox/run)
3. **终端面板截图** (底部面板)
4. **Settings 配置截图** (E2B key 是否显示)

### 临时解决方案:

#### 方案 1: 使用浏览器的 localStorage 检查
```javascript
// F12 控制台运行
localStorage.getItem('codex-ide-storage')
```

#### 方案 2: 清除缓存重新开始
```javascript
// F12 控制台运行
localStorage.clear();
location.reload();
```

---

## 🎯 预期的完整日志流

**正常运行时，控制台应该显示**:

```javascript
// 1. 点击 Run 按钮
[CodeActionBar] Executing code...

// 2. API 请求
POST /api/sandbox/run
{
  code: "print('TEST')",
  language: "python"
}

// 3. 后端处理
[E2B] Creating sandbox...
[E2B] Running code...
[E2B] Execution completed in 500ms

// 4. 前端响应
[CodeActionBar] Response received: { success: true, output: "TEST\n" }
[CodeActionBar] Adding output to terminal...

// 5. Zustand 更新
[Zustand] terminalOutput updated: 4 items

// 6. TerminalPanel 监听
[TerminalPanel] terminalOutput changed: 4 items
[TerminalPanel] Writing output 3: Output: TEST

// 7. xterm 渲染
[xterm] Terminal updated
```

---

**如果你的控制台日志在某一步中断，请截图并告诉我！** 🔍

---

*调试指南版本: v1.6.2*  
*最后更新: 2026-01-31*
