"use client";

import { useEffect } from "react";
import { useIDEStore } from "@/store/useIDEStore";
import { X, File } from "lucide-react";
import Editor from "@monaco-editor/react";
import CodeActionBar from "./CodeActionBar";
import DiffEditorPanel from "./DiffEditorPanel";

export default function EditorPanel() {
  const { tabs, activeTab, closeTab, setActiveTab, updateTabContent, diffView, rejectDiff } =
    useIDEStore();

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      updateTabContent(activeTab, value);
    }
  };

  // Handle Esc key to close diff view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && diffView.isActive) {
        rejectDiff();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [diffView.isActive, rejectDiff]);

  // Show Diff Editor if active
  if (diffView.isActive) {
    return <DiffEditorPanel />;
  }

  return (
    <div className="h-full flex flex-col bg-[#09090b]">
      {/* Tab Bar */}
      {tabs.length > 0 && (
        <div className="tab-bar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${tab.id === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <File size={14} />
              <span>{tab.name}</span>
              <button
                className="tab-close hover:bg-zinc-700 rounded p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Code Action Bar */}
      {currentTab && (
        <CodeActionBar code={currentTab.content} language={currentTab.language} />
      )}

      {/* Editor Area */}
      <div className="flex-1 relative">
        {currentTab ? (
          <Editor
            height="100%"
            language={currentTab.language}
            value={currentTab.content}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: "on",
              rulers: [80, 120],
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: "selection",
              tabSize: 4,
              insertSpaces: true,
              folding: true,
              glyphMargin: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              padding: { top: 16 },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <File size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No file opened</p>
              <p className="text-sm mt-2">Select a file from the explorer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
