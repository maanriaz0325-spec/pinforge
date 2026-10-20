import crypto from "crypto";

export interface RunwareTestResult {
  success: boolean;
  status: "connected" | "invalid_key" | "no_credit" | "network_error";
  message: string;
  cost?: number;
  balance?: number;
}

export interface RunwareInferenceParams {
  apiKey: string;
  model: string; // The AIR model ID e.g. "runware:100@1"
  positivePrompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  taskUUID?: string;
  outputFormat?: "JPG" | "PNG" | "WEBP";
  seedImage?: string;
  strength?: number;
}

export interface RunwareInferenceResult {
  success: boolean;
  imageURL?: string;
  cost?: number;
  taskUUID: string;
  seed?: number;
  error?: string;
  status: "success" | "invalid_key" | "no_credit" | "rate_limited" | "provider_error" | "network_error";
}

export async function testRunwareConnection(apiKey: string): Promise<RunwareTestResult> {
  const trimmed = apiKey?.trim();
  if (!trimmed) {
    return {
      success: false,
      status: "invalid_key",
      message: "No Runware API key provided.",
    };
  }

  const isMock = process.env.PROVIDER_MODE === "mock" || trimmed.startsWith("mock_");

  if (isMock) {
    if (trimmed.includes("invalid") || trimmed.includes("bad")) {
      return {
        success: false,
        status: "invalid_key",
        message: "Invalid Runware API key (simulated).",
      };
    }
    if (trimmed.includes("nocredit") || trimmed.includes("zero")) {
      return {
        success: false,
        status: "no_credit",
        message: "Insufficient Runware credit balance (simulated).",
      };
    }
    return {
      success: true,
      status: "connected",
      message: "Connected successfully (Mock Provider Mode) ✅",
      cost: 0.0015,
      balance: 10.0,
    };
  }

  // Live REST API Test (Spec Section 29.5)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${trimmed}`,
      },
      body: JSON.stringify([
        {
          taskType: "imageInference",
          taskUUID: `test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          positivePrompt: "minimal test dot",
          model: "runware:100@1",
          width: 512,
          height: 512,
          numberResults: 1,
          outputFormat: "WEBP",
          includeCost: true,
        },
      ]),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        status: "invalid_key",
        message: "Runware rejected the API key (401 Unauthorized).",
      };
    }

    if (res.status === 402) {
      return {
        success: false,
        status: "no_credit",
        message: "Runware account balance depleted (402 Payment Required).",
      };
    }

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        status: "network_error",
        message: `Runware API returned HTTP ${res.status}: ${errText.slice(0, 150)}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      status: "connected",
      message: "Connected to Runware API successfully ✅",
      cost: data?.data?.[0]?.cost ?? 0.0019,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: "network_error",
      message: `Failed to connect to Runware: ${errorMsg}`,
    };
  }
}

/**
 * Executes a single image generation request through Runware REST API
 */
