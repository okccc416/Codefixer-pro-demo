"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useIDEStore } from "@/store/useIDEStore";
import { TerminalSquare, X } from "lucide-react";
import "@xterm/xterm/css/xterm.css";

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastOutputIndexRef = useRef<number>(0);
  
  // ✅ CRITICAL FIX: Subscribe to terminalOutput from Zustand
  const { addTerminalOutput, toggleTerminal, terminalOutput } = useIDEStore();

  useEffect(() => {
    console.log("[TerminalPanel] useEffect triggered");
    console.log("[TerminalPanel] terminalRef.current:", terminalRef.current);
    console.log("[TerminalPanel] xtermRef.current:", xtermRef.current);
    
    if (!terminalRef.current) {
      console.error("[TerminalPanel] terminalRef.current is null!");
      return;
    }
    
    if (xtermRef.current) {
      console.log("[TerminalPanel] xterm already initialized, skipping");
      return;
    }

    console.log("[TerminalPanel] Initializing xterm...");

    // Initialize xterm.js with ANSI support
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'Cascadia Code', 'Courier New', monospace",
      theme: {
        background: "#09090b",
        foreground: "#e4e4e7",
        cursor: "#3b82f6",
        black: "#09090b",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#06b6d4",
        white: "#e4e4e7",
        brightBlack: "#52525b",
        brightRed: "#f87171",
        brightGreen: "#4ade80",
        brightYellow: "#fbbf24",
        brightBlue: "#60a5fa",
        brightMagenta: "#c084fc",
        brightCyan: "#22d3ee",
        brightWhite: "#fafafa",
      },
      cols: 80,
      rows: 24,
      // Enable ANSI color support
      allowProposedApi: true,
      convertEol: true,
    });

    console.log("[TerminalPanel] Terminal instance created");

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    console.log("[TerminalPanel] FitAddon loaded");

    try {
      console.log("[TerminalPanel] Container HTML before open:", terminalRef.current.innerHTML);
      console.log("[TerminalPanel] Container in DOM:", document.body.contains(terminalRef.current));
      console.log("[TerminalPanel] Opening terminal...");
      
      // CRITICAL: Ensure terminal opens synchronously
      terminal.open(terminalRef.current);
      
      console.log("[TerminalPanel] Terminal.open() completed");
      console.log("[TerminalPanel] Container HTML after open:", terminalRef.current.innerHTML);
      console.log("[TerminalPanel] Container children:", terminalRef.current.children.length);
      
      // Inspect what xterm created
      Array.from(terminalRef.current.children).forEach((child, i) => {
        console.log(`[TerminalPanel] Child ${i}:`, child.className, child.tagName);
      });
      
      // Check if elements were created immediately
      let canvas = terminalRef.current.querySelector('canvas');
      console.log("[TerminalPanel] Canvas found (immediate):", !!canvas);
      
      // Wait a bit for xterm to create DOM elements (might be async)
      setTimeout(() => {
        canvas = terminalRef.current?.querySelector('canvas');
        console.log("[TerminalPanel] Canvas found (delayed):", !!canvas);
        console.log("[TerminalPanel] Canvas dimensions:", canvas?.width, "x", canvas?.height);
        
        // Check what elements were actually created
        const xtermElements = terminalRef.current?.querySelectorAll('*');
        console.log("[TerminalPanel] Total elements created:", xtermElements?.length);
        console.log("[TerminalPanel] xterm element:", terminalRef.current?.querySelector('.xterm'));
        console.log("[TerminalPanel] xterm-screen:", terminalRef.current?.querySelector('.xterm-screen'));
        
        // Log innerHTML to see actual structure
        console.log("[TerminalPanel] Container innerHTML:", terminalRef.current?.innerHTML.substring(0, 200));
      }, 100);
    } catch (error) {
      console.error("[TerminalPanel] Error opening terminal:", error);
      return;
    }
    
    // CRITICAL FIX: Force terminal to be visible and properly sized
    console.log("[TerminalPanel] Setting initial size...");
    
    // Step 1: Set initial size explicitly
    terminal.resize(80, 24);
    console.log("[TerminalPanel] Initial resize to 80x24");
    
    // Step 2: Fit after DOM is ready
    setTimeout(() => {
      try {
        console.log("[TerminalPanel] Attempting fit...");
        fitAddon.fit();
        console.log("[TerminalPanel] Fit completed, rows:", terminal.rows, "cols:", terminal.cols);
        
        // Step 3: Force refresh
        terminal.refresh(0, terminal.rows - 1);
        console.log("[TerminalPanel] Terminal refreshed");
      } catch (error) {
        console.error("[TerminalPanel] Fit error:", error);
      }
    }, 200);

    // Welcome message
    console.log("[TerminalPanel] Writing welcome message...");
    terminal.writeln("\x1b[1;36m╔═══════════════════════════════════════════╗\x1b[0m");
    terminal.writeln("\x1b[1;36m║     Welcome to Codex IDE Terminal        ║\x1b[0m");
    terminal.writeln("\x1b[1;36m╚═══════════════════════════════════════════╝\x1b[0m");
    terminal.writeln("");
    terminal.writeln("\x1b[1;32mSystem ready.\x1b[0m Type commands below:");
    terminal.write("\r\n$ ");
    
    console.log("[TerminalPanel] Welcome message written");

    let currentLine = "";

    // Handle user input
    terminal.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter key
      if (code === 13) {
        terminal.write("\r\n");
        
        if (currentLine.trim()) {
          // Simulate command execution
          handleCommand(terminal, currentLine.trim());
          addTerminalOutput(`$ ${currentLine}\n`);
        }
        
        currentLine = "";
        terminal.write("$ ");
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          terminal.write("\b \b");
        }
      }
      // Handle regular characters
      else if (code >= 32) {
        currentLine += data;
        terminal.write(data);
      }
    });

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Handle resize
    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (error) {
        console.error("[TerminalPanel] Fit error:", error);
      }
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(handleResize, 50); // Debounce resize
    });
    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      console.log("[TerminalPanel] Cleanup function called");
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      
      // CRITICAL: Don't dispose if container is still in DOM
      if (terminalRef.current && document.body.contains(terminalRef.current)) {
        console.log("[TerminalPanel] Container still in DOM, NOT disposing");
        // Don't dispose - let it persist
      } else {
        console.log("[TerminalPanel] Container removed, disposing terminal");
        terminal.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  // ✅ CRITICAL FIX: Listen to terminalOutput changes and write to xterm
  useEffect(() => {
    if (!xtermRef.current) {
      console.log("[TerminalPanel] xterm not ready yet");
      return;
    }
    
    const terminal = xtermRef.current;
    
    // CRITICAL: Check if terminal is still attached to DOM
    if (!terminalRef.current || !document.body.contains(terminalRef.current)) {
      console.error("[TerminalPanel] Terminal container not in DOM!");
      return;
    }
    
    // Check if xterm element exists in container
    const xtermElement = terminalRef.current.querySelector('.xterm');
    if (!xtermElement) {
      console.error("[TerminalPanel] xterm element missing, reinitializing...");
      // Force re-open
      try {
        terminal.open(terminalRef.current);
        console.log("[TerminalPanel] Terminal re-opened");
      } catch (error) {
        console.error("[TerminalPanel] Failed to re-open:", error);
      }
    }
    
    console.log("[TerminalPanel] terminalOutput changed:", terminalOutput.length, "items", 
                "lastIndex:", lastOutputIndexRef.current);
    
    // Write new outputs to terminal
    for (let i = lastOutputIndexRef.current; i < terminalOutput.length; i++) {
      const output = terminalOutput[i];
      
      console.log("[TerminalPanel] Writing output", i, ":", 
                  output.content.substring(0, 50).replace(/\n/g, '\\n'));
      
      // Skip the initial welcome message (already written during initialization)
      if (i === 0 && output.content.includes("Welcome to Codex IDE")) {
        console.log("[TerminalPanel] Skipping welcome message (already written)");
        continue;
      }
      
      try {
        terminal.write(output.content);
        
        // CRITICAL: Force refresh after each write
        terminal.refresh(0, terminal.rows - 1);
        
        console.log("[TerminalPanel] Successfully wrote output", i, 
                    "rows:", terminal.rows, "cols:", terminal.cols);
      } catch (error) {
        console.error("[TerminalPanel] Error writing output", i, ":", error);
      }
    }
    
    // Update last processed index
    lastOutputIndexRef.current = terminalOutput.length;
    console.log("[TerminalPanel] Updated lastIndex to:", lastOutputIndexRef.current);
  }, [terminalOutput]); // Re-run when terminalOutput changes

  const handleCommand = (terminal: Terminal, command: string) => {
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case "help":
        terminal.writeln("\x1b[1;33mAvailable commands:\x1b[0m");
        terminal.writeln("  help     - Show this help message");
        terminal.writeln("  clear    - Clear terminal");
        terminal.writeln("  echo     - Print text");
        terminal.writeln("  ls       - List files");
        terminal.writeln("  pwd      - Print working directory");
        terminal.writeln("  date     - Show current date and time");
        terminal.writeln("  whoami   - Display current user");
        break;

      case "clear":
        terminal.clear();
        break;

      case "echo":
        terminal.writeln(parts.slice(1).join(" "));
        break;

      case "ls":
        terminal.writeln("\x1b[1;34msrc/\x1b[0m");
        terminal.writeln("\x1b[1;34mtests/\x1b[0m");
        terminal.writeln("README.md");
        break;

      case "pwd":
        terminal.writeln("/workspace/codex-ide");
        break;

      case "date":
        terminal.writeln(new Date().toString());
        break;

      case "whoami":
        terminal.writeln("codex-user");
        break;

      case "python":
        terminal.writeln("\x1b[1;32mPython 3.11.0\x1b[0m");
        terminal.writeln("Type 'exit()' to exit");
        terminal.writeln(">>> ");
        break;

      default:
        terminal.writeln(
          `\x1b[1;31mCommand not found: ${cmd}\x1b[0m. Type 'help' for available commands.`
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#09090b] border-t border-zinc-800">
      <div className="panel-header justify-between">
        <div className="flex items-center gap-2">
          <TerminalSquare size={14} />
          <span>TERMINAL</span>
        </div>
        <button
          onClick={toggleTerminal}
          className="hover:bg-zinc-700 rounded p-1 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div 
        ref={terminalRef} 
        className="flex-1 overflow-hidden"
        style={{ 
          minHeight: '200px',
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'relative'
        }}
      />
    </div>
  );
}
