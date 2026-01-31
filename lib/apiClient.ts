/**
 * API Client for Codex IDE
 * Handles all HTTP requests with API key authentication
 */

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  apiKey: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
  endpoint: string,
  config: ApiRequestConfig
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, apiKey } = config;

  // Validate API key
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: "API key is required. Please configure it in Settings.",
      statusCode: 401,
    };
  }

  try {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-user-api-key": apiKey, // BYOK header
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, requestOptions);
    const statusCode = response.status;

    // Handle different status codes
    if (!response.ok) {
      let errorMessage = `Request failed with status ${statusCode}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
        statusCode,
      };
    }

    // Parse response
    let data: T;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = (await response.text()) as any;
    }

    return {
      success: true,
      data,
      statusCode,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network request failed",
      statusCode: 0,
    };
  }
}

/**
 * Execute Python code via E2B Sandbox
 */
export async function executeCode(
  code: string,
  apiKey: string
): Promise<ApiResponse<{ output: string; error?: string; stdout?: string; stderr?: string; executionTime?: number }>> {
  return apiRequest("/api/sandbox/run", {
    method: "POST",
    apiKey,
    body: { code, language: "python" },
  });
}

/**
 * Fix code using AI Agent (ReAct Loop)
 */
export interface AgentLog {
  step: number;
  thought: string;
  action: string;
  result: string;
  timestamp: number;
}

export async function fixCodeWithAgent(
  code: string,
  error: string,
  apiKey: string
): Promise<ApiResponse<{ 
  fixedCode: string; 
  logs: AgentLog[];
  attempts: number;
}>> {
  return apiRequest("/api/agent/fix", {
    method: "POST",
    apiKey,
    body: { code, error, language: "python" },
  });
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(
  message: string,
  history: Array<{ role: string; content: string }>,
  apiKey: string,
  provider: "openai" | "anthropic"
): Promise<ApiResponse<{ response: string }>> {
  return apiRequest("/api/chat", {
    method: "POST",
    apiKey,
    body: { message, history, provider },
  });
}

/**
 * Analyze code
 */
export async function analyzeCode(
  code: string,
  apiKey: string,
  provider: "openai" | "anthropic"
): Promise<ApiResponse<{ analysis: string; suggestions: string[] }>> {
  return apiRequest("/api/analyze", {
    method: "POST",
    apiKey,
    body: { code, provider },
  });
}

/**
 * Generate code from prompt
 */
export async function generateCode(
  prompt: string,
  language: string,
  apiKey: string,
  provider: "openai" | "anthropic"
): Promise<ApiResponse<{ code: string; explanation: string }>> {
  return apiRequest("/api/generate", {
    method: "POST",
    apiKey,
    body: { prompt, language, provider },
  });
}
