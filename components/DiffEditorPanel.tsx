"use client";

import { useEffect, useRef } from "react";
import { useIDEStore } from "@/store/useIDEStore";
import { DiffEditor } from "@monaco-editor/react";
import { Check, X, GitCompare } from "lucide-react";

export default function DiffEditorPanel() {
  const { diffView, acceptDiff, rejectDiff } = useIDEStore();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (diffView.isActive && editorRef.current) {
      // Focus on the editor when diff view becomes active
      editorRef.current.focus();
    }
  }, [diffView.isActive]);

  if (!diffView.isActive) {
    return null;
  }

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleAccept = () => {
    acceptDiff();
  };

  const handleReject = () => {
    rejectDiff();
  };

  return (
    <div className="h-full flex flex-col bg-[#09090b]">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#18181b] border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <GitCompare size={20} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">AI Fix - Diff View</h3>
            <p className="text-xs text-zinc-400">
              Review the changes and accept or reject the fix
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReject}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm font-medium"
            title="Reject changes and keep original code"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            title="Accept changes and apply to editor"
          >
            <Check size={16} />
            Accept Fix
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#18181b]/50 border-b border-zinc-800/50 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/30 border border-red-500/50 rounded" />
          <span className="text-zinc-400">Removed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/30 border border-green-500/50 rounded" />
          <span className="text-zinc-400">Added</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500/30 border border-blue-500/50 rounded" />
          <span className="text-zinc-400">Modified</span>
        </div>
        <div className="flex-1" />
        <span className="text-zinc-500">
          Left: Original | Right: AI Fixed
        </span>
      </div>

      {/* Diff Editor */}
      <div className="flex-1 relative">
        <DiffEditor
          height="100%"
          language={diffView.language}
          original={diffView.originalCode}
          modified={diffView.fixedCode}
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            renderSideBySide: true,
            enableSplitViewResizing: true,
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Courier New', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            renderWhitespace: "selection",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
            // Diff-specific options
            ignoreTrimWhitespace: false,
            renderIndicators: true,
            originalEditable: false,
            diffCodeLens: true,
            diffWordWrap: "on",
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span>Language: {diffView.language.toUpperCase()}</span>
          <span>•</span>
          <span>Read-only view</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Esc</kbd>
          <span>to close without applying</span>
        </div>
      </div>
    </div>
  );
}
