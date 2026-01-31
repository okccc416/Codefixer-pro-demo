# Codex IDE - 项目结构

## 📂 目录结构

```
Codex/
├── app/
│   ├── globals.css          # 全局样式 + 赛博朋克主题
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面（动态导入 IDELayout）
│
├── components/
│   ├── IDELayout.tsx        # 主 IDE 布局（面板组）
│   ├── FileExplorer.tsx     # 文件资源管理器
│   ├── EditorPanel.tsx      # Monaco 编辑器面板
│   ├── TerminalPanel.tsx    # Xterm.js 终端面板
│   └── ChatPanel.tsx        # AI 助手聊天面板
│
├── store/
│   └── useIDEStore.ts       # Zustand 全局状态管理
│
├── lib/
│   └── utils.ts             # 工具函数（cn）
│
└── public/                  # 静态资源
```

## 🎨 主题配置

### 赛博朋克/午夜主题
- **主背景**: `#09090b` (深黑色)
- **面板背景**: `#18181b` (稍浅黑色)
- **主色调**: 蓝色 `#3b82f6`
- **强调色**: 紫色 `#a855f7`
- **边框**: `#27272a` (暗灰色)

### 颜色系统
```css
--background: #09090b
--foreground: #e4e4e7 (几乎白色)
--primary: 蓝色 (217 91% 60%)
--accent: 紫色 (283 65% 58%)
--border: 暗灰 (240 5% 15%)
```

## 🔧 核心功能

### 1. 文件资源管理器 (`FileExplorer.tsx`)
- ✅ 树形结构展示
- ✅ 文件夹展开/折叠
- ✅ 文件选择高亮
- ✅ 图标显示（Lucide Icons）
- ✅ 嵌套缩进

### 2. Monaco 编辑器 (`EditorPanel.tsx`)
- ✅ 多标签页支持
- ✅ 语法高亮（Python, JS, TS, Markdown）
- ✅ vs-dark 主题
- ✅ 代码折叠
- ✅ 迷你地图
- ✅ 行号和标尺
- ✅ 标签页关闭按钮

### 3. 终端面板 (`TerminalPanel.tsx`)
- ✅ Xterm.js 集成
- ✅ 自适应终端大小
- ✅ 自定义主题
- ✅ 命令历史
- ✅ 支持的命令：
  - `help` - 显示帮助
  - `clear` - 清屏
  - `echo` - 输出文本
  - `ls` - 列出文件
  - `pwd` - 当前目录
  - `date` - 日期时间
  - `whoami` - 用户信息

### 4. AI 助手面板 (`ChatPanel.tsx`)
- ✅ 聊天界面
- ✅ 用户/AI 消息区分
- ✅ 时间戳
- ✅ 输入框（支持 Shift+Enter 换行）
- ✅ 发送按钮

### 5. 可调整大小的面板
- ✅ 水平调整（左侧栏 | 编辑器 | 右侧栏）
- ✅ 垂直调整（编辑器 | 终端）
- ✅ 面板最小/最大尺寸限制
- ✅ 拖动手柄悬停效果

## 📊 状态管理 (Zustand)

### 状态结构
```typescript
{
  // 文件系统
  fileTree: FileNode[]          // 虚拟文件树
  selectedFile: string | null   // 选中的文件
  
  // 编辑器
  tabs: EditorTab[]             // 打开的标签页
  activeTab: string | null      // 当前激活标签
  
  // 终端
  terminalOutput: TerminalOutput[]
  terminalHistory: string[]
  
  // UI 状态
  isTerminalVisible: boolean
  isChatVisible: boolean
}
```

### 主要操作
- `openFile(file)` - 打开文件到新标签
- `closeTab(tabId)` - 关闭标签页
- `updateTabContent()` - 更新编辑器内容
- `toggleTerminal()` - 切换终端显示
- `toggleChat()` - 切换聊天面板
- `toggleFolder()` - 展开/折叠文件夹

## 🎯 初始文件系统

项目包含演示文件：
```
src/
  ├── main.py (Fibonacci 示例)
  └── utils.py (工具函数)
tests/
  └── test_main.py
README.md
```

## 🚀 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000 查看 IDE

## 📦 主要依赖

- `next@^14.2.0` - Next.js 框架
- `react@^18.3.1` - React 库
- `@monaco-editor/react@^4.6.0` - Monaco 编辑器
- `@xterm/xterm@^5.5.0` - 终端模拟器
- `react-resizable-panels@^2.0.0` - 可调整面板
- `zustand@^4.4.7` - 状态管理
- `lucide-react@^0.292.0` - 图标库
- `tailwindcss@^3.4.1` - CSS 框架

## 🎨 样式特性

### 自定义滚动条
- 深色背景
- 悬停效果
- 圆角设计

### 标签页样式
- 激活状态高亮
- 悬停效果
- 关闭按钮淡入动画

### 文件树样式
- 选中高亮
- 悬停效果
- 平滑过渡

### 面板调整手柄
- 蓝色高亮
- 拖动时视觉反馈

## 🔮 扩展建议

1. **文件操作**: 添加创建、删除、重命名功能
2. **AI 集成**: 连接 OpenAI GPT 或 Claude API
3. **终端后端**: 集成真实的命令执行
4. **Git 集成**: 添加版本控制功能
5. **代码运行**: Python 代码执行功能
6. **多语言支持**: 添加更多编程语言
7. **搜索功能**: 全局搜索和替换
8. **设置面板**: 主题、字体、快捷键配置

---

✨ **享受使用 Codex IDE！**
