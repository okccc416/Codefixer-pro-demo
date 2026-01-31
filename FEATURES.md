# 🌟 Codex IDE - 功能详解

## 核心功能一览

### 🗂️ 1. 文件资源管理器

**位置**: 左侧边栏
**宽度**: 可调整 (15%-35%)

#### 功能特性
✨ **树形结构显示**
- 完整的文件夹层级结构
- 清晰的缩进视觉效果
- 文件夹和文件图标区分

✨ **交互功能**
- 点击文件夹: 展开/折叠
- 点击文件: 在编辑器中打开
- 选中高亮: 蓝灰色背景
- 悬停效果: 浅灰色背景

✨ **图标系统**
- 📁 文件夹（折叠）- 蓝色
- 📂 文件夹（展开）- 蓝色
- 📄 文件 - 灰色
- 箭头指示展开状态

#### 演示文件系统
```
src/
  ├── main.py (Python 示例代码)
  └── utils.py (工具函数)
tests/
  └── test_main.py (单元测试)
README.md (项目说明)
```

---

### 📝 2. Monaco 编辑器

**位置**: 中央主区域
**框架**: @monaco-editor/react

#### 编辑器特性
✨ **语法高亮**
- Python (.py)
- JavaScript (.js)
- TypeScript (.ts, .tsx)
- Markdown (.md)
- JSON, CSS, HTML 等

✨ **多标签页系统**
- 顶部标签栏
- 激活标签深色背景
- 每个标签显示文件图标和名称
- 关闭按钮 (悬停显示)
- 标签切换动画

✨ **编辑器配置**
```javascript
{
  minimap: { enabled: true },      // 右侧迷你地图
  fontSize: 14,                    // 字体大小
  lineNumbers: "on",               // 行号显示
  rulers: [80, 120],               // 标尺线
  wordWrap: "on",                  // 自动换行
  automaticLayout: true,           // 自动布局
  scrollBeyondLastLine: false,     // 禁止滚动到最后一行
  renderWhitespace: "selection",   // 显示空白字符
  tabSize: 4,                      // Tab 大小
  folding: true,                   // 代码折叠
  glyphMargin: true,               // 字形边距
  padding: { top: 16 }             // 顶部内边距
}
```

✨ **主题**
- vs-dark (Monaco 内置深色主题)
- 与 IDE 整体风格一致
- 透明背景融入界面

✨ **内置功能**
- Ctrl+F: 查找
- Ctrl+H: 替换
- Ctrl+/: 注释/取消注释
- Alt+Up/Down: 移动行
- Ctrl+D: 选择下一个匹配项
- Ctrl+Shift+L: 选择所有匹配项

---

### 💻 3. 集成终端

**位置**: 编辑器下方
**技术**: Xterm.js + FitAddon
**高度**: 可调整 (15%-50%)

