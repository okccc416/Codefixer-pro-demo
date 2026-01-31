# 🎨 Diff Editor & Thinking UI - 用户指南

## 概述

Codex IDE 现在提供**完整的 AI Fix 体验**，包括：
- 🔀 **Monaco Diff Editor** - 并排代码对比
- 🧠 **Thinking UI** - 实时 Agent 进度显示
- ✅ **Accept/Reject 控制** - 灵活的修复选项

---

## 🚀 快速开始

### 1. 基本 AI Fix 流程

```
编写有错误的代码 → 点击 AI Fix → 观察 Agent 工作 → 在 Diff 中查看修复 → 接受或拒绝
```

### 2. 示例演示

**第一步：编写代码**
```python
# 文件: main.py
print(x + y)
```

**第二步：点击 AI Fix 按钮**（紫色脑图标 🧠）

**第三步：观察 Thinking UI**
```
╔════════════════════════════════════════╗
║  🧠 AI Agent Working...        ⟳       ║
║  Understanding the problem...           ║
╚════════════════════════════════════════╝

Progress: [████████████░░░░░░] 60%

🔍 ──── 🧪 ──── ✨ ──── ○
Analyzing  Verifying  Self-Correcting  Done
```

**第四步：Diff Editor 自动打开**
```
╔═══════════════════════════════════════════════════════╗
║  🔀 AI Fix - Diff View         [Reject] [✓ Accept Fix]║
╠═══════════════════════════════════════════════════════╣
║  Original Code          │  AI Fixed Code              ║
║  ─────────────          │  ────────────               ║
║  1  print(x + y)        │  1  x = 5                   ║
║                         │  2  y = 10                  ║
║                         │  3  print(x + y)            ║
╚═══════════════════════════════════════════════════════╝
```

**第五步：选择操作**
- ✓ **Accept Fix** - 应用修复
- ✗ **Reject** - 放弃修复
- ⌨️ **Esc** - 快速关闭

---

## 🎨 Thinking UI 详解

### Agent 工作步骤

Thinking UI 显示 AI Agent 的 4 个工作阶段：

#### 1. 🔍 Analyzing Error
**描述**: "Understanding the problem..."

**Agent 在做什么**:
- 分析您的代码
- 识别错误类型
- 理解上下文
- 规划修复策略

**进度**: 0-25%

---

#### 2. 🧪 Verifying in Sandbox
**描述**: "Testing the fix in E2B..."

**Agent 在做什么**:
- 生成修复代码
- 在 E2B 沙箱中测试
- 验证修复是否有效
- 检查是否引入新错误

**进度**: 25-60%

---

#### 3. ✨ Self-Correcting
**描述**: "Refining the solution..."

**Agent 在做什么**:
- 分析测试结果
- 如果失败，重新尝试
- 优化修复方案
- 最多 3 次尝试

**进度**: 60-95%

---

#### 4. ✓ Done
**描述**: "Fix complete!"

**Agent 完成**:
- 修复成功验证
- 准备显示 Diff
- 等待用户审查

**进度**: 100%

---

### Thinking UI 组件说明

```
┌──────────────────────────────────────────────────┐
│ [1] Header                                        │
│  🧠 AI Agent Working...                 ⟳        │
│  Understanding the problem...                     │
├──────────────────────────────────────────────────┤
│ [2] Progress Bar                                  │
│  ████████████████░░░░░░░░░░░░░░  60%             │
├──────────────────────────────────────────────────┤
│ [3] Step Indicators                               │
│   ✓──────●──────○──────○                         │
│   🔍    🧪     ✨     ✓                          │
│  Done  Active  Pending Pending                   │
├──────────────────────────────────────────────────┤
│ [4] Status Message (完成时显示)                   │
│  ✓ Your code has been fixed!                     │
└──────────────────────────────────────────────────┘
```

**组件说明**:
1. **Header** - 显示当前状态和描述
2. **Progress Bar** - 实时进度百分比
3. **Step Indicators** - 4 个步骤的可视化
4. **Status Message** - 完成时的提示

---

