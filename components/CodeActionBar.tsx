"use client";

import { useState } from "react";
import { useIDEStore } from "@/store/useIDEStore";
import { useApiKeyValidation } from "@/hooks/useApiKeyValidation";
import { useToast } from "@/hooks/use-toast";
import { executeCode, fixCodeWithAgent, analyzeCode, AgentLog } from "@/lib/apiClient";
import { Play, Wrench, Sparkles, Loader2, Brain } from "lucide-react";

interface CodeActionBarProps {
  code: string;
  language: string;
}

export default function CodeActionBar({ code, language }: CodeActionBarProps) {
  const { 
    apiProvider, 
    addTerminalOutput, 
    updateTabContent, 
    activeTab,
    setAgentStep,
    showDiffView,
    tabs,
  } = useIDEStore();
  const { validateApiKey, getApiKey } = useApiKeyValidation();
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fixLogs, setFixLogs] = useState<AgentLog[]>([]);

  const handleExecute = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    if (!validateApiKey("code execution")) {
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) return;

    setIsExecuting(true);
    
    // Clear terminal and show execution start
    addTerminalOutput(`\n\x1b[1;36m╔════════════════════════════════════════╗\x1b[0m\n`);
    addTerminalOutput(`\x1b[1;36m║  Executing Python Code via E2B...    ║\x1b[0m\n`);
    addTerminalOutput(`\x1b[1;36m╚════════════════════════════════════════╝\x1b[0m\n\n`);

    try {
      const response = await executeCode(code, apiKey);

      if (response.success && response.data) {
        // Show execution time
        const execTime = response.data.executionTime 
          ? `(${response.data.executionTime}ms)` 
          : "";
        
        addTerminalOutput(`\x1b[1;32m✓ Execution completed ${execTime}\x1b[0m\n\n`);
        
        // Show output
        if (response.data.output) {
          addTerminalOutput(`\x1b[1;37mOutput:\x1b[0m\n`);
          addTerminalOutput(`${response.data.output}\n`);
        }
        
        // Show stderr if exists (but not error)
        if (response.data.stderr && response.data.stderr.trim()) {
          addTerminalOutput(`\n\x1b[1;33mWarnings/Info:\x1b[0m\n`);
          addTerminalOutput(`${response.data.stderr}\n`);
        }
        
        addTerminalOutput(`\n$ `);
        
        toast({
          title: "✓ Code Executed",
          description: `Successfully executed in ${response.data.executionTime || 0}ms`,
        });
      } else {
        // Execution failed
        addTerminalOutput(`\x1b[1;31m✗ Execution failed\x1b[0m\n\n`);
        
        if (response.error) {
          addTerminalOutput(`\x1b[1;31mError:\x1b[0m\n${response.error}\n`);
        }
        
        addTerminalOutput(`\n$ `);
        
        toast({
          title: "Execution Failed",
          description: response.error || "Failed to execute code",
          variant: "destructive",
        });
      }
    } catch (error) {
      addTerminalOutput(`\x1b[1;31m✗ Request failed\x1b[0m\n\n`);
      addTerminalOutput(
        `${error instanceof Error ? error.message : "Unknown error"}\n\n$ `
      );
      
      toast({
        title: "Request Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleFix = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    if (!validateApiKey("AI code fixing")) {
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) return;

    // Get current tab info
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (!currentTab) return;

    setIsFixing(true);
    setFixLogs([]);
    
    // Start agent thinking UI
    setAgentStep("analyzing");
    
    // Show agent starting in terminal
    addTerminalOutput(`\n\x1b[1;35m╔════════════════════════════════════════╗\x1b[0m\n`);
    addTerminalOutput(`\x1b[1;35m║  AI Agent: Autonomous Code Fixing     ║\x1b[0m\n`);
    addTerminalOutput(`\x1b[1;35m╚════════════════════════════════════════╝\x1b[0m\n\n`);
    addTerminalOutput(`\x1b[1;36m🤖 Agent started...\x1b[0m\n\n`);

    try {
      // First, try to execute the code to get the error
      addTerminalOutput(`\x1b[1;33m[Step 1] Executing original code to identify errors...\x1b[0m\n`);
      
      const executeResponse = await executeCode(code, apiKey);
      
      let errorMessage = "";
      if (!executeResponse.success || (executeResponse.data && executeResponse.data.error)) {
        errorMessage = executeResponse.error || executeResponse.data?.error || "Unknown error";
        addTerminalOutput(`\x1b[1;31m✗ Error found:\x1b[0m ${errorMessage}\n\n`);
      } else {
        addTerminalOutput(`\x1b[1;32m✓ Code executed successfully. No errors to fix.\x1b[0m\n\n$ `);
        toast({
          title: "No Errors Found",
          description: "The code executed successfully. Nothing to fix!",
        });
        setIsFixing(false);
        setAgentStep("idle");
        return;
      }

      // Update to verifying step
      setAgentStep("verifying");
      
      // Now call the AI Agent to fix it
      addTerminalOutput(`\x1b[1;33m[Step 2] Starting AI Agent to fix the code...\x1b[0m\n\n`);
      
      const response = await fixCodeWithAgent(code, errorMessage, apiKey);

      if (response.success && response.data) {
        const { fixedCode, logs, attempts } = response.data;
        
        setFixLogs(logs);
        
        // Update to self-correcting step
        setAgentStep("self-correcting");
        
        // Show agent logs in terminal
        logs.forEach((log, index) => {
          addTerminalOutput(`\x1b[1;36m[Attempt ${log.step}]\x1b[0m\n`);
          addTerminalOutput(`💭 Thought: ${log.thought}\n`);
          addTerminalOutput(`⚡ Action: ${log.action}\n`);
          addTerminalOutput(`📊 Result: ${log.result}\n\n`);
        });
        
        // Update to done step
        setAgentStep("done");
        
        // Show diff view instead of auto-applying
        if (fixedCode && fixedCode !== code) {
          addTerminalOutput(`\x1b[1;32m✓ Code fixed! Opening Diff Editor...\x1b[0m\n`);
          addTerminalOutput(`\x1b[1;32m✓ Fixed in ${attempts} attempt(s)\x1b[0m\n\n$ `);
          
          // Wait a moment for user to see "Done"
          setTimeout(() => {
            showDiffView(code, fixedCode, currentTab.language, currentTab.id);
            setAgentStep("idle");
          }, 1500);
          
          toast({
            title: "🎉 Code Fixed!",
            description: `Review the changes in Diff Editor (${attempts} attempt${attempts > 1 ? 's' : ''})`,
          });
        } else {
          addTerminalOutput(`\x1b[1;33m⚠ No changes were made\x1b[0m\n\n$ `);
          setAgentStep("idle");
          toast({
            title: "No Changes",
            description: "The AI didn't make any changes to the code",
          });
        }
      } else {
        addTerminalOutput(`\x1b[1;31m✗ Agent failed to fix the code\x1b[0m\n`);
        addTerminalOutput(`Error: ${response.error}\n\n$ `);
        
        setAgentStep("idle");
        
        toast({
          title: "Fix Failed",
          description: response.error || "AI Agent couldn't fix the code",
          variant: "destructive",
        });
      }
    } catch (error) {
      addTerminalOutput(`\x1b[1;31m✗ Request failed\x1b[0m\n`);
      addTerminalOutput(`${error instanceof Error ? error.message : "Unknown error"}\n\n$ `);
      
      setAgentStep("idle");
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    if (!validateApiKey("code analysis")) {
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) return;

    setIsAnalyzing(true);

    try {
      const response = await analyzeCode(code, apiKey, apiProvider);

      if (response.success && response.data) {
        toast({
          title: "Analysis Complete",
          description: response.data.analysis,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: response.error || "Failed to analyze code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border-b border-zinc-800">
      <button
        onClick={handleExecute}
        disabled={isExecuting || !code.trim()}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
        title="Run Code (requires API key)"
      >
        {isExecuting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Play size={16} />
        )}
        <span>Run</span>
      </button>

      <button
        onClick={handleFix}
        disabled={isFixing || !code.trim()}
        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
        title="AI Agent: Autonomous Code Fixing (requires API key)"
      >
        {isFixing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Brain size={16} />
        )}
        <span>AI Fix</span>
      </button>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !code.trim()}
        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
        title="Analyze Code (requires API key)"
      >
        {isAnalyzing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        <span>Analyze</span>
      </button>

      <div className="flex-1" />

      <span className="text-xs text-zinc-500">
        {language === "python" ? "Python" : language.toUpperCase()}
      </span>
    </div>
  );
}
