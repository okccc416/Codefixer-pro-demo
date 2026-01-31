import { NextRequest, NextResponse } from "next/server";
import { CodeInterpreter } from "@e2b/code-interpreter";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout

interface RunCodeRequest {
  code: string;
  language?: string;
}

interface RunCodeResponse {
  success: boolean;
  output?: string;
  error?: string;
  stdout?: string;
  stderr?: string;
  executionTime?: number;
}

/**
 * POST /api/sandbox/run
 * Execute Python code in E2B sandbox
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify API key from user's header
    const userApiKey = request.headers.get("x-user-api-key");
    if (!userApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "API key is required. Please configure your API key in Settings.",
        } as RunCodeResponse,
        { status: 401 }
      );
    }

    // Get E2B API key from environment
    const e2bApiKey = process.env.E2B_API_KEY;
    if (!e2bApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "E2B API key is not configured on the server. Please contact the administrator.",
        } as RunCodeResponse,
        { status: 500 }
      );
    }

    // Parse request body
    const body: RunCodeRequest = await request.json();
    const { code, language = "python" } = body;

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Code is required.",
        } as RunCodeResponse,
        { status: 400 }
      );
    }

    // Only support Python for now
    if (language !== "python") {
      return NextResponse.json(
        {
          success: false,
          error: `Language '${language}' is not supported. Only Python is supported currently.`,
        } as RunCodeResponse,
        { status: 400 }
      );
    }

    console.log(`[E2B] Executing Python code (${code.length} chars)...`);

    // Create E2B sandbox
    const sandbox = await CodeInterpreter.create({
      apiKey: e2bApiKey,
      timeoutMs: 50000, // 50 seconds
    });

    try {
      // Execute code in sandbox
      const execution = await sandbox.notebook.execCell(code, {
        onStderr: (stderr) => console.log("[E2B stderr]", stderr),
        onStdout: (stdout) => console.log("[E2B stdout]", stdout),
      });

      const executionTime = Date.now() - startTime;

      // Check for errors
      if (execution.error) {
        console.error("[E2B] Execution error:", execution.error);
        
        return NextResponse.json(
          {
            success: false,
            error: execution.error.value || execution.error.name || "Execution failed",
            stderr: execution.logs.stderr.join("\n"),
            stdout: execution.logs.stdout.join("\n"),
            executionTime,
          } as RunCodeResponse,
          { status: 200 } // Return 200 even for execution errors
        );
      }

      // Collect output
      const stdout = execution.logs.stdout.join("\n");
      const stderr = execution.logs.stderr.join("\n");
      
      // Get results (if any)
      let output = "";
      if (execution.results.length > 0) {
        output = execution.results
          .map((result) => {
            if (result.text) return result.text;
            if (result.html) return result.html;
            if (result.data) return JSON.stringify(result.data);
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      // Combine all outputs
      const finalOutput = [stdout, output, stderr]
        .filter(Boolean)
        .join("\n");

      console.log(`[E2B] Execution completed in ${executionTime}ms`);

      return NextResponse.json(
        {
          success: true,
          output: finalOutput || "Code executed successfully (no output)",
          stdout,
          stderr,
          executionTime,
        } as RunCodeResponse,
        { status: 200 }
      );
    } finally {
      // Always close the sandbox
      await sandbox.close();
      console.log("[E2B] Sandbox closed");
    }
  } catch (error) {
    console.error("[E2B] Error:", error);
    
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        executionTime,
      } as RunCodeResponse,
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
