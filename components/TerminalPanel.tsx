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
  const { addTerminalOutput, toggleTerminal } = useIDEStore();

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

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

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);
    fitAddon.fit();

    // Welcome message
    terminal.writeln("\x1b[1;36m╔═══════════════════════════════════════════╗\x1b[0m");
    terminal.writeln("\x1b[1;36m║     Welcome to Codex IDE Terminal        ║\x1b[0m");
    terminal.writeln("\x1b[1;36m╚═══════════════════════════════════════════╝\x1b[0m");
    terminal.writeln("");
    terminal.writeln("\x1b[1;32mSystem ready.\x1b[0m Type commands below:");
    terminal.write("\r\n$ ");

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
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      terminal.dispose();
    };
  }, [addTerminalOutput]);

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
      <div ref={terminalRef} className="flex-1 overflow-hidden" />
    </div>
  );
}