#### 终端特性
✨ **外观**
- 自定义赛博朋克配色方案
- 光标闪烁效果 (蓝色)
- Cascadia Code 等宽字体
- 透明背景 (#09090b)

✨ **颜色方案**
```javascript
{
  background: "#09090b",    // 深黑色背景
  foreground: "#e4e4e7",    // 浅色文本
  cursor: "#3b82f6",        // 蓝色光标
  red: "#ef4444",           // 红色
  green: "#22c55e",         // 绿色
  yellow: "#eab308",        // 黄色
  blue: "#3b82f6",          // 蓝色
  magenta: "#a855f7",       // 紫色
  cyan: "#06b6d4"           // 青色
}
```

✨ **支持的命令**

| 命令 | 功能 | 示例 |
|------|------|------|
| `help` | 显示帮助信息 | `help` |
| `clear` | 清空终端 | `clear` |
| `echo` | 输出文本 | `echo Hello World` |
| `ls` | 列出文件 | `ls` |
| `pwd` | 显示当前目录 | `pwd` |
| `date` | 显示日期时间 | `date` |
| `whoami` | 显示当前用户 | `whoami` |
| `python` | Python 提示符 | `python` |

✨ **交互功能**
- Enter: 执行命令
- Backspace: 删除字符
- 命令历史记录
- 自适应窗口大小
- 彩色输出支持

✨ **欢迎界面**
```
╔═══════════════════════════════════════════╗
║     Welcome to Codex IDE Terminal        ║
╚═══════════════════════════════════════════╝

System ready. Type commands below:
$ 
```

---

### 💬 4. AI 助手面板

**位置**: 右侧边栏
**宽度**: 可调整 (20%-40%)

#### 聊天特性
✨ **界面设计**
- 对话气泡式布局
- 用户消息: 蓝色背景，右对齐
- AI 消息: 灰色背景，左对齐
- 头像图标区分角色
- 时间戳显示

✨ **消息类型**
- 👤 用户消息
  - 蓝色渐变边框
  - 右侧显示
  - 用户图标

- 🤖 AI 助手消息
  - 灰色边框
  - 左侧显示
  - 机器人图标

✨ **输入功能**
- 多行文本框
- 自动高度调整
- Enter: 发送消息
- Shift+Enter: 换行
- 发送按钮 (禁用当输入为空)
- 占位符提示

✨ **消息特性**
- 自动滚动到最新消息
- 保持消息历史
- 支持长文本换行
- 清晰的视觉层次

#### 默认欢迎消息
```
Hello! I'm your AI coding assistant. 
I can help you with code, answer questions, 
and provide suggestions. 
How can I assist you today?
```

---

### 🎛️ 5. 可调整面板

**技术**: react-resizable-panels

#### 布局结构
```
┌──────────────────────────────────────────────┐
│          顶部菜单栏 (固定 48px)                │
├────┬─────────────────────────────────┬───────┤
│ 活 │ 文件资源管理器 │ 编辑器区域     │ AI   │
│ 动 │   (15-35%)     │   (30%+)      │ 助手 │
│ 栏 │                ├────────────────┤ (20- │
│ 固 │                │   终端面板      │ 40%) │
│ 定 │                │   (15-50%)     │      │
│ 48 │                │                │      │
│ px │                │                │      │
├────┴────────────────────────────────────────┤
│          状态栏 (固定 24px)                   │
└──────────────────────────────────────────────┘
```

#### 面板约束
| 面板 | 默认 | 最小 | 最大 |
|------|------|------|------|
| 文件资源管理器 | 20% | 15% | 35% |
| 编辑器 | 55-80% | 30% | 无限制 |
| 终端 | 30% | 15% | 50% |
| AI 助手 | 25% | 20% | 40% |

✨ **拖动手柄**
- 默认: 深灰色 (#27272a)
- 悬停: 蓝色 (#3b82f6)
- 拖动: 蓝色高亮
- 平滑过渡动画 (0.2s)
- 1px 宽度（水平）/ 1px 高度（垂直）

---

### 🎨 6. UI/UX 设计

#### 顶部菜单栏
✨ **Logo 区域**
- Codex IDE 标志
- 蓝色到紫色渐变文字
- Code2 图标

✨ **菜单项**
- File, Edit, View, Run
- 悬停浅灰背景
- 圆角设计

✨ **工具按钮**
- 搜索、Git、设置图标
- 悬停效果
- 右对齐布局

#### 活动栏
✨ **图标按钮**
- 菜单、搜索、Git、终端、聊天
- 激活时蓝色/紫色高亮
- 垂直排列
- 设置按钮在底部

#### 状态栏
✨ **左侧信息**
- Git 分支: main
- 连接状态: 绿点 + "Connected"

✨ **右侧信息**
- 编码: UTF-8
- 换行符: LF
- 语言: Python
- 行列号: Ln 1, Col 1

---

### 🎨 7. 赛博朋克主题

#### 配色方案

**主要颜色**
```css
背景色:
  - 主背景: #09090b (深黑色)
  - 面板背景: #18181b (次深)
  - 悬停背景: #27272a (灰色)
  - 选中背景: #3f3f46 (中灰)

强调色:
  - 主色: #3b82f6 (蓝色)
  - 辅色: #a855f7 (紫色)
  - 成功: #22c55e (绿色)
  - 警告: #eab308 (黄色)
  - 错误: #ef4444 (红色)

文本色:
  - 主文本: #e4e4e7 (几乎白色)
  - 次文本: #a1a1aa (中灰)
  - 暗文本: #52525b (深灰)

边框:
  - 主边框: #27272a
  - 高亮边框: #3b82f6
```

#### 视觉效果
✨ **渐变**
- Logo 文字: 蓝色 → 紫色
- 按钮悬停: 渐变过渡

✨ **圆角**
- 按钮: 4px
- 输入框: 8px
- 卡片: 8px
- 滚动条: 5px

✨ **阴影**
- 面板边框: 1px solid
- 无投影（扁平设计）

✨ **动画**
- 悬停过渡: 0.2s
- 标签切换: 0.2s
- 面板调整: 平滑动画

---

### 🔧 8. 状态管理 (Zustand)

#### Store 结构
```typescript
{
  // 文件系统状态
  fileTree: FileNode[]
  selectedFile: string | null
  
  // 编辑器状态
  tabs: EditorTab[]
  activeTab: string | null
  
  // 终端状态
  terminalOutput: TerminalOutput[]
  terminalHistory: string[]
  
  // UI 可见性
  isTerminalVisible: boolean
  isChatVisible: boolean
}
```

#### 主要操作
```typescript
// 文件操作
openFile(file: FileNode)
closeTab(tabId: string)
selectFile(fileId: string)
toggleFolder(folderId: string)

// 编辑器操作
setActiveTab(tabId: string)
updateTabContent(tabId: string, content: string)

// UI 控制
toggleTerminal()
toggleChat()

// 终端操作
addTerminalOutput(output: string)
clearTerminal()
```

---

### 📊 9. 性能优化

✨ **代码分割**
- IDELayout 动态导入 (ssr: false)
- Monaco Editor 按需加载
- Xterm.js 懒加载

✨ **渲染优化**
- React.memo 优化组件
- Zustand 浅比较
- 虚拟滚动（大文件树）

✨ **自适应布局**
- ResizeObserver 监听尺寸
- FitAddon 自适应终端
- Monaco automaticLayout

---

### 🚀 10. 浏览器兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 90+ |
| Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

---

## 🎯 总结

Codex IDE 提供了一个**完整的、专业的、现代化的** Web IDE 解决方案：

✅ 现代化的 UI/UX 设计
✅ 完整的代码编辑功能
✅ 集成终端和 AI 助手
✅ 高度可定制和可扩展
✅ 优秀的性能和响应速度
✅ 专业的赛博朋克主题

**开始使用**: 访问 http://localhost:3000

---

*文档版本: 1.0 | 更新日期: 2026-01-31*
