export interface OpenRouterTestResult {
  success: boolean;
  status: "connected" | "invalid_key" | "rate_limited" | "network_error";
  message: string;
}

export interface FreeModelOption {
  id: string;
  name: string;
  context_length: number;
  description?: string;
}

export const FALLBACK_FREE_MODELS: FreeModelOption[] = [
  {
    id: "auto:deepseek-gpt:free",
    name: "Auto — best available (DeepSeek / GPT)",
    context_length: 128000,
    description: "Auto-picks the best available free model (DeepSeek R1, LLaMA 3.3 70B, GPT) for titles, descriptions, and alt text.",
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1 (Free)",
    context_length: 64000,
    description: "Strong reasoning and diversity engine for SEO copy.",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct (Free)",
    context_length: 131072,
    description: "High quality open-weights copywriting model.",
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct:free",
    name: "Qwen 2.5 Coder 32B (Free)",
    context_length: 32768,
    description: "Accurate structured JSON and prompt expansions.",
  },
  {
    id: "mistralai/mistral-small-24b-instruct-2501:free",
    name: "Mistral Small 24B (Free)",
    context_length: 32768,
    description: "Concise Pinterest SEO copy & hook generation.",
  },
];

export async function testOpenRouterConnection(apiKey: string): Promise<OpenRouterTestResult> {
  const trimmed = apiKey?.trim();
  if (!trimmed) {
    return {
      success: false,
      status: "invalid_key",
      message: "No OpenRouter API key provided.",
    };
  }

  const isMock = process.env.PROVIDER_MODE === "mock" || trimmed.startsWith("mock_");

  if (isMock) {
    if (trimmed.includes("invalid") || trimmed.includes("bad")) {
      return {
        success: false,
        status: "invalid_key",
        message: "Invalid OpenRouter API key (simulated).",
      };
    }
    if (trimmed.includes("ratelimit") || trimmed.includes("429")) {
      return {
        success: false,
        status: "rate_limited",
        message: "OpenRouter rate limit hit (simulated 429).",
      };
    }
    return {
      success: true,
      status: "connected",
      message: "Connected to OpenRouter successfully (Mock Provider Mode) ✅",
    };
  }

  // Live REST API Test (Spec Section 34 & 39)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${trimmed}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        status: "invalid_key",
        message: "OpenRouter rejected the API key (401 Unauthorized).",
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        status: "rate_limited",
        message: "OpenRouter rate limit exceeded (429).",
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: "network_error",
        message: `OpenRouter returned HTTP ${res.status}`,
      };
    }

    return {
      success: true,
      status: "connected",
      message: "Connected to OpenRouter API successfully ✅",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: "network_error",
      message: `Failed to connect to OpenRouter: ${errorMsg}`,
    };
  }
}

export async function fetchFreeOpenRouterModels(apiKey?: string): Promise<FreeModelOption[]> {
  if (process.env.PROVIDER_MODE === "mock" || !apiKey) {
    return FALLBACK_FREE_MODELS;
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) return FALLBACK_FREE_MODELS;

    const data = await res.json();
    if (!data?.data || !Array.isArray(data.data)) return FALLBACK_FREE_MODELS;

    const freeModels: FreeModelOption[] = data.data
      .filter((m: { pricing?: { prompt?: string | number; completion?: string | number } }) => {
        const p = m.pricing;
        return (
          (p?.prompt === 0 || p?.prompt === "0") &&
          (p?.completion === 0 || p?.completion === "0")
        );
      })
      .map((m: { id: string; name?: string; context_length?: number; description?: string }) => ({
        id: m.id,
        name: m.name || m.id,
        context_length: m.context_length || 32768,
        description: m.description,
      }))
      .slice(0, 15);

    return freeModels.length > 0 ? freeModels : FALLBACK_FREE_MODELS;
  } catch {
    return FALLBACK_FREE_MODELS;
  }
}