export async function generateRunwareImage(
  params: RunwareInferenceParams
): Promise<RunwareInferenceResult> {
  const taskUUID = params.taskUUID || crypto.randomUUID();
  const trimmedKey = params.apiKey?.trim();

  if (!trimmedKey) {
    return {
      success: false,
      taskUUID,
      status: "invalid_key",
      error: "Runware API key is missing. Please configure it in Settings.",
    };
  }

  const isMock = process.env.PROVIDER_MODE === "mock" || trimmedKey.startsWith("mock_");

  if (isMock) {
    if (trimmedKey.includes("invalid") || trimmedKey.includes("bad")) {
      return {
        success: false,
        taskUUID,
        status: "invalid_key",
        error: "Runware rejected the API key (Simulated 401 Unauthorized).",
      };
    }
    if (trimmedKey.includes("nocredit") || trimmedKey.includes("zero")) {
      return {
        success: false,
        taskUUID,
        status: "no_credit",
        error: "Insufficient Runware credits (Simulated 402 Payment Required).",
      };
    }

    // Generate a valid mock SVG image encoded as data URI for tests
    const width = params.width || 768;
    const height = params.height || 1152;
    const cleanPrompt = params.positivePrompt
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .slice(0, 80);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)"/>
        <circle cx="${width / 2}" cy="${height / 2 - 80}" r="120" fill="#E60023" opacity="0.3"/>
        <text x="${width / 2}" y="${height / 2 - 80}" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">PinForge Generated</text>
        <text x="${width / 2}" y="${height / 2 - 40}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#94a3b8">Model: ${params.model}</text>
        <rect x="40" y="${height / 2 + 40}" width="${width - 80}" height="140" rx="16" fill="#020617" opacity="0.8"/>
        <text x="${width / 2}" y="${height / 2 + 100}" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#f8fafc">"${cleanPrompt}"</text>
        <text x="${width / 2}" y="${height - 60}" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748b">${width} × ${height} • 2:3 Pinterest Standard</text>
      </svg>
    `.trim();

    const base64Svg = Buffer.from(svg).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

    return {
      success: true,
      taskUUID,
      imageURL: dataUrl,
      cost: 0.0019,
      seed: 424242,
      status: "success",
    };
  }

  // Live REST request to Runware API (Spec Section 29.2)
  try {
    let resolvedModel = params.model;
    if (resolvedModel === "openai:dall-e-3" || resolvedModel === "dall-e-3" || resolvedModel === "gpt-image-2") {
      resolvedModel = "openai:gpt-image@2";
    }

    let finalPositivePrompt = params.positivePrompt?.trim() || "";
    if (finalPositivePrompt.length < 2) {
      finalPositivePrompt = `${finalPositivePrompt} aesthetic`;
    }
    if (finalPositivePrompt.length > 3000) {
      finalPositivePrompt = finalPositivePrompt.slice(0, 3000);
    }

    const rawWidth = params.width || 768;
    const rawHeight = params.height || 1152;
    const safeWidth = Math.max(128, Math.min(2048, Math.round(rawWidth / 64) * 64));
    const safeHeight = Math.max(128, Math.min(2048, Math.round(rawHeight / 64) * 64));

    const taskPayload: Record<string, unknown> = {
      taskType: "imageInference",
      taskUUID,
      positivePrompt: finalPositivePrompt,
      model: resolvedModel,
      width: safeWidth,
      height: safeHeight,
      numberResults: 1,
      outputType: "URL",
      outputFormat: params.outputFormat || "JPG",
      includeCost: true,
    };

    const modelStr = String(resolvedModel || "").toLowerCase();
    const isNegativePromptSupported = !(
      modelStr.includes("flux") ||
      modelStr.includes("100@1") ||
      modelStr.includes("101@1") ||
      modelStr.includes("openai") ||
      modelStr.includes("dall-e") ||
      modelStr.includes("gpt-image") ||
      modelStr.includes("recraft") ||
      modelStr.includes("ideogram")
    );

    if (
      params.negativePrompt &&
      params.negativePrompt.trim() !== "" &&
      isNegativePromptSupported
    ) {
      taskPayload.negativePrompt = params.negativePrompt.trim();
    }

    if (params.seedImage) {
      taskPayload.seedImage = params.seedImage;
      taskPayload.strength = params.strength ?? 0.6;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout for complex/slow models

    const res = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${trimmedKey}`,
      },
      body: JSON.stringify([taskPayload]),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        taskUUID,
        status: "invalid_key",
        error: "Runware authentication rejected (401/403). Check your API key in Settings.",
      };
    }

    if (res.status === 402) {
      return {
        success: false,
        taskUUID,
        status: "no_credit",
        error: "Runware account balance depleted (402 Payment Required). Please top up credits.",
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        taskUUID,
        status: "rate_limited",
        error: "Runware rate limit exceeded (429). Please retry momentarily.",
      };
    }

    const bodyText = await res.text();
    let json: { data?: Array<{ imageURL?: string; cost?: number; seed?: number }>; errors?: Array<{ message?: string }> };
    try {
      json = JSON.parse(bodyText);
    } catch {
      return {
        success: false,
        taskUUID,
        status: "provider_error",
        error: `Invalid JSON returned by Runware API: ${bodyText.slice(0, 150)}`,
      };
    }

    if (!res.ok || json.errors?.length) {
      const errMsg = json.errors?.[0]?.message || `HTTP ${res.status}: ${bodyText.slice(0, 150)}`;
      
      // Self-healing retry: If the model architecture rejected negativePrompt, automatically retry without it!
      if (
        taskPayload.negativePrompt &&
        (errMsg.toLowerCase().includes("negativeprompt") ||
         errMsg.toLowerCase().includes("negative prompt"))
      ) {
        delete taskPayload.negativePrompt;
        try {
          const retryRes = await fetch("https://api.runware.ai/v1", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${trimmedKey}`,
            },
            body: JSON.stringify([taskPayload]),
          });
          const retryText = await retryRes.text();
          const retryJson = JSON.parse(retryText);
          const taskResult = retryJson.data?.[0];
          if (retryRes.ok && taskResult?.imageURL) {
            return {
              success: true,
              taskUUID,
              imageURL: taskResult.imageURL,
              cost: taskResult.cost,
              seed: taskResult.seed,
              status: "success",
            };
          }
        } catch {}
      }

      return {
        success: false,
        taskUUID,
        status: "provider_error",
        error: `Runware provider error: ${errMsg}`,
      };
    }

    const taskResult = json.data?.[0];
    if (!taskResult?.imageURL) {
      return {
        success: false,
        taskUUID,
        status: "provider_error",
        error: "Runware response succeeded but contained no imageURL.",
      };
    }

    return {
      success: true,
      taskUUID,
      imageURL: taskResult.imageURL,
      cost: taskResult.cost,
      seed: taskResult.seed,
      status: "success",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      taskUUID,
      status: "network_error",
      error: `Network failure calling Runware: ${errorMsg}`,
    };
  }
}
