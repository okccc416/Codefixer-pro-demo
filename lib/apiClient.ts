/**
 * API Client for Codex IDE
 * Handles all HTTP requests with API key authentication
 */

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  apiKey: string;
  provider: "openai" | "google";
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
  const { method = "GET", headers = {}, body, apiKey, provider } = config;

  // Validate API key and provider
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error: "API key is required. Please configure it in Settings.",
      statusCode: 401,
    };
  }

  if (!provider) {
    return {
      success: false,
      error: "Provider is required. Please configure it in Settings.",
      statusCode: 401,
    };
  }

  try {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,        // BYOK: User's API key
      "x-provider": provider,     // BYOK: User's chosen provider
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
      
      // Clone response FIRST to avoid "Body stream already read" error
      const responseClone = response.clone();
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, try text (using the clone)
        try {
          const text = await responseClone.text();
          errorMessage = text || errorMessage;
        } catch {
          // If both fail, use default message
        }
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
  apiKey: string,
  provider: "openai" | "google"
): Promise<ApiResponse<{ output: string; error?: string; stdout?: string; stderr?: string; executionTime?: number }>> {
  return apiRequest("/api/sandbox/run", {
    method: "POST",
    apiKey,
    provider,
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
  apiKey: string,
  provider: "openai" | "google"
): Promise<ApiResponse<{ 
  fixedCode: string; 
  logs: AgentLog[];
  attempts: number;
}>> {
  return apiRequest("/api/agent/fix", {
    method: "POST",
    apiKey,
    provider,
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
  provider: "openai" | "google"
): Promise<ApiResponse<{ response: string }>> {
  return apiRequest("/api/chat", {
    method: "POST",
    apiKey,
    provider,
    body: { message, history, provider },
  });
}

/**
 * Analyze code
 */
export async function analyzeCode(
  code: string,
  apiKey: string,
  provider: "openai" | "google"
): Promise<ApiResponse<{ analysis: string; suggestions: string[] }>> {
  return apiRequest("/api/analyze", {
    method: "POST",
    apiKey,
    provider,
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
  provider: "openai" | "google"
): Promise<ApiResponse<{ code: string; explanation: string }>> {
  return apiRequest("/api/generate", {
    method: "POST",
    apiKey,
    provider,
    body: { prompt, language, provider },
  });
}
