export interface TemplateQualityDetails {
  score: number;
  suggestions: string[];
  hasRole: boolean;
  hasAudience: boolean;
  hasVisualIdentity: boolean;
  hasAvoidList: boolean;
  hasKeywords: boolean;
  wordCount: number;
}

/**
 * Calculates Template Quality Score (0-100) per Spec Section 32.3
 */
export function calculateTemplateQualityScore(template: {
  systemPrompt: string;
  forbiddenElements?: string[] | string;
  keywordSeeds?: string[] | string;
}): TemplateQualityDetails {
  const prompt = (template.systemPrompt || "").toLowerCase();
  const suggestions: string[] = [];

  // Parse keyword seeds
  let seeds: string[] = [];
  if (Array.isArray(template.keywordSeeds)) {
    seeds = template.keywordSeeds;
  } else if (typeof template.keywordSeeds === "string") {
    try {
      seeds = JSON.parse(template.keywordSeeds);
    } catch {
      seeds = template.keywordSeeds.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // Parse forbidden elements
  let forbidden: string[] = [];
  if (Array.isArray(template.forbiddenElements)) {
    forbidden = template.forbiddenElements;
  } else if (typeof template.forbiddenElements === "string") {
    try {
      forbidden = JSON.parse(template.forbiddenElements);
    } catch {
      forbidden = template.forbiddenElements.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;

  const hasRole = prompt.includes("role:") || prompt.includes("you are a pinterest");
  const hasAudience = prompt.includes("audience:") || prompt.includes("search intent");
  const hasVisualIdentity =
    prompt.includes("visual identity:") ||
    prompt.includes("lighting") ||
    prompt.includes("palette") ||
    prompt.includes("materials");
  const hasAvoidList =
    forbidden.length > 0 ||
    prompt.includes("must avoid:") ||
    prompt.includes("avoid:") ||
    prompt.includes("forbidden");
  const hasKeywords = seeds.length >= 5;

  let score = 0;
  if (hasRole) score += 20;
  else suggestions.push("Define the strategist role (e.g. 'ROLE: You are a Pinterest visual strategist for...')");

  if (hasAudience) score += 20;
  else suggestions.push("Specify the target audience and search intent (e.g. 'AUDIENCE: Women 25-45 looking for DIY ideas')");

  if (hasVisualIdentity) score += 20;
  else suggestions.push("Detail the visual identity (colors, lighting, textures, materials)");

  if (hasAvoidList) score += 15;
  else suggestions.push("Add forbidden elements (e.g. 'clutter, neon colors, watermarks, distorted hands')");

  if (hasKeywords) score += 15;
  else suggestions.push(`Add at least 5 keyword seeds (currently ${seeds.length})`);

  if (wordCount >= 100 && wordCount <= 800) {
    score += 10;
  } else if (wordCount < 100) {
    suggestions.push(`Expand system prompt details (currently ${wordCount} words, recommend 150-500 words)`);
  }

  return {
    score: Math.min(100, Math.max(10, score)),
    suggestions,
    hasRole,
    hasAudience,
    hasVisualIdentity,
    hasAvoidList,
    hasKeywords,
    wordCount,
  };
}

/**
 * Compresses a long template system prompt into ~60 words for P3 prompt injection (Spec Section 27)
 */
export function compressTemplateForPrompt(systemPrompt: string): string {
  if (!systemPrompt) return "";
  const cleaned = systemPrompt
    .replace(/ROLE:/gi, "")
    .replace(/AUDIENCE:.*?(?=VISUAL|MUST|$)/gis, "")
    .replace(/DIVERSITY:.*?(?=KEYWORD|$)/gis, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ");
  if (words.length <= 60) return cleaned;
  return words.slice(0, 60).join(" ") + "...";
}

/**
 * Drafts a complete 7-section Niche Template using OpenRouter or rule-based fallback
 */
export async function draftTemplateWithAi(
  nicheName: string,
  tasteNotes: string,
  openrouterApiKey?: string
): Promise<{
  name: string;
  systemPrompt: string;
  styleNotes: string;
  forbiddenElements: string[];
  keywordSeeds: string[];
}> {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (process.env.PROVIDER_MODE !== "mock" && openrouterApiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const prompt = `Create a high-performing Pinterest Niche Template for the niche: "${nicheName}".
User taste notes: "${tasteNotes}".
Return ONLY a valid JSON object with:
{
  "name": "Specific sub-niche style name",
  "systemPrompt": "ROLE: ... AUDIENCE: ... VISUAL IDENTITY: ... MUST INCLUDE: ... MUST AVOID: ... COMPOSITION: ... DIVERSITY: ...",
  "styleNotes": "Short styling note",
  "forbiddenElements": ["element1", "element2", "element3", "element4"],
  "keywordSeeds": ["seed 1", "seed 2", "seed 3", "seed 4", "seed 5"]
}`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterApiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content || "";
        const clean = content.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (parsed.systemPrompt && parsed.keywordSeeds) {
          return {
            name: parsed.name || `${cap(nicheName)} Aesthetic`,
            systemPrompt: parsed.systemPrompt,
            styleNotes: parsed.styleNotes || `Focus on authentic ${nicheName} aesthetics.`,
            forbiddenElements: Array.isArray(parsed.forbiddenElements)
              ? parsed.forbiddenElements
              : ["clutter", "watermarks", "distorted hands"],
            keywordSeeds: Array.isArray(parsed.keywordSeeds)
              ? parsed.keywordSeeds
              : [`${nicheName} ideas`, `${nicheName} aesthetic`],
          };
        }
      }
    } catch {}
  }

  // Rule-based deterministic template generator
  return {
    name: `${cap(nicheName)} Aesthetic & Visuals`,
    systemPrompt: `ROLE: You are a Pinterest visual strategist for ${nicheName}.
AUDIENCE: Enthusiasts and pinners searching for high-taste ${nicheName} inspiration, tutorials, and aesthetic ideas.
VISUAL IDENTITY: Harmonious lighting, balanced textures, authentic styling, ${tasteNotes || "warm natural colors"}.
MUST INCLUDE: Beautiful focal subject, realistic materials, clean vertical composition.
MUST AVOID: Clutter, neon artificial colors, blurry text, watermarks, distorted proportions.
COMPOSITION: Listicle = wide uncluttered scene; How-to = action close-up; Inspiration = hero styled vignette.
DIVERSITY: Every pin must differ in camera angle, setting, or featured object.
KEYWORD THEMES: ${nicheName} ideas, ${nicheName} inspiration, modern ${nicheName}, aesthetic ${nicheName}.`,
    styleNotes: `Emphasize crisp focal depth and cohesive ${nicheName} color harmony.`,
    forbiddenElements: [
      "clutter",
      "watermarks",
      "neon glare",
      "distorted hands",
      "overexposed lighting",
    ],
    keywordSeeds: [
      `${nicheName} ideas`,
      `${nicheName} aesthetic`,
      `${nicheName} inspiration`,
      `best ${nicheName}`,
      `modern ${nicheName} design`,
    ],
  };
}
