import { NextRequest, NextResponse } from "next/server";
import { generateText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minutes for complex debugging

interface FixCodeRequest {
  code: string;
  error: string;
  language?: string;
}

interface AgentLog {
  step: number;
  thought: string;
  action: string;
  result: string;
  timestamp: number;
}

interface FixCodeResponse {
  success: boolean;
  fixedCode?: string;
  logs: AgentLog[];
  attempts: number;
  error?: string;
}

/**
 * Execute Python code in E2B sandbox
 * Used as a tool for the AI agent
 */
async function executePythonCode(code: string): Promise<{
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
}> {
  const e2bApiKey = process.env.E2B_API_KEY;
  
  if (!e2bApiKey) {
    return {
      success: false,
      output: "",
      error: "E2B API key not configured",
      exitCode: 1,
    };
  }

  try {
    const sandbox = await Sandbox.create({
      apiKey: e2bApiKey,
      timeoutMs: 30000, // 30 seconds
    });

    try {
      // Execute code using runCode (E2B SDK v2 API)
      const execution = await sandbox.runCode(code);

      // Check for execution errors
      if (execution.error) {
        return {
          success: false,
          output: execution.logs.stdout.join("\n"),
          error: execution.error.value || execution.error.name || "Execution failed",
          exitCode: 1,
        };
      }

      // Collect outputs
      const stdout = execution.logs.stdout.join("\n");
      const stderr = execution.logs.stderr.join("\n");
      
      let results = "";
      if (execution.results.length > 0) {
        results = execution.results
          .map((result) => {
            if (result.text) return result.text;
            if (result.html) return result.html;
            if (result.data) return JSON.stringify(result.data);
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      const output = [stdout, results, stderr].filter(Boolean).join("\n");

      return {
        success: true,
        output: output || "Code executed successfully (no output)",
        exitCode: 0,
      };
    } finally {
      // Kill sandbox (SDK v2 method)
      await sandbox.kill();
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
      exitCode: 1,
    };
  }
}

/**
 * POST /api/agent/fix
 * Autonomous code fixing agent with ReAct loop
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const logs: AgentLog[] = [];
  let currentAttempt = 0;
  const MAX_ATTEMPTS = 3;

  try {
    // CRITICAL: Read provider and API key from headers (BYOK)
    const provider = request.headers.get("x-provider") as "openai" | "google" | null;
    const userApiKey = request.headers.get("x-api-key");

    // Strict validation: NO fallback to server env vars
    if (!userApiKey || !provider) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing API Key or Provider. Please configure in Settings.",
          logs: [],
          attempts: 0,
        } as FixCodeResponse,
        { status: 401 }
      );
    }

    // Parse request body
    const body: FixCodeRequest = await request.json();
    const { code, error: initialError, language = "python" } = body;

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Code is required.",
          logs: [],
          attempts: 0,
        } as FixCodeResponse,
        { status: 400 }
      );
    }

    // CRITICAL: Initialize AI provider with user's API key (BYOK)
    // Must explicitly pass apiKey during provider creation, NOT during model call
    let model;
    
    if (provider === "google") {
      // Create Google provider instance with explicit API key
      const google = createGoogleGenerativeAI({
        apiKey: userApiKey,  // CRITICAL: Pass user's key here!
      });
      // Use latest Gemini 2.5 Flash model (2026)
      model = google("gemini-2.5-flash");
    } else {
      // Create OpenAI provider instance with explicit API key
      const openai = createOpenAI({
        apiKey: userApiKey,  // CRITICAL: Pass user's key here!
      });
      model = openai("gpt-4o-mini");
    }

    console.log(`[Agent] Starting fix with ${provider} (user's API key) - attempt 1/${MAX_ATTEMPTS}`);

    // Add initial log
    logs.push({
      step: 0,
      thought: "Analyzing the error and original code",
      action: "Initial assessment",
      result: `Error: ${initialError}\nCode length: ${code.length} characters`,
      timestamp: Date.now(),
    });

    // Define the execute_python tool
    const executePythonTool = tool({
      description: "Execute Python code in a sandbox to verify if it works correctly. Returns exit code 0 if successful, 1 if there's an error.",
      parameters: z.object({
        code: z.string().describe("The Python code to execute"),
        reasoning: z.string().describe("Why you're testing this code"),
      }),
      execute: async ({ code: testCode, reasoning }) => {
        currentAttempt++;
        
        console.log(`[Agent] Executing attempt ${currentAttempt}: ${reasoning}`);
        
        logs.push({
          step: currentAttempt,
          thought: reasoning,
          action: "Executing Python code in sandbox",
          result: "Testing...",
          timestamp: Date.now(),
        });

        const result = await executePythonCode(testCode);
        
        const logResult = result.success
          ? `✓ Success! Output:\n${result.output}`
          : `✗ Error: ${result.error}\nOutput: ${result.output}`;

        // Update the last log with result
        logs[logs.length - 1].result = logResult;

        return {
          exitCode: result.exitCode,
          output: result.output,
          error: result.error || null,
        };
      },
    });

    // ReAct Loop: AI generates fixes and tests them
    let fixedCode = code;
    let lastError = initialError;
    let success = false;

    while (currentAttempt < MAX_ATTEMPTS && !success) {
      const prompt = currentAttempt === 0
        ? `You are an expert Python debugging agent. A user has code that's producing an error.

**Original Code:**
\`\`\`python
${code}
\`\`\`

**Error:**
${lastError}

**Your Task:**
1. Analyze the error carefully
2. Generate a fixed version of the code
3. Use the execute_python tool to test your fix
4. If the test passes (exit code 0), you're done
5. If it fails, analyze the new error and try again (max ${MAX_ATTEMPTS} attempts)

**Important:**
- Make minimal changes to fix the error
- Preserve the original logic as much as possible
- Add comments explaining your fixes
- Test your fix using the execute_python tool

Start by analyzing the error and proposing a fix.`
        : `The previous fix didn't work. Here's the new error:

**Latest Error:**
${lastError}

**Last Attempted Fix:**
\`\`\`python
${fixedCode}
\`\`\`

Analyze what went wrong and try a different approach. Use execute_python to test your new fix.`;

      const response = await generateText({
        model,
        tools: {
          execute_python: executePythonTool,
        },
        toolChoice: "auto",
        maxSteps: 5, // Allow multiple tool calls
        prompt,
        temperature: 0.3, // Lower temperature for more consistent fixes
      });

      console.log(`[Agent] AI Response:`, response.text);

      // Check if any tool calls succeeded
      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          if (toolCall.toolName === "execute_python" && toolCall.result) {
            const result = toolCall.result as any;
            
            if (result.exitCode === 0) {
              // Success!
              fixedCode = toolCall.args.code as string;
              success = true;
              
              logs.push({
                step: currentAttempt + 1,
                thought: "Fix successful!",
                action: "Final result",
                result: `✓ Code fixed and verified in ${currentAttempt} attempt(s)`,
                timestamp: Date.now(),
              });
              
              break;
            } else {
              // Failed, update error for next attempt
              lastError = result.error || "Unknown error";
              fixedCode = toolCall.args.code as string;
            }
          }
        }
      }

      // If we didn't find a successful execution, break
      if (!success && currentAttempt >= MAX_ATTEMPTS) {
        break;
      }
    }

    const totalTime = Date.now() - startTime;

    if (success) {
      console.log(`[Agent] Successfully fixed code in ${currentAttempt} attempts (${totalTime}ms)`);
      
      return NextResponse.json(
        {
          success: true,
          fixedCode,
          logs,
          attempts: currentAttempt,
        } as FixCodeResponse,
        { status: 200 }
      );
    } else {
      console.log(`[Agent] Failed to fix code after ${MAX_ATTEMPTS} attempts (${totalTime}ms)`);
      
      logs.push({
        step: currentAttempt + 1,
        thought: "Maximum attempts reached",
        action: "Giving up",
        result: `✗ Could not fix the code after ${MAX_ATTEMPTS} attempts. Last error: ${lastError}`,
        timestamp: Date.now(),
      });
      
      return NextResponse.json(
        {
          success: false,
          error: `Could not fix the code after ${MAX_ATTEMPTS} attempts. Last error: ${lastError}`,
          logs,
          attempts: currentAttempt,
          fixedCode, // Return the last attempt
        } as FixCodeResponse,
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[Agent] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        logs,
        attempts: currentAttempt,
      } as FixCodeResponse,
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
