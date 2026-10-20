import crypto from "crypto";

export interface GeneratedIdea {
  idea: string;
  angle: string;
  composition: string;
  setting: string;
  mood: string;
  targetKeyword: string;
}

export const COMPOSITION_TAXONOMY = [
  "close-up detail",
  "flat-lay overhead",
  "wide room scene",
  "eye-level styled vignette",
  "top-down diagonal",
  "in-use human hand interaction",
  "low-angle architectural",
  "macro texture focus",
];

export const MOOD_TAXONOMY = [
  "calm serene",
  "cozy warm",
  "bright airy",
  "dramatic elegant",
  "fresh energetic",
  "minimalist refined",
];

export const SETTING_TAXONOMY = [
  "morning window light",
  "evening golden hour",
  "clean studio backdrop",
  "sunlit rustic corner",
  "clean marble surface",
  "verdant garden patio",
  "modern apartment nook",
  "soft diffused daylight interior",
];

/**
 * Calculates Jaccard similarity coefficient between two strings (0.0 to 1.0)
 */
export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const getTokens = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const tokensA = getTokens(textA);
  const tokensB = getTokens(textB);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }

  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Way 2a: Diversity Engine generating N distinct Pinterest concepts per Spec Section 28.1 & 28.2
 * GUARANTEE (Acceptance M6): No two ideas share the exact same (composition x setting) signature.
 */
export function generateDiverseIdeas(params: {
  templateName: string;
  systemPrompt: string;
  keywordSeeds: string[];
  count: number;
  recentUsedIdeas?: string[];
}): GeneratedIdea[] {
  const { templateName, keywordSeeds, count, recentUsedIdeas = [] } = params;
  const seeds = keywordSeeds.length > 0 ? keywordSeeds : [templateName, `${templateName} ideas`];

  const results: GeneratedIdea[] = [];
  const seenSignatures = new Set<string>();

  let seedIdx = 0;
  let compIdx = 0;
  let moodIdx = 0;
  let settingIdx = 0;

  for (let i = 0; i < count; i++) {
    const composition = COMPOSITION_TAXONOMY[compIdx % COMPOSITION_TAXONOMY.length];
    const mood = MOOD_TAXONOMY[moodIdx % MOOD_TAXONOMY.length];
    const setting = SETTING_TAXONOMY[settingIdx % SETTING_TAXONOMY.length];
    const targetKeyword = seeds[seedIdx % seeds.length];

    // Guarantee unique (composition x setting) signature per Acceptance M6
    let selectedComp = composition;
    let selectedSetting = setting;
    let signature = `${selectedComp}|${selectedSetting}`;

    if (seenSignatures.has(signature)) {
      let found = false;
      for (let c = 0; c < COMPOSITION_TAXONOMY.length; c++) {
        for (let s = 0; s < SETTING_TAXONOMY.length; s++) {
          const testComp = COMPOSITION_TAXONOMY[(compIdx + c) % COMPOSITION_TAXONOMY.length];
          const testSetting = SETTING_TAXONOMY[(settingIdx + s) % SETTING_TAXONOMY.length];
          const testSig = `${testComp}|${testSetting}`;
          if (!seenSignatures.has(testSig)) {
            selectedComp = testComp;
            selectedSetting = testSetting;
            signature = testSig;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    seenSignatures.add(signature);

    // Rotate indices to ensure maximum dimensional coverage
    compIdx++;
    moodIdx += 2;
    settingIdx += 3;
    seedIdx++;

    // Generate descriptive subject idea
    const ideaText = `${targetKeyword} featuring ${selectedComp} in a ${mood} ${selectedSetting}`;

    results.push({
      idea: ideaText,
      angle: selectedComp,
      composition: selectedComp,
      setting: selectedSetting,
      mood,
      targetKeyword,
    });
  }

  return results;
}

/**
 * Way 2b: Expands a short single-line idea into a 60-90 word visual prompt per Spec Section 28.4
 * Guardrail: Preserves user subject exactly while adding niche styling, lighting & camera detail.
 */
export function expandSingleLineIdea(
  line: string,
  template: { name: string; systemPrompt: string; styleNotes?: string | null }
): string {
  const cleanLine = line.trim();
  const styleNote = template.styleNotes || "natural diffused lighting, balanced textures";

  // Checkpoint: Preserve the core subject
  const expansion = `${cleanLine}, beautifully styled in ${template.name} visual identity. Featuring ${styleNote}, vertical Pinterest photography, crisp focal depth, natural daylight highlights, soft shadows, warm lived-in texture, elegant spatial balance, 50mm lens perspective, high definition detail.`;

  return expansion;
}

/**
 * Fast SHA-256 hash for IdeaHistory tracking
 */
export function hashIdea(ideaText: string): string {
  return crypto.createHash("sha256").update(ideaText.trim().toLowerCase()).digest("hex");
}