## 🔀 Diff Editor 详解

### 界面布局

```
╔═══════════════════════════════════════════════════════╗
║ [1] Header                                             ║
║  🔀 AI Fix - Diff View         [Reject] [✓ Accept Fix]║
╠═══════════════════════════════════════════════════════╣
║ [2] Legend                                             ║
║  🟥 Removed  🟩 Added  🟦 Modified                      ║
╠═══════════════════════════════════════════════════════╣
║ [3] Side-by-Side View                                  ║
║  Original Code (Left)      │  AI Fixed Code (Right)    ║
║  ─────────────────────     │  ────────────────────     ║
║  Line numbers, syntax highlighting, diff markers       ║
╠═══════════════════════════════════════════════════════╣
║ [4] Footer                                             ║
║  Language: PYTHON          Read-only   [Esc] to close  ║
╚═══════════════════════════════════════════════════════╝
```

### 颜色标记说明

| 颜色 | 含义 | 示例 |
|------|------|------|
| 🟩 **绿色** | 新增的代码行 | `+ x = 5` |
| 🟥 **红色** | 删除的代码行 | `- old_code` |
| 🟦 **蓝色** | 修改的代码行 | `~ updated_code` |
| ⚪ **白色** | 未改变的行 | `  print("hi")` |

---

### Accept/Reject 按钮

#### ✓ Accept Fix (绿色按钮)
**功能**: 应用 AI 的修复到编辑器

**操作**:
1. 点击 "Accept Fix"
2. 编辑器内容更新为修复后的代码
3. Diff Editor 关闭
4. Toast 显示 "✓ Changes applied"

**快捷键**: 无（建议手动点击以避免误操作）

---

#### ✗ Reject (灰色按钮)
**功能**: 放弃修复，保持原代码

**操作**:
1. 点击 "Reject"
2. 编辑器内容保持不变
3. Diff Editor 关闭
4. Toast 显示 "Changes discarded"

**快捷键**: `Esc`

---

### Diff Editor 特性

#### 1. 并排对比
- **左侧**: 原始代码
- **右侧**: AI 修复后的代码
- **分栏**: 可调整大小

#### 2. 语法高亮
- 根据文件类型自动高亮
- 支持 Python, JavaScript, TypeScript 等
- 使用 VS Code 的 Monaco 引擎

#### 3. 行号显示
- 两侧都有行号
- 便于定位修改位置
- 支持点击跳转

#### 4. Minimap
- 右侧缩略图
- 快速导航长文件
- 显示修改位置

#### 5. 只读模式
- 防止意外编辑
- 仅用于审查
- 使用 Accept 来应用更改

---

## 🎮 操作指南

### 基本操作

#### 1. 启动 AI Fix
```
方法 1: 点击按钮
  - 定位: 编辑器上方工具栏
  - 图标: 紫色脑图标 🧠
  - 文本: "AI Fix"

方法 2: 快捷键 (未来功能)
  - Cmd/Ctrl + Shift + F
```

#### 2. 观察进度
```
自动显示 Thinking UI
  - 位置: 屏幕顶部中央
  - 持续时间: 5-60 秒（取决于复杂度）
  - 可视化: 进度条 + 步骤指示器
```

#### 3. 查看 Diff
```
自动切换到 Diff Editor
  - 时机: Agent 完成后 1.5 秒
  - 动画: 平滑过渡
  - 焦点: 自动聚焦到 Diff 视图
```

#### 4. 做出决定
```
选项 A: Accept Fix
  - 点击绿色按钮
  - 修复应用到编辑器

选项 B: Reject
  - 点击灰色按钮
  - 或按 Esc 键
  - 保持原代码不变
```

---

### 高级操作

#### 1. 查看详细日志
**位置**: 终端面板

**内容**:
```
[Attempt 1]
💭 Thought: Error indicates 'x' is undefined. Need to define it.
⚡ Action: Executing Python code in sandbox
📊 Result: ✓ Success! Output: 15
```

#### 2. 多次尝试修复
如果第一次修复失败，Agent 会自动重试：

