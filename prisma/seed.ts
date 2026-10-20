import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PinForge database...");

  // 1. Seed Settings (Single-user default row)
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      defaultTextModel: "google/gemini-2.0-flash-exp:free",
      defaultImageModel: "runware:100@1",
      currency: "USD",
      timezone: "UTC",
      monthlyBudget: 50.0,
      maxConcurrency: 3,
    },
  });

  // 2. Seed ModelRegistry (Spec Section 9.1)
  const models = [
    {
      id: "flux-schnell",
      label: "FLUX.1 Schnell",
      tier: "Draft",
      runwareModelId: "runware:100@1",
      pricePerImage: 0.0019,
      supportsSeedImage: false,
      supportsNegativePrompt: false,
      nativeSizes: JSON.stringify([
        { w: 768, h: 1152 },
        { w: 1024, h: 1024 },
        { w: 576, h: 1024 },
      ]),
      avgSeconds: 3,
      maxPromptLength: 1000,
      notes: "Ultra-fast generation, perfect for high-volume idea drafts.",
    },
    {
      id: "sdxl-base",
      label: "Stable Diffusion XL 1.0",
      tier: "Standard",
      runwareModelId: "civitai:101055@128078",
      pricePerImage: 0.0030,
      supportsSeedImage: true,
      supportsNegativePrompt: true,
      nativeSizes: JSON.stringify([
        { w: 768, h: 1152 },
        { w: 1024, h: 1024 },
        { w: 832, h: 1024 },
      ]),
      avgSeconds: 6,
      maxPromptLength: 1500,
      notes: "Standard workhorse, full negative prompt & seed image support.",
    },
    {
      id: "flux-dev",
      label: "FLUX.1 Dev",
      tier: "Premium",
      runwareModelId: "runware:101@1",
      pricePerImage: 0.0096,
      supportsSeedImage: true,
      supportsNegativePrompt: false,
      nativeSizes: JSON.stringify([
        { w: 768, h: 1152 },
        { w: 1024, h: 1024 },
        { w: 576, h: 1024 },
      ]),
      avgSeconds: 12,
      maxPromptLength: 2000,
      notes: "Industry-leading image realism and photorealism for viral pins.",
    },
    {
      id: "gpt-image-2",
      label: "GPT Image 2",
      tier: "GPT Image 2",
      runwareModelId: "openai:gpt-image@2",
      pricePerImage: 0.0060,
      supportsSeedImage: false,
      supportsNegativePrompt: false,
      nativeSizes: JSON.stringify([
        { w: 1024, h: 1792 },
        { w: 1024, h: 1024 },
      ]),
      avgSeconds: 28,
      maxPromptLength: 3000,
      notes: "Highest text accuracy in-image; slower generation time.",
    },
    {
      id: "eco-wan",
      label: "Wan 2.1 Fast",
      tier: "Eco",
      runwareModelId: "runware:100@1",
      pricePerImage: 0.0015,
      supportsSeedImage: false,
      supportsNegativePrompt: true,
      nativeSizes: JSON.stringify([
        { w: 768, h: 1152 },
        { w: 512, h: 768 },
      ]),
      avgSeconds: 2,
      maxPromptLength: 600,
      notes: "Maximum cost savings for high-scale testing.",
    },
  ];

  for (const m of models) {
    await prisma.modelRegistry.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }

  // 3. Seed PinTypes (Spec Section 26)
  const pinTypes = [
    {
      id: "listicle",
      name: "Listicle",
      compositionRule: "clean flat-lay or room scene with space for large headline, uncluttered",
      defaultOverlay: "number_pop",
      titleFormulas: JSON.stringify([
        "{N} {keyword} ideas that {benefit}",
        "{N} stunning {keyword} designs you need to see",
      ]),
      hookPatterns: JSON.stringify(["{N} Genius Ways", "{N} Best Ideas", "Top {N} Rules"]),
      defaultTextMode: "canvas",
    },
    {
      id: "how_to",
      name: "How-to / Tutorial",
      compositionRule: "step-in-action scene, hands/process visible, bright natural light",
      defaultOverlay: "bold_modern",
      titleFormulas: JSON.stringify([
        "How to {outcome} (easy {keyword} guide)",
        "The step-by-step guide to {keyword}",
      ]),
      hookPatterns: JSON.stringify(["How to Do It", "Simple 3-Step Guide", "Master {keyword}"]),
      defaultTextMode: "canvas",
    },
    {
      id: "inspiration",
      name: "Inspiration / Aesthetic",
      compositionRule: "single hero subject, strong mood, minimal text space",
      defaultOverlay: "scrim_editorial",
      titleFormulas: JSON.stringify([
        "{Mood} {keyword} you will want to save",
        "Dreamy {keyword} aesthetic for your home",
      ]),
      hookPatterns: JSON.stringify(["Save for Later", "Dream Aesthetic", "Pure Inspo"]),
      defaultTextMode: "canvas",
    },
    {
      id: "product",
      name: "Product / Showcase",
      compositionRule: "product centered, studio/lifestyle backdrop, sharp detail",
      defaultOverlay: "bottom_bar",
      titleFormulas: JSON.stringify([
        "{Product}: {benefit} {keyword}",
        "The ultimate {keyword} collection",
      ]),
      hookPatterns: JSON.stringify(["Shop The Look", "Featured Pick", "Must-Have"]),
      defaultTextMode: "none",
    },
    {
      id: "quote",
      name: "Quote",
      compositionRule: "soft textured background, wide empty center",
      defaultOverlay: "script_romance",
      titleFormulas: JSON.stringify([
        "{short quote}",
        "Words to inspire your {keyword} journey",
      ]),
      hookPatterns: JSON.stringify(["Daily Reminder", "Words of Wisdom", "Truth"]),
      defaultTextMode: "canvas",
    },
    {
      id: "infographic",
      name: "Infographic-style",
      compositionRule: "structured layout, icons, clear zones",
      defaultOverlay: "solid_block",
      titleFormulas: JSON.stringify([
        "{keyword}: {n} quick facts",
        "The anatomy of a perfect {keyword}",
      ]),
      hookPatterns: JSON.stringify(["Quick Cheat Sheet", "What You Need To Know", "The Breakdown"]),
      defaultTextMode: "canvas",
    },
    {
      id: "before_after",
      name: "Before/After",
      compositionRule: "split composition left/right same subject",
      defaultOverlay: "accent_underline",
      titleFormulas: JSON.stringify([
        "{keyword} before & after",
        "Unbelievable {keyword} transformation",
      ]),
      hookPatterns: JSON.stringify(["Before & After", "The Transformation", "See The Change"]),
      defaultTextMode: "canvas",
    },
    {
      id: "recipe",
      name: "Recipe / Step",
      compositionRule: "overhead food shot, natural props, steam/freshness cues",
      defaultOverlay: "frosted_glass",
      titleFormulas: JSON.stringify([
        "{Dish} recipe ({time} min)",
        "The easiest {keyword} recipe ever",
      ]),
      hookPatterns: JSON.stringify(["Quick & Easy", "Delicious Recipe", "Ready in 15 Min"]),
      defaultTextMode: "canvas",
    },
    {
      id: "comparison",
      name: "Comparison",
      compositionRule: "two subjects side by side, symmetrical",
      defaultOverlay: "outline_punch",
      titleFormulas: JSON.stringify([
        "{A} vs {B}: which is better?",
        "{keyword} comparison: what actually works",
      ]),
      hookPatterns: JSON.stringify(["Which is Better?", "Side by Side", "The Real Difference"]),
      defaultTextMode: "canvas",
    },
    {
      id: "tips_mistakes",
      name: "Tips & Mistakes",
      compositionRule: "subject with subtle caution/checklist feel",
      defaultOverlay: "bold_modern",
      titleFormulas: JSON.stringify([
        "{N} {keyword} mistakes to avoid",
        "Stop making these {keyword} mistakes today",
      ]),
      hookPatterns: JSON.stringify(["Mistakes to Avoid", "Do This Not That", "Beginner Traps"]),
      defaultTextMode: "canvas",
    },
  ];

  for (const pt of pinTypes) {
    await prisma.pinType.upsert({
      where: { id: pt.id },
      update: pt,
      create: pt,
    });
  }

  // 4. Default Niches & Template example
  const decorNiche = await prisma.niche.upsert({
    where: { name: "Home Decor" },
    update: {},
    create: {
      name: "Home Decor",
      isCustom: false,
    },
  });

  await prisma.niche.upsert({
    where: { name: "Vegan Recipes" },
    update: {},
    create: {
      name: "Vegan Recipes",
      isCustom: false,
    },
  });

  await prisma.template.create({
    data: {
      nicheId: decorNiche.id,
      name: "Scandinavian Living Room",
      systemPrompt: `ROLE: You are a Pinterest visual strategist for Scandinavian home decor.
AUDIENCE: Women 25–45 renovating small apartments; search intent = ideas, shopping, DIY.
VISUAL IDENTITY: white/oak/charcoal, natural daylight, linen, wool throws, plants, clean lines.
MUST INCLUDE: real-life lived-in feel, natural textures, balanced negative space.
MUST AVOID: clutter, neon colors, text/watermarks, people faces, brand logos.
COMPOSITION: Listicle = full-room wide shot; How-to = detail close-up of the element; Inspiration = styled vignette.
DIVERSITY: every pin must differ in room area, angle, or featured object.
KEYWORD THEMES: scandinavian living room, small space decor, hygge, minimalist decor.`,
      styleNotes: "Focus on serene, bright lighting with gentle morning daylight.",
      forbiddenElements: JSON.stringify(["clutter", "neon colors", "people faces", "watermarks"]),
      keywordSeeds: JSON.stringify([
        "scandinavian living room",
        "small space decor",
        "hygge apartment",
        "minimalist living room",
        "nordic aesthetic interior",
      ]),
      defaultPinTypes: JSON.stringify({
        listicle: 40,
        inspiration: 30,
        how_to: 30,
      }),
      version: 1,
    },
  });

  // 5. Seed Starter Brand Kit
  const existingKit = await prisma.brandKit.findFirst();
  if (!existingKit) {
    await prisma.brandKit.create({
      data: {
        kitName: "Nordic Nest",
        brandName: "Nordic Nest Decor",
        websiteUrl: "https://nordicnest.example.com",
        styleVibe: "minimalist scandi",
        customAdjectives: JSON.stringify(["minimal", "clean", "airy", "tactile"]),
        fontFamily: "Playfair Display",
        overlayPreset: "scrim_editorial",
        palette: JSON.stringify(["#F8F5EB", "#2D2D30", "#C8553D", "#9AAC93", "#E1D7C3"]),
        brandVoice: "serene, aesthetic, and welcoming design curation",
        ctaPresets: JSON.stringify(["Shop Nordic Living", "Read Full Styling Guide", "Save This Space"]),
        defaultAspect: "2:3",
        defaultModel: "Standard",
        utmTemplate: "?utm_source=pinterest&utm_medium=pin&utm_campaign={niche}",
      },
    });
  }

  console.log("Database seeded successfully with models, pin types, settings, and starter niche!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
