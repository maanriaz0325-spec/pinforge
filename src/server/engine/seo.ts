import { FALLBACK_FREE_MODELS } from "../providers/openrouter";
import { detectNicheStrategy, getNicheOverlayContent, CatchyOverlayContent } from "./nicheStrategies";

export interface SeoMetadata {
  targetKeyword: string;
  secondaryKeywords: string[];
  title: string;
  description: string;
  altText: string;
  hashtags: string[];
  boardSuggestion: string;
  seoScore: number;
}

export interface SeoContext {
  prompt: string;
  pinType?: string;
  niche?: string;
  overlayText?: string;
  keywordSeeds?: string[];
  brandVoice?: string;
  openrouterApiKey?: string;
  primaryModel?: string;
}

/**
 * Validates and calculates a 0-100 Pinterest SEO score per Spec Section 31.4
 */
export function calculateSeoScore(
  seo: Omit<SeoMetadata, "seoScore">,
  prompt: string
): number {
  const kw = seo.targetKeyword.toLowerCase().trim();
  const title = seo.title.toLowerCase();
  const desc = seo.description.toLowerCase();
  const alt = seo.altText.toLowerCase();

  // 1. Keyword in Title (25 pts)
  const kwInTitle = title.includes(kw) ? 1 : 0.4;

  // 2. Keyword in first 40 chars of Title (15 pts)
  const first40 = title.slice(0, 40);
  const kwInFirst40 = first40.includes(kw) ? 1 : 0.3;

  // 3. Keyword in first sentence of Description (20 pts)
  const firstSentence = desc.split(/[.!?]/)[0] || "";
  const kwInDescFirst = firstSentence.includes(kw) ? 1 : 0.4;

  // 4. Secondary Keyword Coverage (10 pts)
  const secMatchCount = (seo.secondaryKeywords || []).filter((sk) =>
    desc.includes(sk.toLowerCase())
  ).length;
  const secondaryCoverage = Math.min(1, secMatchCount / 2);

  // 5. Alt Text Quality (10 pts)
  const altTextQuality =
    alt.length >= 100 && alt.length <= 300 && alt.includes(kw) ? 1 : 0.5;

  // 6. Optimal Lengths (10 pts)
  const titleOptimal = seo.title.length >= 30 && seo.title.length <= 100 ? 1 : 0.5;
  const descOptimal = seo.description.length >= 180 && seo.description.length <= 500 ? 1 : 0.5;
  const lengthOptimal = (titleOptimal + descOptimal) / 2;

  // 7. Uniqueness / Detail (10 pts)
  const uniqueness = prompt.length > 20 ? 1 : 0.7;

  const score = Math.round(
    25 * kwInTitle +
      15 * kwInFirst40 +
      20 * kwInDescFirst +
      10 * secondaryCoverage +
      10 * altTextQuality +
      10 * lengthOptimal +
      10 * uniqueness
  );

  return Math.min(100, Math.max(10, score));
}

/**
 * Hard validators ensuring code enforces Pinterest limits (Spec Section 31.3)
 */
export function validateAndFixSeo(seo: Omit<SeoMetadata, "seoScore">): Omit<SeoMetadata, "seoScore"> {
  let title = seo.title.trim();
  if (title.length > 100) {
    title = title.slice(0, 97).replace(/\s+\S*$/, "") + "...";
  }

  let description = seo.description.trim();
  if (description.length > 500) {
    description = description.slice(0, 495).replace(/\s+\S*$/, "") + "...";
  }
  if (!description.toLowerCase().includes("save") && description.length < 470) {
    description += " Save this pin for inspiration!";
  }

  let altText = seo.altText.trim();
  if (altText.length > 300) {
    altText = altText.slice(0, 295).replace(/\s+\S*$/, "") + "...";
  }

  const hashtags = (seo.hashtags || [])
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((tag) => tag.length >= 2)
    .slice(0, 5);

  if (hashtags.length < 3) {
    const kwTags = seo.targetKeyword.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    for (const t of kwTags) {
      if (!hashtags.includes(t) && hashtags.length < 5) hashtags.push(t);
    }
  }

  return {
    ...seo,
    title,
    description,
    altText,
    hashtags,
  };
}