```
Attempt 1: 失败 → 分析新错误
Attempt 2: 失败 → 尝试不同方法
Attempt 3: 成功 ✓
```

#### 3. 处理复杂修复
对于复杂的问题：
- Agent 可能需要更长时间
- Thinking UI 会显示更多自我修正步骤
- 终端会显示详细的思考过程

---

## 📋 使用场景

### 场景 1: 未定义变量

**原始代码**:
```python
result = calculate(a, b)
print(result)
```

**Thinking UI 步骤**:
1. 🔍 Analyzing - 发现 `calculate`, `a`, `b` 未定义
2. 🧪 Verifying - 测试添加定义
3. ✨ Self-Correcting - 确认修复有效
4. ✓ Done - 准备显示 Diff

**Diff Editor 显示**:
```diff
Left (Original):                Right (Fixed):
                                + def calculate(x, y):
                                +     return x + y
                                + 
                                + a = 5
                                + b = 10
  result = calculate(a, b)        result = calculate(a, b)
  print(result)                   print(result)
```

**操作**:
- Accept → 完整的代码，可以运行 ✓
- Reject → 保持原样，手动修复 ✗

---

### 场景 2: 类型错误

**原始代码**:
```python
def greet(name):
    return "Hello, " + name

greet(123)
```

**Thinking UI 步骤**:
1. 🔍 Analyzing - 类型不匹配
2. 🧪 Verifying - 测试类型转换
3. ✓ Done - 首次尝试成功

**Diff Editor 显示**:
```diff
Left (Original):                Right (Fixed):
  def greet(name):                def greet(name):
~     return "Hello, " + name  ~     return "Hello, " + str(name)
  
  greet(123)                      greet(123)
```

**修改标记**: 蓝色（修改行）

---

### 场景 3: 语法错误

**原始代码**:
```python
def calculate(x, y)
    return x + y
```

**Thinking UI 步骤**:
1. 🔍 Analyzing - 缺少冒号
2. 🧪 Verifying - 添加冒号
3. ✓ Done - 快速修复

**Diff Editor 显示**:
```diff
Left (Original):                Right (Fixed):
~ def calculate(x, y)         ~ def calculate(x, y):
      return x + y                  return x + y
```

---

### 场景 4: 逻辑错误

**原始代码**:
```python
def divide(a, b):
    return a / b

divide(10, 0)
```

**Thinking UI 步骤**:
1. 🔍 Analyzing - 零除错误
2. 🧪 Verifying - 添加检查
3. ✨ Self-Correcting - 优化处理
4. ✓ Done - 完成

**Diff Editor 显示**:
```diff
Left (Original):                Right (Fixed):
  def divide(a, b):               def divide(a, b):
+                                 +     if b == 0:
+                                 +         return 0
      return a / b                    return a / b
```

---

## ⌨️ 快捷键

| 按键 | 功能 | 上下文 |
|------|------|--------|
| `Esc` | 关闭 Diff Editor | Diff 视图激活时 |
| `Cmd/Ctrl + S` | 保存（自动保存已启用） | 编辑器 |
| *(未来)* `Cmd/Ctrl + Shift + F` | 触发 AI Fix | 编辑器 |

---

## 🎯 最佳实践

### 1. 何时使用 AI Fix
✅ **适合使用**:
- 简单的语法错误
- 未定义的变量
- 类型转换错误
- 导入错误
- 缩进问题

❌ **不适合使用**:
- 复杂的业务逻辑
- 算法优化
- 性能问题
- 架构重构

### 2. 审查修复
在接受修复前，请：
- ✓ 仔细查看 Diff 中的所有更改
- ✓ 确认修复符合您的意图
- ✓ 检查是否有意外的副作用
- ✓ 阅读终端中的 Agent 思考日志

### 3. 处理失败
如果 AI Fix 失败：
- 尝试简化问题
- 提供更多上下文（注释）
- 手动修复然后运行测试
- 查看终端日志了解失败原因

---

## 🐛 故障排除

### 问题 1: Thinking UI 卡住
**症状**: 进度条停在某个百分比

