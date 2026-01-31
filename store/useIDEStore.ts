import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  isExpanded?: boolean;
}

export interface EditorTab {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface TerminalOutput {
  id: string;
  content: string;
  timestamp: number;
}

export type AgentStep = "idle" | "analyzing" | "verifying" | "self-correcting" | "done";

export interface DiffViewState {
  isActive: boolean;
  originalCode: string;
  fixedCode: string;
  language: string;
  tabId: string;
}

interface IDEState {
  // File System
  fileTree: FileNode[];
  selectedFile: string | null;
  
  // Editor
  tabs: EditorTab[];
  activeTab: string | null;
  
  // Diff View
  diffView: DiffViewState;
  
  // Agent State
  agentStep: AgentStep;
  
  // Terminal
  terminalOutput: TerminalOutput[];
  terminalHistory: string[];
  
  // UI State
  isTerminalVisible: boolean;
  isChatVisible: boolean;
  isSettingsOpen: boolean;
  
  // API Key Management
  apiKey: string;
  apiProvider: "openai" | "anthropic";
  
  // Actions
  setFileTree: (tree: FileNode[]) => void;
  selectFile: (fileId: string) => void;
  openFile: (file: FileNode) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  toggleTerminal: () => void;
  toggleChat: () => void;
  addTerminalOutput: (output: string) => void;
  clearTerminal: () => void;
  toggleFolder: (folderId: string) => void;
  
  // Settings Actions
  setSettingsOpen: (open: boolean) => void;
  setApiKey: (key: string) => void;
  setApiProvider: (provider: "openai" | "anthropic") => void;
  hasApiKey: () => boolean;
  
  // Diff View Actions
  showDiffView: (originalCode: string, fixedCode: string, language: string, tabId: string) => void;
  acceptDiff: () => void;
  rejectDiff: () => void;
  
  // Agent Actions
  setAgentStep: (step: AgentStep) => void;
}

// Initialize with demo file system
const initialFileTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "2",
        name: "main.py",
        type: "file",
        content: `# Welcome to Codex IDE
import sys

def main():
    print("Hello from Codex IDE!")
    print("This is a professional VS Code-like interface")
    
    # Example: Calculate fibonacci
    def fibonacci(n):
        if n <= 1:
            return n
        return fibonacci(n-1) + fibonacci(n-2)
    
    for i in range(10):
        print(f"Fibonacci({i}) = {fibonacci(i)}")

if __name__ == "__main__":
    main()
`,
      },
      {
        id: "3",
        name: "utils.py",
        type: "file",
        content: `# Utility functions
def format_output(data):
    """Format data for terminal output"""
    return str(data)

def validate_input(value):
    """Validate user input"""
    return value is not None
`,
      },
    ],
  },
  {
    id: "4",
    name: "tests",
    type: "folder",
    isExpanded: false,
    children: [
      {
        id: "5",
        name: "test_main.py",
        type: "file",
        content: `import unittest

class TestMain(unittest.TestCase):
    def test_example(self):
        self.assertTrue(True)
`,
      },
    ],
  },
  {
    id: "6",
    name: "README.md",
    type: "file",
    content: `# Codex IDE

A professional, VS Code-like IDE interface built with:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Monaco Editor
- Xterm.js

## Features
- 📁 File Explorer with tree view
- 📝 Monaco Editor with syntax highlighting
- 💻 Integrated terminal
- 💬 Chat/Agent panel
- 🎨 Cyberpunk/Midnight theme

Enjoy coding!
`,
  },
];

