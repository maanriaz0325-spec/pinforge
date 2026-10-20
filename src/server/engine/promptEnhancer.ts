import { prisma } from "../db/prisma";
import { decrypt } from "../crypto/encryption";

export interface PromptEnhancementContext {
  prompt: string;
  style?: string;
  niche?: string;
  pinType?: string;
}

export interface PromptEnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  enhancementTechnique: "ai_llm" | "smart_rules";
  addedDetails: string[];
}

/**
 * Intelligent taxonomy and vocabulary for Pinterest prompt enhancement
 */
const LIGHTING_PRESETS = [
  "soft diffused morning daylight streaming through a large window with warm gentle highlights",
  "golden hour warm sunlight casting long dramatic soft shadows and cozy illumination",
  "bright airy natural daylight with clean neutral white balance and subtle luminous reflections",
  "atmospheric moody chiaroscuro lighting with rich contrast and gentle ambient glow",
];

const COMPOSITION_PRESETS = [
  "vertical 2:3 Pinterest composition, crisp foreground focus with soft creamy bokeh depth of field",
  "thoughtfully balanced vertical 2:3 Pinterest framing, styled magazine editorial layout with generous negative space",
  "clean vertical 2:3 Pinterest eye-level perspective with elegant spatial proportion and harmonious visual hierarchy",
  "artful vertical 2:3 Pinterest close-up detail shot emphasizing tactile craftsmanship, organic textures, and fine surface nuances",
];

const TEXTURE_PRESETS = [
  "tactile raw linen, natural grained oak wood, matte ceramic surfaces, and organic botanical accents",
  "smooth polished stone, brushed brass accents, tactile ribbed glass, and delicate layered textures",
  "crisp artisan details, authentic lived-in warmth, premium editorial styling, and rich earthy undertones",
];

/**
 * Categorizes a prompt into a broad domain to apply relevant sensory keywords
 */
function detectDomain(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("recipe") || p.includes("cake") || p.includes("food") || p.includes("salad") || p.includes("cook") || p.includes("bake") || p.includes("coffee") || p.includes("drink") || p.includes("tea") || p.includes("soup") || p.includes("meal")) {
    return "food";
  }
  if (p.includes("room") || p.includes("kitchen") || p.includes("bedroom") || p.includes("living") || p.includes("interior") || p.includes("decor") || p.includes("chair") || p.includes("couch") || p.includes("shelf") || p.includes("table") || p.includes("home")) {
    return "interior";
  }
  if (p.includes("fashion") || p.includes("outfit") || p.includes("dress") || p.includes("style") || p.includes("coat") || p.includes("shoes") || p.includes("wardrobe") || p.includes("wear")) {
    return "fashion";
  }
  if (p.includes("skin") || p.includes("beauty") || p.includes("hair") || p.includes("serum") || p.includes("cream") || p.includes("glow") || p.includes("routine")) {
    return "beauty";
  }
  if (p.includes("diy") || p.includes("craft") || p.includes("candle") || p.includes("paint") || p.includes("handmade") || p.includes("organize")) {
    return "diy";
  }
  return "general";
}

import { applyNicheStrategyToPrompt, detectNicheStrategy } from "./nicheStrategies";

/**
 * Deep rule-based prompt enhancement engine powered by standalone Niche Strategy Engine
 */
export function enhancePromptRules(ctx: PromptEnhancementContext): PromptEnhancementResult {
  const clean = ctx.prompt.trim();
  const domain = detectDomain(clean);
  const style = ctx.style || "Editorial";

  // Standalone Niche Strategy Engine application
  const nicheResult = applyNicheStrategyToPrompt(clean, {
    niche: ctx.niche || domain,
    style,
  });

  // Pick deterministic hash-based presets for consistency
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash << 5) - hash + clean.charCodeAt(i);
  hash = Math.abs(hash);

  const lighting = LIGHTING_PRESETS[hash % LIGHTING_PRESETS.length];
  const composition = COMPOSITION_PRESETS[(hash + 1) % COMPOSITION_PRESETS.length];
  const textures = TEXTURE_PRESETS[(hash + 2) % TEXTURE_PRESETS.length];

  let domainSpecifics = "";
  if (domain === "food") {
    domainSpecifics = "artfully plated with fresh organic garnishes, glistening freshness cues, linen napkins, rustic ceramic dishware, steam rising gently";
  } else if (domain === "interior") {
    domainSpecifics = "architectural lived-in aesthetic, styled vignette with potted greenery, balanced negative space, cozy textiles, refined designer home feel";
  } else if (domain === "fashion") {
    domainSpecifics = "chic street style aesthetic, tactile fabric drape, high-end seasonal palette, effortless luxury styling, subtle movement";
  } else if (domain === "beauty") {
    domainSpecifics = "clean glass bottle with minimalist typography, water droplets, soothing pastel tones, spa-like tranquil atmosphere, radiant healthy aesthetic";
  } else if (domain === "diy") {
    domainSpecifics = "in-progress creative workshop atmosphere, neat natural materials, artisanal tools resting nearby, step-by-step inspiring visual flow";
  } else {
    domainSpecifics = "refined visual hierarchy, premium lifestyle aesthetic, immersive atmosphere, authentic lived-in charm";
  }

  const enhancedPrompt = `${clean}, beautifully captured in a high-end ${style} Pinterest aesthetic. Staged in ${nicheResult.environmentUsed}, featuring ${domainSpecifics}. Illuminated by ${lighting}, with ${textures}. Framed in ${composition}. 8k resolution, photorealistic editorial photography, Hasselblad color rendering, immaculate clarity, no blur, no watermarks, perfectly staged for viral Pinterest engagement.`;

  return {
    originalPrompt: clean,
    enhancedPrompt,
    enhancementTechnique: "smart_rules",
    addedDetails: [
      `Niche Strategy: ${nicheResult.nicheUsed} (${nicheResult.intentUsed})`,
      `Unique Environment: ${nicheResult.environmentUsed}`,
      `Atmospheric lighting: ${lighting.slice(0, 45)}...`,
      `Sensory textures: ${textures.slice(0, 45)}...`,
      `Composition: Vertical 2:3 Pinterest photography framing`,
    ],
  };
}