/**
 * Strips command prefixes, quality buzzwords, camera technical tags, and conversational noise
 * to isolate the true core subject of the user's prompt.
 * e.g., "Create an ultra-realistic, high-end beauty editorial portrait using chocolate brown wavy hair with caramel highlights, shot with 85mm"
 * -> "chocolate brown wavy hair with caramel highlights"
 */
export function cleanPromptSubject(rawPrompt: string): string {
  let text = (rawPrompt || "").trim();

  // 0. Remove hashtag prefixes (#, ##), markdown asterisks, quotes, list numbering, bullets
  text = text.replace(/^[#\s]+/, "");
  text = text.replace(/#\b/g, "");
  text = text.replace(/[*_~`"']/g, "");
  text = text.replace(/^(\d+[\.\)]|[-•*])\s*/, "");

  // 1. Remove initial visual / photo lead-ins
  text = text.replace(/^(a photo of|an image of|a picture of|a shot of|a visual of|a portrait of|photo of|image of|picture of|close[- ]up of|close up of|portrait of)\s+/i, "");

  // 2. Remove AI prompt generation command verbs
  text = text.replace(/^(create|generate|make|render|depict|illustrate|design|capture|photograph|show)\s+(an?|the)?\s*/i, "");

  // 3. Repeat photo lead-in check (in case command was followed by photo of...)
  text = text.replace(/^(a photo of|an image of|a picture of|a shot of|a visual of|a portrait of|photo of|image of|picture of|close[- ]up of|close up of|portrait of)\s+/i, "");

  // 4. Strip quality/aesthetic adverbs and detail buzzwords
  text = text.replace(/\b(exceptionally|richly|highly|intricately|stunningly|deeply|immaculately|superbly|wonderfully|exquisitely|magnificently|beautifully|insanely|incredibly|unbelievably|breathtakingly|extremely|utterly)\s+(richly\s+)?(detailed|crafted|rendered|photographed|staged|decorated|designed|styled|captured|curated|composed)?\b/gi, "");
  text = text.replace(/\b(richly detailed|hyper detailed|ultra detailed|extremely detailed|super detailed|high detail|highly detailed|intricate details?|stunning details?|flawless details?)\b/gi, "");
  text = text.replace(/\b(ultra[- ]realistic|hyper[- ]realistic|photorealistic|photoreal|realistic|high[- ]end|beauty editorial portrait|editorial portrait|beauty portrait|editorial photo(graph)?|professional photo(graph)?|award[- ]winning|8k resolution|8k|4k|cinematic lighting|masterpiece)\b/gi, "");

  // 5. Clean leading punctuation and connectors
  text = text.replace(/^[,.\s-]+/, "").replace(/[,.\s-]+$/, "");
  text = text.replace(/^(of|using|featuring|with|showing|depicting|displaying)\s+/i, "");

  // 6. Strip subject actor prefixes like "a woman with", "a model with"
  text = text.replace(/^(a woman with|a model with|a girl with|a person with|woman with|model with)\s+/i, "");

  // 7. Strip trailing camera and lens specs
  text = text.replace(/(,\s*)?(shot on|shot with|photographed with|taken with|captured with|using|85mm|50mm|f1\.4|f\/1\.4|canon|hasselblad|sony|nikon|studio lighting|natural lighting).*$/i, "");

  // 8. Normalize spacing
  text = text.replace(/\s{2,}/g, " ").trim();

  return text.length >= 3 ? text : rawPrompt.replace(/#/g, "").trim();
}

/**
 * Intelligent keyword and subject extractor from any prompt
 */
export function extractCoreKeywords(prompt: string): { targetKeyword: string; secondaryKeywords: string[] } {
  const clean = cleanPromptSubject(prompt).toLowerCase().replace(/#/g, "");

  const words = clean.split(/\s+/).filter(Boolean);
  const stopWords = new Set([
    "a", "an", "the", "in", "on", "at", "by", "for", "with", "about", "against",
    "between", "into", "through", "during", "before", "after", "above", "below",
    "to", "from", "up", "down", "out", "off", "over", "under", "again", "further",
    "then", "once", "and", "or", "of", "using"
  ]);
  
  let startIdx = 0;
  while (startIdx < words.length && stopWords.has(words[startIdx])) {
    startIdx++;
  }

  const candidateWords = words.slice(startIdx);

  // Check if there is an explicit room or subject noun in the prompt
  const roomMatches = [
    { key: "bathroom", check: /\b(bathroom|master bath(room)?|powder room|guest bath)\b/i },
    { key: "kitchen", check: /\b(kitchen|open concept kitchen|kitchen island)\b/i },
    { key: "living room", check: /\b(living room|lounge|family room)\b/i },
    { key: "bedroom", check: /\b(bedroom|master bedroom|guest bedroom)\b/i },
    { key: "dining room", check: /\b(dining room|dining area)\b/i },
    { key: "entryway", check: /\b(entryway|foyer|mudroom)\b/i },
    { key: "patio", check: /\b(patio|backyard|terrace|outdoor living)\b/i },
    { key: "closet", check: /\b(closet|walk-in closet|wardrobe)\b/i },
    { key: "hair", check: /\b(balayage|curls|bob haircut|updo|ponytail|hair)\b/i },
    { key: "nails", check: /\b(nails|manicure|nail art|french tips)\b/i },
  ];

  let detectedNoun = "";
  for (const rm of roomMatches) {
    if (rm.check.test(clean)) {
      detectedNoun = rm.key;
      break;
    }
  }

  let kwWords = candidateWords.slice(0, 3);
  if (kwWords.length === 0) kwWords = ["aesthetic", "ideas"];
  let baseKw = kwWords.join(" ").replace(/[,.:;!?'"]/g, "").trim();

  let targetKeyword = baseKw;
  if (baseKw.split(/\s+/).length < 3 && detectedNoun && !baseKw.includes(detectedNoun)) {
    // Append the detected subject noun if baseKw only has adjectives
    targetKeyword = `${baseKw} ${detectedNoun}`;
  }

  targetKeyword = targetKeyword.replace(/#/g, "").trim();

  const secondaryKeywords = [
    `${targetKeyword} ideas`,
    `${targetKeyword} aesthetic`,
    `how to style ${targetKeyword}`,
  ];

  if (candidateWords.length > 3) {
    const nextPhrase = candidateWords.slice(3, 6).join(" ").replace(/[,.:;!?'"]/g, "").trim();
    if (nextPhrase.length > 2) {
      secondaryKeywords[2] = `modern ${nextPhrase}`;
    }
  }

  return { targetKeyword, secondaryKeywords };
}

/**
 * Robust rule-based fallback when OpenRouter is unavailable or in mock mode.
 * GUARANTEE: Text model failure NEVER fails an image generation job!
 * Generates deeply niche-tailored SEO metadata (not generic lifestyle filler).
 */
export function generateRuleBasedSeo(ctx: SeoContext): SeoMetadata {
  const { targetKeyword, secondaryKeywords } = extractCoreKeywords(ctx.prompt);
  const capWord = (s: string) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const strategy = detectNicheStrategy(ctx.prompt, ctx.niche);

  let title = `${capWord(targetKeyword)}: Inspiring Ideas & Inspo`;
  let description = `Looking for the best ${targetKeyword} ideas? Discover curated ${secondaryKeywords[0]} and stunning ${secondaryKeywords[1]} to inspire your next project. Save this pin for daily inspiration!`;
  let altText = `Detailed visual of ${ctx.prompt.slice(0, 140)}, showcasing creative ${targetKeyword} aesthetics with natural lighting.`;
  let hashtags = [
    targetKeyword.replace(/[^a-z0-9]/g, ""),
    secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
    "pinterestinspired",
    "aestheticvibes",
    "dailyinspo",
  ].filter(Boolean);
  let boardSuggestion = capWord(targetKeyword);

  if (strategy.id === "hairstyles") {
    title = ctx.pinType?.includes("Listicle")
      ? `${capWord(targetKeyword)}: 10 Hair Inspo Ideas to Save`
      : `${capWord(targetKeyword)}: Trending Hair Inspiration & Color Ideas`;
    description = `Looking for gorgeous ${targetKeyword} ideas? Discover rich ${secondaryKeywords[0]} and stunning ${secondaryKeywords[1]} to inspire your next hair transformation. Perfect for your next salon visit. Save this pin for hair inspiration!`;
    altText = `Close-up beauty portrait showcasing ${targetKeyword} with dimensional color, healthy shine, and effortless styling.`;
    hashtags = [
      targetKeyword.replace(/[^a-z0-9]/g, ""),
      secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
      "hairinspo",
      "hairgoals",
      "hairstyleideas",
    ].filter(Boolean);
    boardSuggestion = "Hairstyles & Hair Colors";
  } else if (strategy.id === "nails") {
    title = `${capWord(targetKeyword)}: Chic Manicure & Nail Art Ideas`;
    description = `Looking for chic ${targetKeyword} ideas? Discover stunning ${secondaryKeywords[0]} and trendy ${secondaryKeywords[1]} to show your nail tech next. Save this pin to your manicure inspo board!`;
    altText = `Close-up view of ${targetKeyword} manicure with high-gloss finish and clean aesthetic details.`;
    hashtags = [
      targetKeyword.replace(/[^a-z0-9]/g, ""),
      secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
      "nailinspo",
      "manicureideas",
      "nailart",
    ].filter(Boolean);
    boardSuggestion = "Nail Art & Manicure Ideas";
  } else if (strategy.id === "homedecor") {
    const lowerP = ctx.prompt.toLowerCase();
    if (lowerP.includes("kitchen")) {
      const isBlue = lowerP.includes("blue");
      const isWood = lowerP.includes("wood") || lowerP.includes("walnut") || lowerP.includes("oak");
      const subStyle = isBlue && isWood
        ? "with Dusty Blue Cabinets & Warm Wood"
        : isWood
        ? "with Warm Wood Accents"
        : "Ideas for Modern Homes";

      title = `${capWord(targetKeyword)} ${subStyle}`;
      description = `Dreaming of an open-concept kitchen that feels warm, colorful, and beautifully connected to your home? Explore this space featuring dusty blue shaker cabinets, a rich walnut kitchen island, creamy limestone countertops, and handmade tile backsplash. Save these open kitchen design ideas for inspiration for your kitchen remodel or home renovation!`;
      altText = `Open-concept kitchen with dusty blue shaker cabinets, a walnut-paneled island with creamy stone countertops, handmade ivory backsplash tiles, and natural lighting.`;
      hashtags = [
        "OpenConceptKitchen",
        "KitchenDesign",
        "KitchenDecor",
        "BlueKitchenCabinets",
        "KitchenIsland",
        "HomeDecor",
        "KitchenInspiration",
        "InteriorDesign",
      ];
      boardSuggestion = "Open Concept Kitchen Ideas";
    } else if (lowerP.includes("bathroom") || lowerP.includes("bath") || lowerP.includes("vanity") || lowerP.includes("shower") || lowerP.includes("tub")) {
      const isLuxury = lowerP.includes("luxury") || lowerP.includes("traditional") || lowerP.includes("master");
      const isModern = lowerP.includes("modern") || lowerP.includes("minimalist");
      const subStyle = isLuxury
        ? "Ideas with Freestanding Tub & Double Vanity"
        : isModern
        ? "Ideas with Sleek Stone & Walk-In Shower"
        : "Makeover Ideas for a Spa Retreat";

      title = `${capWord(targetKeyword)} ${subStyle}`;
      description = `Dreaming of an elegant bathroom retreat? Explore this ${targetKeyword} featuring a freestanding soaking tub, rich wood double vanity, frameless glass shower, marble tile flooring, and warm ambient sconces. Save this pin for your bathroom remodel and master suite inspiration!`;
      altText = `Luxury traditional master bathroom featuring a double vanity with stone countertops, freestanding soaking tub in an arched window alcove, and marble floor tile rug.`;
      hashtags = [
        "BathroomIdeas",
        "BathroomRemodel",
        "BathroomDesign",
        "MasterBathroom",
        "LuxuryBathroom",
        "TraditionalBathroom",
        "BathroomInspo",
        "HomeDecor",
      ];
      boardSuggestion = "Bathroom Remodel & Decor Ideas";
    } else if (lowerP.includes("living room") || lowerP.includes("living")) {
      title = `${capWord(targetKeyword)}: Cozy & Inspiring Layouts`;
      description = `Transform your living room with these curated ${targetKeyword} ideas. Explore smart layouts, warm neutral layers, and welcoming decor to make your home feel bright and spacious. Save this pin for your next home refresh!`;
      altText = `Sun-drenched living room showcasing ${targetKeyword} with cozy seating, layered textiles, and soft window daylight.`;
      hashtags = ["LivingRoomIdeas", "LivingRoomDecor", "CozyHome", "HomeDecor", "InteriorStyling"];
      boardSuggestion = "Living Room Inspo & Decor";
    } else if (lowerP.includes("bedroom")) {
      title = `${capWord(targetKeyword)}: Sanctuary Inspo & Styling Ideas`;
      description = `Create your dream bedroom retreat with these ${targetKeyword} ideas. Discover layered bedding, ambient lighting, and serene textures for restful nights. Save this pin to your bedroom board!`;
      altText = `Cozy bedroom sanctuary featuring ${targetKeyword} with soft ambient illumination and serene styling.`;
      hashtags = ["BedroomIdeas", "BedroomDecor", "CozyBedroom", "AestheticBedroom", "HomeInspo"];
      boardSuggestion = "Bedroom Inspo & Makeovers";
    } else {
      title = `${capWord(targetKeyword)}: Inspiring Decor & Interior Ideas`;
      description = `Transform your space with curated ${targetKeyword} ideas. Discover beautiful accents and cozy styling to make your home feel bright and beautifully designed. Save this pin for home inspiration!`;
      altText = `Architectural interior view featuring ${targetKeyword} with warm textures, spatial styling, and natural ambient daylight.`;
      hashtags = ["HomeDecor", "InteriorIdeas", "CozyHome", "InteriorStyling", "AestheticSpace"];
      boardSuggestion = "Home Decor & Styling";
    }
  } else if (strategy.id === "crafts") {
    title = `${capWord(targetKeyword)}: Creative DIY Ideas & Tutorials`;
    description = `Discover easy and inspiring ${targetKeyword} projects. Explore step-by-step ${secondaryKeywords[0]} and creative ${secondaryKeywords[1]} using simple materials. Perfect for handmade craft enthusiasts. Save this pin for your next DIY day!`;
    altText = `Artisan craft workspace demonstrating ${targetKeyword} with tangible materials and handmade craftsmanship.`;
    hashtags = [
      targetKeyword.replace(/[^a-z0-9]/g, ""),
      secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
      "diycrafts",
      "handmadeart",
      "craftideas",
    ].filter(Boolean);
    boardSuggestion = "DIY Crafts & Handmade Art";
  } else if (strategy.id === "food") {
    title = `${capWord(targetKeyword)}: Easy Delicious Recipe Ideas`;
    description = `Craving something incredible? Try this flavorful ${targetKeyword} recipe idea. Discover quick ${secondaryKeywords[0]} and simple ${secondaryKeywords[1]} with rich comforting flavors. Save this pin to your recipe board!`;
    altText = `Appetizing culinary presentation of ${targetKeyword} garnished with fresh herbs in natural soft light.`;
    hashtags = [
      targetKeyword.replace(/[^a-z0-9]/g, ""),
      secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
      "easyrecipes",
      "foodinspo",
      "deliciousrecipes",
    ].filter(Boolean);
    boardSuggestion = "Delicious Recipes & Food Ideas";
  } else if (strategy.id === "fashion") {
    title = `${capWord(targetKeyword)}: Chic Outfit & Styling Formula`;
    description = `Upgrade your daily wardrobe with these ${targetKeyword} ideas. Discover curated ${secondaryKeywords[0]} and elevated ${secondaryKeywords[1]} to look effortlessly chic. Save this pin for fashion inspiration!`;
    altText = `Street style editorial showcasing ${targetKeyword} with effortless fabric drape and chic aesthetic styling.`;
    hashtags = [
      targetKeyword.replace(/[^a-z0-9]/g, ""),
      secondaryKeywords[0].replace(/[^a-z0-9]/g, ""),
      "outfitinspo",
      "fashionideas",
      "styleinspo",
    ].filter(Boolean);
    boardSuggestion = "Outfit Inspo & Style Ideas";
  }

  const rawSeo = {
    targetKeyword,
    secondaryKeywords,
    title,
    description,
    altText,
    hashtags,
    boardSuggestion,
  };

  const fixed = validateAndFixSeo(rawSeo);
  const score = calculateSeoScore(fixed, ctx.prompt);

  return {
    ...fixed,
    seoScore: score,
  };
}

/**
 * Generates structured Pinterest SEO metadata using OpenRouter free models with fallback chain.
 */
export async function generatePinterestSeo(ctx: SeoContext): Promise<SeoMetadata> {
  const isMock = process.env.PROVIDER_MODE === "mock" || !ctx.openrouterApiKey;
  if (isMock) {
    return generateRuleBasedSeo(ctx);
  }

  const cleanSubject = cleanPromptSubject(ctx.prompt);
  const strategy = detectNicheStrategy(ctx.prompt, ctx.niche);

  const preferredModel =
    ctx.primaryModel && ctx.primaryModel !== "auto:deepseek-gpt"
      ? ctx.primaryModel
      : "deepseek/deepseek-r1:free";

  const modelChain = [
    preferredModel,
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-3.5-lightning:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "google/gemma-4-31b-it:free",
    "google/gemini-2.0-flash-exp:free",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const systemPrompt = `You are an elite Pinterest SEO copywriter and visual search engine optimization expert.
Pinterest operates as a visual search engine. Every pin must have deeply targeted metadata tailored precisely to the image subject.

CRITICAL SEARCH ENGINE & KEYWORD EXTRACTION RULES:
1. Target Keyword MUST represent the real physical subject: "${cleanSubject}" (e.g. 'chocolate brown wavy hair', 'almond chrome nails', 'japandi living room').
2. NEVER include command verbs or quality filler phrases (e.g. NEVER use 'create', 'generate', 'render', 'ultra-realistic', 'high-end', 'editorial', '8k', 'shot on', 'photo of') in targetKeyword, title, or hashtags.
3. The description MUST be deeply tailored to the niche: "${strategy.name}". E.g. salon transformation ideas for hair, manicures for nails, room decor for interior design, DIY guides for crafts. NEVER mention unrelated niches (e.g. NEVER mention home decor in a hairstyle pin).

For the provided image prompt, generate JSON strictly adhering to:
{
  "targetKeyword": "Primary search phrase representing the core subject (2-4 words, e.g. 'chocolate brown wavy hair')",
  "secondaryKeywords": ["related search phrase 1", "related search phrase 2", "related search phrase 3"],
  "title": "Click-worthy title between 40 and 95 characters. CRITICAL RULE: Target keyword MUST be placed in the first 40 characters (e.g. 'Target Keyword: 10 Inspiring Ideas')",
  "description": "Engaging 2-3 sentence description between 200 and 450 characters. Sentence 1 must feature the targetKeyword. Sentence 2 must naturally weave in secondaryKeywords. Sentence 3 must provide a soft Pinterest CTA ('Save this pin...'). Tailored strictly to ${strategy.name}. NO hashtags inside the description body.",
  "altText": "Literal descriptive accessibility text between 120 and 250 characters describing visual textures, colors, and setting while mentioning target keyword",
  "hashtags": ["3-5 lowercase alphanumeric tags strictly related to the subject, without spaces or hashes"],
  "boardSuggestion": "Relevant Pinterest board name"
}`;

  const userPrompt = `Pin core subject: "${cleanSubject}"\nFull image prompt: "${ctx.prompt}"\nPin type: ${ctx.pinType || "Inspiration"}\nNiche: ${strategy.name}`;

  for (const model of modelChain) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 14000);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ctx.openrouterApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.5,
          max_tokens: 600,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content || "";

      // Clean JSON fences
      const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.title && parsed.description && parsed.targetKeyword) {
        // Sanitize targetKeyword if model accidentally included command verbs or hashes
        let safeKw = (parsed.targetKeyword || "").replace(/#/g, "").trim();
        if (/^(create|generate|make|render|ultra|high-end)/i.test(safeKw)) {
          safeKw = cleanSubject.split(/\s+/).slice(0, 3).join(" ");
        }

        const cleanTitle = (parsed.title || "").replace(/#/g, "").trim();
        const cleanDesc = (parsed.description || "").replace(/#/g, "").trim();
        const cleanAlt = (parsed.altText || cleanDesc.slice(0, 180)).replace(/#/g, "").trim();

        const fixed = validateAndFixSeo({
          targetKeyword: safeKw,
          secondaryKeywords: Array.isArray(parsed.secondaryKeywords)
            ? parsed.secondaryKeywords.map((k: string) => String(k).replace(/#/g, "").trim())
            : [],
          title: cleanTitle,
          description: cleanDesc,
          altText: cleanAlt,
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
          boardSuggestion: (parsed.boardSuggestion || strategy.name).replace(/#/g, "").trim(),
        });

        const score = calculateSeoScore(fixed, ctx.prompt);
        return {
          ...fixed,
          seoScore: score,
        };
      }
    } catch {
      // Fall through to next model in chain
    }
  }

  // Last resort rule-based fallback
  return generateRuleBasedSeo(ctx);
}

/**
 * Generates punchy overlay hook headline (4-8 words) based on prompt & niche
 */
export function generateOverlayHook(prompt: string, pinType = "Inspiration", niche?: string): string {
  const words = prompt.trim().split(/\s+/);
  const coreSubject = words.slice(0, 3).join(" ");
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (pinType.toLowerCase().includes("listicle")) {
    return `10 Genius ${cap(coreSubject)} Ideas`;
  }
  if (pinType.toLowerCase().includes("how-to") || pinType.toLowerCase().includes("tutorial")) {
    return `How to Style ${cap(coreSubject)}`;
  }
  if (pinType.toLowerCase().includes("recipe") || pinType.toLowerCase().includes("guide")) {
    return `Easy 15-Minute ${cap(coreSubject)}`;
  }
  if (pinType.toLowerCase().includes("before")) {
    return `${cap(coreSubject)} Before & After`;
  }

  const content = getNicheOverlayContent(prompt, { pinType, niche });
  return content.fullHook;
}

export function generateFullNicheOverlayContent(
  prompt: string,
  niche?: string,
  preset?: string,
  pinType?: string,
  customHook?: string
): CatchyOverlayContent {
  return getNicheOverlayContent(prompt, { niche, preset, pinType, customHook });
}
