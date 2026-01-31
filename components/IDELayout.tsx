"use client";

import { useState } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { useIDEStore } from "@/store/useIDEStore";
import FileExplorer from "./FileExplorer";
import EditorPanel from "./EditorPanel";
import TerminalPanel from "./TerminalPanel";
import ChatPanel from "./ChatPanel";
import SettingsDialog from "./SettingsDialog";
import ThinkingUI from "./ThinkingUI";
import { Toaster } from "@/components/ui/toaster";
import {
  Menu,
  Play,
  Save,
  Settings,
  GitBranch,
  Search,
  Terminal as TerminalIcon,
  MessageSquare,
  Code2,
} from "lucide-react";

export default function IDELayout() {
  const { isTerminalVisible, isChatVisible, toggleTerminal, toggleChat, setSettingsOpen, hasApiKey } =
    useIDEStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#09090b] text-zinc-100">
      {/* Top Menu Bar */}
      <div className="h-12 bg-[#18181b] border-b border-zinc-800 flex items-center px-4 gap-6">
        <div className="flex items-center gap-2">
          <Code2 size={24} className="text-blue-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Codex IDE
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 hover:bg-zinc-800 rounded text-sm transition-colors">
            File
          </button>
          <button className="px-3 py-1.5 hover:bg-zinc-800 rounded text-sm transition-colors">
            Edit
          </button>
          <button className="px-3 py-1.5 hover:bg-zinc-800 rounded text-sm transition-colors">
            View
          </button>
          <button className="px-3 py-1.5 hover:bg-zinc-800 rounded text-sm transition-colors">
            Run
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded transition-colors">
            <GitBranch size={18} />
          </button>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded transition-colors relative"
            title="Settings - Configure API Key"
          >
            <Settings size={18} />
            {!hasApiKey() && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Activity Bar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#18181b] border-r border-zinc-800 flex flex-col items-center py-4 gap-4">
          <button className="p-2 rounded hover:bg-zinc-800 transition-colors text-blue-500">
            <Menu size={20} />
          </button>
          <button className="p-2 rounded hover:bg-zinc-800 transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 rounded hover:bg-zinc-800 transition-colors">
            <GitBranch size={20} />
          </button>
          <button
            onClick={toggleTerminal}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              isTerminalVisible ? "text-blue-500" : ""
            }`}
          >
            <TerminalIcon size={20} />
          </button>
          <button
            onClick={toggleChat}
            className={`p-2 rounded hover:bg-zinc-800 transition-colors ${
              isChatVisible ? "text-purple-500" : ""
            }`}
          >
            <MessageSquare size={20} />
          </button>
          
          <div className="flex-1" />
          
          <button className="p-2 rounded hover:bg-zinc-800 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Main Panel Group */}
        <div className="flex-1 flex overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* File Explorer */}
            <Panel defaultSize={20} minSize={15} maxSize={35}>
              <FileExplorer />
            </Panel>

            <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-blue-600 transition-colors" />

            {/* Center: Editor + Terminal */}
            <Panel defaultSize={isChatVisible ? 55 : 80} minSize={30}>
              <PanelGroup direction="vertical">
                {/* Editor */}
                <Panel
                  defaultSize={isTerminalVisible ? 70 : 100}
                  minSize={30}
                >
                  <EditorPanel />
                </Panel>

                {/* Terminal */}
                {isTerminalVisible && (
                  <>
                    <PanelResizeHandle className="h-1 bg-zinc-800 hover:bg-blue-600 transition-colors" />
                    <Panel defaultSize={30} minSize={15} maxSize={50}>
                      <TerminalPanel />
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </Panel>

            {/* Chat Panel */}
            {isChatVisible && (
              <>
                <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-blue-600 transition-colors" />
                <Panel defaultSize={25} minSize={20} maxSize={40}>
                  <ChatPanel />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#18181b] border-t border-zinc-800 flex items-center px-4 text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Connected</span>
          </div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>Python</span>
          <span>Ln 1, Col 1</span>
        </div>
      </div>

      {/* Thinking UI Overlay */}
      <ThinkingUI />

      {/* Settings Dialog */}
      <SettingsDialog />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