/**
 * Master Prompt Enhancer: Uses OpenRouter LLM if available, falls back to deep rules seamlessly
 */
export async function enhancePrompt(ctx: PromptEnhancementContext): Promise<PromptEnhancementResult> {
  const clean = ctx.prompt.trim();
  if (!clean) {
    return {
      originalPrompt: "",
      enhancedPrompt: "",
      enhancementTechnique: "smart_rules",
      addedDetails: [],
    };
  }

  // 1. Resolve OpenRouter API Key
  let openrouterApiKey = "";
  let defaultModel = "google/gemini-2.0-flash-exp:free";

  try {
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    if (settings?.openrouterKeyEnc) {
      try {
        openrouterApiKey = decrypt(settings.openrouterKeyEnc);
      } catch {}
    } else if (process.env.OPENROUTER_API_KEY) {
      openrouterApiKey = process.env.OPENROUTER_API_KEY;
    }
    if (settings?.defaultTextModel) {
      defaultModel = settings.defaultTextModel;
    }
  } catch {}

  // 2. If OpenRouter Key is available and provider mode is not mock, call AI LLM
  if (openrouterApiKey && process.env.PROVIDER_MODE !== "mock") {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const systemPrompt = `You are an elite Pinterest Visual Prompt Engineer and Creative Director.
Your task is to take a raw user prompt or short idea, and rewrite it into an extraordinary, deeply targeted, descriptive image generation prompt engineered specifically for Pinterest.

Guidelines:
1. Core Focus: Keep the user's primary subject central and recognizable.
2. Visual Detail: Add deep, rich sensory details (textures, materials, artisan craftsmanship, specific colors, lived-in feel).
3. Environment & Lighting: Specify exact lighting (e.g. golden hour sunbeams, soft morning window daylight) and rich environment props.
4. Photographic Framing: Include vertical 2:3 Pinterest framing, depth of field (50mm lens), crisp focus, balanced negative space for overlay text.
5. Quality Anchors: Add premium editorial keywords (e.g. high-end lifestyle photography, Kinfolk / Architectural Digest / Food52 aesthetic, sharp 8k detail).
6. Length: Write a vivid, cohesive paragraph between 50 and 90 words.
7. Output format: Return ONLY the enhanced prompt string. Do NOT add preamble, quotes, markdown, or explanation.`;

      const userMessage = `User Idea: "${clean}"
Desired Style: ${ctx.style || "Editorial"}
Target Niche: ${ctx.niche || "Lifestyle / Aesthetic"}
Please enhance this into a deeply targeted, highly descriptive Pinterest visual prompt:`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": "https://pinforge.local",
          "X-Title": "PinForge Prompt Enhancer",
        },
        body: JSON.stringify({
          model: defaultModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        const aiText = json?.choices?.[0]?.message?.content?.trim();
        if (aiText && aiText.length > 20) {
          // Remove any accidental surrounding quotes
          const sanitizedPrompt = aiText.replace(/^["']|["']$/g, "").trim();
          return {
            originalPrompt: clean,
            enhancedPrompt: sanitizedPrompt,
            enhancementTechnique: "ai_llm",
            addedDetails: [
              "AI-directed visual sensory details and textures",
              "Pinterest 2:3 vertical depth and lighting staging",
              "Artisanal material specification and mood calibration",
            ],
          };
        }
      }
    } catch (llmErr) {
      console.warn("OpenRouter prompt enhancement failed, falling back to smart rules:", llmErr);
    }
  }

  // 3. Fallback: Deep rule-based enhancer
  return enhancePromptRules(ctx);
}
