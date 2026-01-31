# Codex IDE

A professional, VS Code-like IDE interface built with modern web technologies.

## 🚀 Features

- **📁 File Explorer**: Tree view with folder expansion/collapse
- **📝 Monaco Editor**: Full-featured code editor with syntax highlighting
- **💻 Integrated Terminal**: Xterm.js powered terminal with command support
- **💬 AI Assistant**: Chat panel for code assistance
- **🔑 BYOK Support**: Bring Your Own API Key (OpenAI/Anthropic)
- **🎨 Cyberpunk Theme**: Deep midnight theme with blue/purple accents
- **📊 Resizable Panels**: Drag to resize any panel
- **⌨️ Multi-Tab Support**: Open multiple files simultaneously

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Editor**: Monaco Editor
- **Terminal**: Xterm.js
- **Code Execution**: E2B Code Interpreter
- **UI Components**: Shadcn UI + Lucide Icons
- **Layout**: react-resizable-panels

## 📦 Installation

```bash
# Install dependencies
npm install

# Configure E2B API Key
cp .env.local.example .env.local
# Edit .env.local and add your E2B_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the IDE.

### Get E2B API Key
1. Visit [E2B Dashboard](https://e2b.dev/dashboard)
2. Sign up for a free account
3. Create an API key
4. Add it to `.env.local`

## 🎯 Usage

### BYOK - Bring Your Own Key 🔑
1. Click the **Settings** icon (⚙️) in the top-right corner
2. Select your API provider (OpenAI or Anthropic)
3. Enter your API key
4. Click **Save API Key**
5. Start using AI-powered features!

**Supported Features:**
- ▶️ **Run** - Execute Python code in E2B sandbox
- 🧠 **AI Fix** - Autonomous debugging with Diff Editor
- 🔀 **Diff View** - Side-by-side code comparison
- ✨ **Thinking UI** - Real-time agent progress display
- 💬 **Chat** - AI assistant conversations

📖 **Detailed Guides**: 
- [BYOK_GUIDE.md](./BYOK_GUIDE.md) - API Key configuration
- [E2B_INTEGRATION.md](./E2B_INTEGRATION.md) - Code execution setup
- [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) - Autonomous debugging agent
- [DIFF_UI_GUIDE.md](./DIFF_UI_GUIDE.md) - Diff Editor and Thinking UI

### File Explorer
- Click on files to open them in the editor
- Click on folders to expand/collapse
- Multiple files can be opened in tabs

### Editor
- Full Monaco Editor with syntax highlighting
- Supports Python, JavaScript, TypeScript, Markdown, and more
- Line numbers, minimap, and code folding
- Code action bar with Run, Fix, and Analyze buttons

### Terminal
- Type commands and press Enter
- Supported commands: `help`, `clear`, `echo`, `ls`, `pwd`, `date`, `whoami`
- View execution results from code runs

### AI Assistant
- Configure your API key in Settings
- Ask questions about your code
- Get coding suggestions and help
- Powered by OpenAI GPT or Anthropic Claude

## 🎨 Theme

The IDE uses a deep cyberpunk/midnight theme:
- Background: `#09090b`
- Primary: Blue (`#3b82f6`)
- Accent: Purple (`#a855f7`)
- Dark UI elements with high contrast

## 🔧 Configuration

Edit `store/useIDEStore.ts` to customize:
- Initial file tree structure
- Default file contents
- Terminal behavior
- UI state defaults

## 📚 Documentation

- **[BYOK_GUIDE.md](./BYOK_GUIDE.md)** - Complete BYOK usage guide
- **[E2B_INTEGRATION.md](./E2B_INTEGRATION.md)** - E2B sandbox integration guide
- **[AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)** - Autonomous debugging agent guide
- **[DIFF_UI_GUIDE.md](./DIFF_UI_GUIDE.md)** - Diff Editor and Thinking UI guide
- **[BYOK_DEMO.md](./BYOK_DEMO.md)** - Quick demo walkthrough
- **[BYOK_IMPLEMENTATION.md](./BYOK_IMPLEMENTATION.md)** - Technical implementation details
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code architecture
- **[QUICK_START.md](./QUICK_START.md)** - Getting started guide

## 🔐 Security

Your API keys are:
- ✅ Stored only in your browser's localStorage
- ✅ Never sent to our servers
- ✅ Passed directly to OpenAI/Anthropic APIs
- ✅ Encrypted in transit (HTTPS)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Built with ❤️ using Next.js 14 and modern React

**Latest Updates:**
- **v1.4:** 🎨 Diff Editor + Thinking UI - Beautiful UX for AI fixes!
- **v1.3:** 🤖 AI Agent - Autonomous debugging with ReAct loop!
- **v1.2:** 🚀 E2B Code Interpreter - Real Python execution!
- **v1.1:** 🔑 BYOK (Bring Your Own Key) support