**原因**:
- 网络问题
- API 超时
- Agent 工作时间过长

**解决方案**:
1. 等待 2 分钟（最大超时）
2. 刷新页面
3. 检查网络连接
4. 查看浏览器控制台

---

### 问题 2: Diff Editor 不打开
**症状**: Agent 完成但没有 Diff

**原因**:
- 修复与原代码相同
- Agent 失败但未正确报错

**解决方案**:
1. 查看终端日志
2. 查看 Toast 通知
3. 检查是否有错误信息

---

### 问题 3: Accept 后代码丢失
**症状**: 接受修复后编辑器为空

**原因**: 状态管理问题（罕见）

**解决方案**:
1. 按 Cmd/Ctrl + Z 撤销
2. 从 Diff 视图手动复制代码
3. 报告 Bug

---

### 问题 4: Esc 键不工作
**症状**: 按 Esc 不能关闭 Diff

**原因**: 焦点不在 Diff Editor 上

**解决方案**:
1. 点击 Diff Editor 区域
2. 再次按 Esc
3. 或使用 Reject 按钮

---

## 🎨 UI/UX 细节

### 动画效果

#### 1. Thinking UI 出现
```
效果: fade-in + slide-in-from-top
持续: 300ms
缓动: ease-out
```

#### 2. 进度条
```
效果: smooth transition
更新频率: 实时
动画: width 变化
```

#### 3. 步骤图标
```
完成: 绿色 ✓ 无动画
当前: 紫色 ● 脉冲动画
等待: 灰色 ○ 半透明
```

#### 4. Diff Editor 切换
```
效果: 平滑替换
持续: 200ms
保留: Tab 栏不变
```

### 颜色主题

#### Thinking UI
```css
背景: #18181b (深灰黑)
边框: #52525b (中灰)
文字: #fafafa (白色)
进度条: 紫色渐变 (#9333ea → #a855f7)
完成: 绿色渐变 (#10b981 → #34d399)
```

#### Diff Editor
```css
背景: #09090b (纯黑)
头部: #18181b (深灰黑)
边框: #52525b (中灰)
新增: #10b98120 (绿色透明)
删除: #ef444420 (红色透明)
修改: #3b82f620 (蓝色透明)
```

---

## 📊 性能指标

### Thinking UI
- **渲染时间**: < 50ms
- **动画帧率**: 60 FPS
- **内存占用**: < 5MB

### Diff Editor
- **加载时间**: < 200ms
- **大文件性能**: 支持 10,000+ 行
- **语法高亮**: 实时

### Agent 处理
- **简单错误**: 5-15 秒
- **中等错误**: 15-40 秒
- **复杂错误**: 40-90 秒
- **最大超时**: 120 秒

---

## 🔮 即将推出

### 短期功能
- ⏰ Diff 统计（+X/-Y 行）
- ⏰ 自定义 Thinking UI 主题
- ⏰ 键盘快捷键优化
- ⏰ Diff 历史记录

### 中期功能
- ⏰ 多文件 Diff
- ⏰ 部分接受修复
- ⏰ AI 解释修复原因
- ⏰ 并排/内联 Diff 切换

### 长期功能
- ⏰ 协作 Diff 审查
- ⏰ 时间旅行（Undo/Redo）
- ⏰ Diff 评论功能
- ⏰ 导出 Diff Patch

---

## 📚 相关文档

- **[AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)** - AI Agent 工作原理
- **[E2B_INTEGRATION.md](./E2B_INTEGRATION.md)** - 沙箱执行详情
- **[BYOK_GUIDE.md](./BYOK_GUIDE.md)** - API Key 配置

---

## 🎉 总结

**Diff Editor + Thinking UI 提供了**:
- ✅ 直观的 AI 修复体验
- ✅ 实时的进度反馈
- ✅ 清晰的代码对比
- ✅ 灵活的控制选项
- ✅ 流畅的动画效果

**享受您的 AI 驱动编程体验！** 🤖✨🎨

---

*"See the diff, understand the fix, make the choice."*

**Happy Coding with Beautiful UX! 🚀**