export const useIDEStore = create<IDEState>()(
  persist(
    (set, get) => ({
      // Initial State
      fileTree: initialFileTree,
      selectedFile: null,
      tabs: [],
      activeTab: null,
      
      // Diff View
      diffView: {
        isActive: false,
        originalCode: "",
        fixedCode: "",
        language: "python",
        tabId: "",
      },
      
      // Agent State
      agentStep: "idle",
      
      terminalOutput: [
        {
          id: "1",
          content: "Welcome to Codex IDE Terminal\n$ ",
          timestamp: Date.now(),
        },
      ],
      terminalHistory: [],
      isTerminalVisible: true,
      isChatVisible: true,
      isSettingsOpen: false,
      
      // API Key State
      apiKey: "",
      apiProvider: "openai",

  // File System Actions
  setFileTree: (tree) => set({ fileTree: tree }),
  
  selectFile: (fileId) => set({ selectedFile: fileId }),
  
  openFile: (file) =>
    set((state) => {
      if (file.type !== "file") return state;

      const existingTab = state.tabs.find((tab) => tab.id === file.id);
      if (existingTab) {
        return { activeTab: existingTab.id };
      }

      const newTab: EditorTab = {
        id: file.id,
        name: file.name,
        content: file.content || "",
        language: file.name.endsWith(".py")
          ? "python"
          : file.name.endsWith(".md")
          ? "markdown"
          : file.name.endsWith(".ts") || file.name.endsWith(".tsx")
          ? "typescript"
          : file.name.endsWith(".js") || file.name.endsWith(".jsx")
          ? "javascript"
          : "plaintext",
        path: file.name,
      };

      return {
        tabs: [...state.tabs, newTab],
        activeTab: newTab.id,
        selectedFile: file.id,
      };
    }),

  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== tabId);
      let newActiveTab = state.activeTab;

      if (state.activeTab === tabId) {
        newActiveTab = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
      }

      return {
        tabs: newTabs,
        activeTab: newActiveTab,
      };
    }),

  setActiveTab: (tabId) => set({ activeTab: tabId }),

  updateTabContent: (tabId, content) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, content } : tab
      ),
    })),

  // UI Actions
  toggleTerminal: () =>
    set((state) => ({ isTerminalVisible: !state.isTerminalVisible })),

  toggleChat: () =>
    set((state) => ({ isChatVisible: !state.isChatVisible })),

  // Terminal Actions
  addTerminalOutput: (output) =>
    set((state) => ({
      terminalOutput: [
        ...state.terminalOutput,
        {
          id: Date.now().toString(),
          content: output,
          timestamp: Date.now(),
        },
      ],
    })),

  clearTerminal: () =>
    set({
      terminalOutput: [
        {
          id: "1",
          content: "$ ",
          timestamp: Date.now(),
        },
      ],
    }),

  toggleFolder: (folderId) =>
    set((state) => {
      const toggleNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === folderId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children) {
            return { ...node, children: toggleNode(node.children) };
          }
          return node;
        });
      };

      return { fileTree: toggleNode(state.fileTree) };
    }),
  
  // Settings Actions
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  
  setApiKey: (key) => set({ apiKey: key }),
  
  setApiProvider: (provider) => set({ apiProvider: provider }),
  
  hasApiKey: () => {
    const state = get();
    return state.apiKey.trim().length > 0;
  },
  
  // Diff View Actions
  showDiffView: (originalCode, fixedCode, language, tabId) =>
    set({
      diffView: {
        isActive: true,
        originalCode,
        fixedCode,
        language,
        tabId,
      },
    }),
  acceptDiff: () => {
    const state = get();
    if (state.diffView.isActive && state.diffView.tabId) {
      // Update the tab content with fixed code
      state.updateTabContent(state.diffView.tabId, state.diffView.fixedCode);
      // Close diff view
      set({
        diffView: {
          isActive: false,
          originalCode: "",
          fixedCode: "",
          language: "python",
          tabId: "",
        },
      });
    }
  },
  rejectDiff: () =>
    set({
      diffView: {
        isActive: false,
        originalCode: "",
        fixedCode: "",
        language: "python",
        tabId: "",
      },
    }),
  
  // Agent Actions
  setAgentStep: (step) => set({ agentStep: step }),
    }),
    {
      name: "codex-ide-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        apiProvider: state.apiProvider,
      }),
    }
  )
);
