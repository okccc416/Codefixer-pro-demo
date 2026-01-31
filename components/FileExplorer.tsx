"use client";

import { FileNode, useIDEStore } from "@/store/useIDEStore";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const { selectedFile, selectFile, openFile, toggleFolder } = useIDEStore();

  const handleClick = () => {
    if (node.type === "folder") {
      toggleFolder(node.id);
    } else {
      selectFile(node.id);
      openFile(node);
    }
  };

  const isSelected = selectedFile === node.id;

  return (
    <div>
      <div
        className={`tree-item ${isSelected ? "selected" : ""}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" && (
          <span className="flex-shrink-0">
            {node.isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        )}
        {node.type === "folder" ? (
          node.isExpanded ? (
            <FolderOpen size={16} className="text-blue-400" />
          ) : (
            <Folder size={16} className="text-blue-400" />
          )
        ) : (
          <File size={16} className="text-gray-400" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && node.isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const { fileTree } = useIDEStore();

  return (
    <div className="h-full flex flex-col bg-[#09090b] border-r border-zinc-800">
      <div className="panel-header">
        <Folder size={14} />
        <span>EXPLORER</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {fileTree.map((node) => (
          <FileTreeItem key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}
