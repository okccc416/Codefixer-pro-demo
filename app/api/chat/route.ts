import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  provider?: "openai" | "google";
}

interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Read BYOK headers
    const provider = request.headers.get("x-provider") as "openai" | "google" | null;
    const userApiKey = request.headers.get("x-api-key");

    if (!userApiKey || !provider) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing API key or provider. Please configure in Settings." 
        } as ChatResponse,
        { status: 401 }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, history } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" } as ChatResponse,
        { status: 400 }
      );
    }

    console.log(`[Chat] Starting chat with ${provider} (user's API key)`);

    // Initialize AI provider with user's API key (BYOK)
    let model;

    if (provider === "google") {
      const google = createGoogleGenerativeAI({
        apiKey: userApiKey,
      });
      model = google("gemini-2.5-flash");
    } else {
      const openai = createOpenAI({
        apiKey: userApiKey,
      });
      model = openai("gpt-4o-mini");
    }

    // Build messages array
    const messages = [
      {
        role: "system" as const,
        content: `You are an AI coding assistant integrated into Codex IDE. 
Help users with:
- Code explanations and debugging
- Best practices and code review
- Algorithm suggestions
- Documentation questions
- General programming help

Be concise, helpful, and code-focused. Format code blocks with markdown.`,
      },
      ...history.map(msg => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    // Generate AI response
    const result = await generateText({
      model,
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const responseText = result.text;

    console.log(`[Chat] Response generated (${responseText.length} chars)`);

    return NextResponse.json(
      {
        success: true,
        response: responseText,
      } as ChatResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("[Chat] Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      } as ChatResponse,
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
