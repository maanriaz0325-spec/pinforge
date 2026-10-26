/**
 * Standalone Niche Intelligence & Visual Strategy Engine
 * 
 * Provides deep niche-specific strategies for:
 * 1. Hairstyle & Haircare (Real hair texture, diverse ethnicities, distinct backgrounds, anti-plastic)
 * 2. Nail Art & Nails (Natural hand skin, realistic cuticles, precision nail art, diverse poses)
 * 3. Home Decor & Interior Design (Diverse room layouts, multiple decor styles, varied supporting items, rich lighting)
 * 4. Crafting, DIY & Handmade Art (Tangible craft materials, macro workshop details, authentic hands-at-work)
 * 5. Fashion & Outfits (Real street style, fabric drape, seasonal styling, urban backdrops)
 * 6. Food, Baking & Recipes (Culinary macro, fresh garnishes, steam, rustic stoneware)
 * 7. Beauty, Skincare & Wellness (Natural skin micro-pores, glass bottles, spa atmosphere)
 */

export interface NicheStrategy {
  id: string;
  name: string;
  aliases: string[];
  coreFocus: string;
  realismDirectives: string;
  negativePromptAnchors: string;
  backgroundVariations: string[];
  supportingElements: string[];
  audienceIntents: Array<{
    intent: "dreamy" | "realistic" | "functional" | "luxury" | "budget";
    label: string;
    keywords: string;
  }>;
}

export interface CatchyOverlayContent {
  kicker?: string;
  mainTitle: string;
  accentScript?: string;
  subtitle?: string;
  footerBullets?: string[];
  iconsList?: Array<{ icon: "home" | "storage" | "light" | "heart" | "star" | "scissors" | "sparkles"; text: string }>;
  fullHook: string;
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

export const NICHE_STRATEGIES: Record<string, NicheStrategy> = {
  hairstyles: {
    id: "hairstyles",
    name: "Hairstyle Ideas & Hair Care",
    aliases: ["hair", "hairstyle", "haircut", "curls", "balayage", "braid", "bob", "blonde", "brunette", "updo", "ponytail"],
    coreFocus: "Camera angle explicitly focused on hairstyle: 45-degree three-quarter beauty perspective or over-the-shoulder cascade showcasing hair volume, dimensional layers, and texture. Crisp separation of individual hair strands, realistic wisps and fine flyaway baby hairs at hairline and temples, multi-tonal dimensional high-and-lowlights catching natural sunlight, organic hair movement and healthy silky shine, accurate cut silhouette",
    realismDirectives: "Authentic human features with natural skin texture, visible fine skin micro-pores, natural skin undertones, candid relaxed facial expression (soft subtle half-smile or serene candid profile, asymmetric natural human expression), lifelike soft catchlights in eyes, authentic lips with natural texture. ZERO plastic porcelain doll skin, ZERO over-smoothed AI airbrushing, ZERO synthetic mannequin perfection. Shot with an 85mm f/1.4 portrait prime lens in soft directional natural window daylight, shallow depth of field with creamy organic background bokeh",
    negativePromptAnchors: "plastic hair, stiff synthetic wig, single-color plastic block hair, bad hairline, bald spots, airbrushed poreless skin, plastic porcelain doll face, uncanny valley symmetry, oversaturated neon, fake CGI shine, digital illustration, 3d render, distorted anatomy, extra fingers, dead stare",
    backgroundVariations: [
      "sunlit minimalist Parisian balcony with soft stone architecture and sheer curtains",
      "bright airy modern hair salon with warm oak mirrors and indoor plants",
      "cozy sun-drenched Scandinavian apartment bedroom with white linen curtains",
      "urban outdoor cafe terrace in golden afternoon sunlight",
      "lush green botanical garden walkway with soft diffused daylight",
      "chic modern loft with exposed warm brick and industrial black framed windows",
      "clean aesthetic studio with gentle beige linen backdrop and softbox illumination",
      "warm golden hour sunset lighting on a gentle coastal breeze",
    ],
    supportingElements: [
      "delicate gold huggie earrings",
      "tortoiseshell hair claw clip resting on an oak vanity",
      "silk scrunchie on wrist",
      "soft ribbed knit cream sweater",
      "chic oversized linen blazer",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Dreamy & Aesthetic", keywords: "effortless, soft waves, glowing golden hour, romantic, ethereal" },
      { intent: "realistic", label: "Everyday & Relatable", keywords: "low maintenance, everyday wear, wearable chic, effortless morning routine" },
      { intent: "functional", label: "Step-by-Step Styling", keywords: "how to style, 5-minute quick updo, heatless curls, hair health tips" },
      { intent: "luxury", label: "High-End Salon", keywords: "dimensional balayage, glass hair finish, editorial precision cut, salon luxury" },
      { intent: "budget", label: "Budget-Friendly / At Home", keywords: "at-home styling, affordable drugstore favorites, DIY heatless hacks" },
    ],
  },

  nails: {
    id: "nails",
    name: "Nail Art & Manicure",
    aliases: ["nail", "nails", "manicure", "nailart", "gel nails", "acrylic", "french tip", "almond nails", "press-on"],
    coreFocus: "Exquisite nail art precision, high-gloss gel or velvet matte finish, clean cuticle beds, razor-sharp edge shaping (almond, square, coffin, oval)",
    realismDirectives: "Authentic human hands with realistic skin micro-pores, natural knuckle creases and subtle skin tone gradients, elegant natural finger poses (gently cupping an artisan ceramic mug, resting on washed linen, or holding fine jewelry), no mutant or extra fingers, no plastic doll skin",
    negativePromptAnchors: "deformed fingers, extra digits, missing fingers, warped hands, plastic fingers, cartoon, 3d render, blurry cuticles, smeared polish",
    backgroundVariations: [
      "textured artisan oatmeal ceramic mug cupped softly in hands on an oak table",
      "crisp white washed French linen tablecloth with dappled morning sunlight",
      "smooth travertine marble tabletop with delicate gold jewelry accents",
      "cozy chunky knit wool sweater sleeve with soft indoor morning light",
      "modern minimalist nail studio setting with neutral terrazzo surface",
      "aesthetic beige silk fabric folds in soft directional window light",
    ],
    supportingElements: [
      "dainty gold stackable rings",
      "frosted glass iced matcha latte",
      "matte ceramic coffee cup",
      "raw edge linen napkin",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Aesthetic Inspo", keywords: "glazed donut chrome, pastel aura, milky french, dreamy celestial details" },
      { intent: "realistic", label: "Short Natural Nails", keywords: "clean girl aesthetic, short almond, natural nude, everyday chic" },
      { intent: "functional", label: "DIY Press-On / Guide", keywords: "how to prep, long-lasting press on routine, at home gel manicure" },
      { intent: "luxury", label: "Salon Masterpiece", keywords: "intricate 3D gel art, micro chrome accents, luxury editorial nails" },
      { intent: "budget", label: "Budget Friendly", keywords: "easy beginner nail art, drugstore dupes, 10-minute nail look" },
    ],
  },

  homedecor: {
    id: "homedecor",
    name: "Home Decor & Interior Design",
    aliases: ["decor", "home", "living room", "bedroom", "kitchen", "apartment", "interior", "furniture", "bathroom", "entryway", "dining", "patio"],
    coreFocus: "Architectural spatial harmony, rich layered interior styling, tangible textures (bouclé, natural oak, brushed brass, raw ceramics, fluted glass), lived-in welcoming warmth",
    realismDirectives: "True-to-life interior photography, natural architectural light pouring through windows, accurate perspective and spatial depth, realistic fabric folds and authentic wood grains, no floating or warped furniture, no uncanny AI CGI glow",
    negativePromptAnchors: "warped furniture, impossible architecture, crooked walls, 3d render, fake plastic textures, low poly, oversaturated, blurry",
    backgroundVariations: [
      "sun-drenched Scandinavian living room with floor-to-ceiling windows and sheer linen curtains",
      "cozy modern Japandi apartment with low wood platform, bonsai branch, and warm paper pendant",
      "airy contemporary California modern home with high vaulted ceilings and light oak floors",
      "moody Parisian historic apartment with ornate crown molding and herringbone parquet floors",
      "cozy compact urban studio apartment with genius multi-functional zoning and floating shelves",
      "warm rustic modern farmhouse kitchen with open oak shelving, copper pots, and stone backsplash",
      "peaceful sanctuary bedroom with layered neutral bedding and soft morning window light",
      "serene spa-like bathroom with freestanding tub, fluted wood vanity, and micro-cement walls",
    ],
    supportingElements: [
      "sculptural ceramic vase with dried eucalyptus or olive branches",
      "artisan linen throw blanket tossed casually over sofa arm",
      "minimalist travertine coffee table styled with hardbound art books",
      "warm Noguchi paper floor lamp casting gentle ambient illumination",
      "fluffy wool Berber area rug on natural wood plank flooring",
      "potted fiddle leaf fig in a weathered terracotta planter",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Dreamy & Aesthetic", keywords: "dream home aesthetic, golden sunlight, serene sanctuary, cozy haven" },
      { intent: "realistic", label: "Real Lived-In Homes", keywords: "renter-friendly, cozy real spaces, everyday living, clutter-free" },
      { intent: "functional", label: "Small Spaces & Storage", keywords: "small space layout, smart hidden storage, multi-functional furniture hacks" },
      { intent: "luxury", label: "High-End Luxury", keywords: "architectural digest style, bespoke finishes, designer lighting, curated art" },
      { intent: "budget", label: "Budget Friendly / DIY", keywords: "affordable makeover, budget decorating ideas, thrifted styling, DIY decor" },
    ],
  },

  crafts: {
    id: "crafts",
    name: "Crafting, DIY & Handmade Art",
    aliases: ["craft", "diy", "handmade", "art", "pottery", "clay", "embroidery", "crochet", "knitting", "woodworking", "candle", "painting", "scrapbook"],
    coreFocus: "Tangible handcrafted creations, visible authentic material textures (natural clay fingerprints, woven yarn stitches, hand-cut paper edges, watercolor pigment blooms)",
    realismDirectives: "Realistic artisan workbench atmosphere, authentic hands-at-work crafting in progress, genuine creative workspace props (cutting mats, brass scissors, spools of natural twine, paint swatches), natural warm craft studio lighting, no CGI vector look",
    negativePromptAnchors: "digital vector, plastic look, fake 3d render, distorted tools, extra fingers, cartoon, messy blurry artifacts",
    backgroundVariations: [
      "rustic sunlit wood craft workbench with scattered natural materials and tools",
      "cozy morning kitchen table with parchment paper, raw clay, and ceramic trimming tools",
      "organized Scandinavian craft room with pegboard wall, glass jars, and warm lighting",
      "boho artist studio loft with easel, watercolor palettes, and natural morning light",
      "outdoor garden potting bench with terracotta pots, dried lavender, and hand tools",
      "quaint sewing and textile nook with woven wicker baskets and spools of linen thread",
    ],
    supportingElements: [
      "vintage brass craft scissors and roll of natural jute twine",
      "ceramic palette with soft earthy watercolor puddles",
      "unfinished wood blocks or ceramic pieces showing crafting process",
      "notebook with hand-drawn pencil sketches and measurements",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Aesthetic Creations", keywords: "cottagecore handmade, aesthetic pottery, botanical pressed florals, dreamy crafts" },
      { intent: "realistic", label: "Beginner Friendly", keywords: "easy crafts for beginners, 30-minute quick project, simple supplies" },
      { intent: "functional", label: "Practical DIY Hacks", keywords: "useful handmade organizers, home organization DIY, practical wood project" },
      { intent: "luxury", label: "Artisan Craftsmanship", keywords: "bespoke pottery, fine art ceramics, heirloom embroidery, studio artisan" },
      { intent: "budget", label: "Dollar Store / Upcycle", keywords: "trash to treasure upcycle, low cost DIY, cardboard & thrift makeover" },
    ],
  },

  fashion: {
    id: "fashion",
    name: "Fashion & Outfits",
    aliases: ["fashion", "outfit", "style", "dress", "capsule", "wardrobe", "jacket", "coat", "shoes", "streetstyle"],
    coreFocus: "Flawless garment silhouette, authentic fabric weight and drape (chunky wool, crisp poplin cotton, raw denim, buttery leather), cohesive seasonal color palette",
    realismDirectives: "Real human model with natural posture and walking movement, authentic street style photography with 50mm or 85mm lens, candid expression, realistic urban environment, natural daylight",
    negativePromptAnchors: "mannequin, plastic skin, distorted limbs, AI cartoon, shiny fake clothes, 3d render, extra arms",
    backgroundVariations: [
      "chic cobblestone street in Soho New York with warm morning sunlight",
      "Parisian cafe corner with small round marble bistro table and wicker chairs",
      "minimalist architectural concrete gallery facade with clean shadow lines",
      "sun-dappled European tree-lined avenue with golden autumn leaves",
      "airy modern minimalist apartment hallway with full-length mirror",
    ],
    supportingElements: [
      "structured leather shoulder bag in rich espresso brown",
      "classic retro tortoiseshell sunglasses",
      "delicate layered gold pendant necklaces",
      "clean white designer leather sneakers or leather loafers",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Old Money / Aesthetic", keywords: "old money aesthetic, quiet luxury, neutral palette, Parisian chic" },
      { intent: "realistic", label: "Casual Everyday", keywords: "casual chic, effortless everyday outfit, school run style, comfy stylish" },
      { intent: "functional", label: "Capsule Wardrobe", keywords: "10-piece capsule wardrobe, mix and match outfit formulas, workwear essentials" },
      { intent: "luxury", label: "High-End Designer", keywords: "haute couture tailoring, runway inspired, luxury winter wool coat" },
      { intent: "budget", label: "Affordable Dupes", keywords: "look expensive on a budget, high street styling, thrifted vintage outfit" },
    ],
  },

  food: {
    id: "food",
    name: "Food, Baking & Recipes",
    aliases: ["recipe", "food", "cake", "salad", "breakfast", "dinner", "soup", "cocktail", "coffee", "baking", "dessert", "snack"],
    coreFocus: "Mouthwatering food photography, glistening freshness cues, melting textures, gentle steam wisps, artisanal plating on rustic ceramics",
    realismDirectives: "Macro culinary photography with selective shallow depth of field, authentic food ingredients (flaky sea salt crystals, micro-greens, fresh basil, cracked pepper), natural window daylight with soft bounce card, no plastic fake food",
    negativePromptAnchors: "plastic food, cartoon food, oversaturated, muddy textures, 3d render, unappetizing colors",
    backgroundVariations: [
      "rustic weathered oak kitchen table with natural daylight from the side",
      "light grey marble kitchen countertop with dusted flour and prep ingredients",
      "sunlit outdoor garden brunch table with dappled leafy shadows",
      "cozy dark moody wooden table with single warm directional spotlight",
      "clean modern ceramic tiled kitchen with copper cookware in background",
    ],
    supportingElements: [
      "antique silver vintage fork resting on a folded oatmeal linen napkin",
      "small dish of flaky Maldon sea salt and fresh thyme sprigs",
      "condensation droplets on a tall ribbed crystal glass",
      "rustic ceramic dipping bowl with cold-pressed olive oil",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Food Aesthetic", keywords: "aesthetic cafe style, artisan sourdough, cloud coffee, dreamy bakery vibes" },
      { intent: "realistic", label: "Weeknight Dinners", keywords: "20-minute weeknight dinner, one-pot comfort food, family favorite recipe" },
      { intent: "functional", label: "Meal Prep & Healthy", keywords: "high protein meal prep, gut healthy salad bowl, macro balanced meal" },
      { intent: "luxury", label: "Gourmet Dining", keywords: "Michelin star presentation, culinary art, gourmet truffle pasta" },
      { intent: "budget", label: "Cheap & Easy", keywords: "5-ingredient meal, budget friendly pantry dinner, low cost wholesome" },
    ],
  },

  beauty: {
    id: "beauty",
    name: "Beauty, Skincare & Wellness",
    aliases: ["beauty", "skincare", "skin", "serum", "facial", "glow", "wellness", "makeup", "lips", "moisturizer"],
    coreFocus: "Radiant dewy skin finish, crystal-clear glass dropper bottles, fluid serum viscosity, clean cosmetic minimalism, soothing spa tranquility",
    realismDirectives: "Macro human skin photography with authentic skin texture (pores, natural highlights, fine vellus hair), real water droplets, clean neutral softbox or morning window illumination, no plastic airbrushed porcelain look",
    negativePromptAnchors: "airbrushed, plastic face, blur skin, cartoon, 3d render, unnatural eyes, cgi",
    backgroundVariations: [
      "luxury minimalist spa bathroom with natural light travertine and water ripples",
      "sun-drenched morning vanity table with white sheer curtains and round mirror",
      "clean frosted glass shelf with subtle water condensation beads",
      "serene botanical setting with lush monstera or eucalyptus leaves softly blurred",
    ],
    supportingElements: [
      "pipette dropper dispensing a single dewy droplet of botanical oil",
      "plush white rolled cotton waffle towels",
      "sculptural gua sha stone carved from natural green jade",
      "small ceramic dish with fresh botanical petals",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Clean Girl Aesthetic", keywords: "clean girl morning glow, dewy skin finish, glass skin routine" },
      { intent: "realistic", label: "Real Skin Solutions", keywords: "acne safe routine, sensitive skin barrier repair, everyday essentials" },
      { intent: "functional", label: "Ingredient Guide", keywords: "niacinamide vs vitamin c, morning vs night routine, dermatologist tips" },
      { intent: "luxury", label: "Luxury Skincare", keywords: "botanical luxury elixir, French pharmacy cult classics, spa retreat ritual" },
      { intent: "budget", label: "Drugstore Gems", keywords: "affordable skincare routine, drugstore dupes for luxury serums" },
    ],
  },

  travel: {
    id: "travel",
    name: "Travel, Destinations & Adventure",
    aliases: ["travel", "wanderlust", "destination", "vacation", "trip", "canada", "santorini", "explore", "cliff", "beach", "lake", "mountain", "roadtrip", "road trip", "places", "cities", "flight", "getaway", "hidden gems"],
    coreFocus: "Breathtaking scenic travel vistas, majestic turquoise waters, dramatic mountain peaks, sun-washed coastal stone architecture, authentic adventure moments",
    realismDirectives: "Wide angle landscape photography with rich atmospheric depth, natural ambient sunlight, crystal clear waters with visible ripples, authentic terrain textures, no fake CGI saturation",
    negativePromptAnchors: "cartoon, 3d render, plastic water, oversaturated neon, fake clouds, blurry landscape",
    backgroundVariations: [
      "serene turquoise glacial lake in Canadian Rockies with snow-capped granite peaks",
      "sun-washed whitewashed cliffside terrace in Santorini overlooking deep blue Aegean Sea at golden sunset",
      "dramatic winding coastal highway above turquoise Mediterranean cliffs with lone wooden boat",
      "cozy rustic wooden A-frame cabin nestled in lush evergreen pine forest beside reflective mountain lake",
      "historic cobblestone European alleyway with blooming bougainvillea and warm lantern glow",
    ],
    supportingElements: [
      "vintage leather luggage bag with travel passport and map",
      "woven wicker sun hat resting on a rustic wooden balcony railing",
      "pair of wooden Adirondack chairs on a private lakeside dock",
      "steaming ceramic mug overlooking misty sunrise mountain valley",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Dream Destinations", keywords: "bucket list destinations, romantic getaways, aesthetic travel photography, hidden gems" },
      { intent: "realistic", label: "Weekend Itinerary", keywords: "3-day weekend itinerary, best spots to visit, road trip scenic route" },
      { intent: "functional", label: "Travel Packing & Tips", keywords: "carry-on packing list, budget travel hacks, solo travel guide" },
      { intent: "luxury", label: "Luxury Resort Escapes", keywords: "five-star cliffside villa, private infinity pool, bespoke luxury retreat" },
      { intent: "budget", label: "Affordable Travel", keywords: "budget-friendly travel spots, free things to do, cheap flight hacks" },
    ],
  },

  fitness: {
    id: "fitness",
    name: "Fitness, Wellness & Healthy Habits",
    aliases: ["fitness", "workout", "gym", "exercise", "stronger", "yoga", "pilates", "healthy habits", "weights", "habits", "cardio", "stretching"],
    coreFocus: "Clean aesthetic home gym or airy wellness studio, sleek modern workout gear, authentic active movement, motivating minimalist space",
    realismDirectives: "Crisp studio natural light, natural sweat glow, authentic matte finish on cast iron dumbbells, clean wooden floors, no plastic CGI bodies",
    negativePromptAnchors: "deformed muscles, blurry weights, cartoon, plastic skin, 3d render",
    backgroundVariations: [
      "bright sun-drenched minimalist home gym with matte black dumbbells, foam roller, and potted fiddle leaf fig",
      "peaceful wooden yoga studio with sheer white floor-to-ceiling linen curtains and morning light",
      "modern clean workout corner with black ribbed exercise mat and stainless steel water bottle",
      "outdoor sunrise park setting with golden morning dew and running path",
    ],
    supportingElements: [
      "sleek matte black dumbbell set resting on textured fitness mat",
      "stainless steel insulated water bottle with condensation droplets",
      "clean aesthetic cork yoga block and rolled woven mat",
      "smart fitness watch with active heart rate monitor",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Aesthetic Wellness", keywords: "clean girl workout routine, pilates princess aesthetic, morning reset" },
      { intent: "realistic", label: "Daily Habits", keywords: "20-minute daily home workout, simple daily wellness habits, easy morning routine" },
      { intent: "functional", label: "Form & Guides", keywords: "full body workout split, strength training for beginners, posture fixes" },
      { intent: "luxury", label: "Boutique Studio", keywords: "luxury reformer pilates, private fitness coaching, high-end wellness club" },
      { intent: "budget", label: "Zero Equipment / Home", keywords: "no equipment bodyweight workout, living room fitness, free workout plan" },
    ],
  },

  kids: {
    id: "kids",
    name: "Kids, Parenting & Playrooms",
    aliases: ["kids", "children", "playroom", "nursery", "parenting", "toddler", "baby", "mom", "little moments", "family", "toys"],
    coreFocus: "Joyful, whimsical children's spaces, soft natural wood toys, pastel banners, warm plush rugs, heartwarming candid play moments",
    realismDirectives: "Warm soft morning daylight, natural woven textures (rattan baskets, wool rugs), candid human expressions, authentic playful energy",
    negativePromptAnchors: "plastic toys, scary eyes, deformed hands, cartoon 3d render, messy clutter",
    backgroundVariations: [
      "cheerful Scandinavian nursery with light birch wood shelves, pastel rainbow garland, and soft woven wool rug",
      "bright airy playroom with Montessori wooden toys, wicker storage baskets, and low drawing table",
      "cozy children's reading teepee with fairy string lights and plush teddy bear pillows",
      "sunlit outdoor backyard lawn with wooden climbing frame and gentle wildflowers",
    ],
    supportingElements: [
      "stack of natural handcrafted wooden rainbow stacking rings",
      "soft woven bear-face storage basket filled with plush animals",
      "illustrated children's storybook open on a fluffy braided rug",
      "colorful felt ball garland draped across a warm pine shelf",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Pastel Nursery Aesthetic", keywords: "neutral nursery decor, whimsical playroom, aesthetic Montessori setup" },
      { intent: "realistic", label: "Everyday Play Ideas", keywords: "easy toddler activities, rainy day kids crafts, quick sensory play" },
      { intent: "functional", label: "Toy Organization", keywords: "toy storage organization hacks, rotation system, clutter-free playroom" },
      { intent: "luxury", label: "Designer Nursery", keywords: "custom wooden playhouse, heirloom children furniture, boutique nursery" },
      { intent: "budget", label: "DIY Kids Projects", keywords: "dollar tree kids crafts, budget playroom makeover, homemade playdough" },
    ],
  },

  coffee: {
    id: "coffee",
    name: "Coffee, Cafes & Morning Rituals",
    aliases: ["coffee", "cafe", "latte", "espresso", "croissant", "cappuccino", "roast", "barista"],
    coreFocus: "Velvety micro-foam latte art, glistening flaky golden butter croissants, dark aromatic coffee beans, warm comforting rustic wood table",
    realismDirectives: "Macro cafe photography with shallow depth of field, gentle steam curling from warm porcelain cup, natural golden side light, textured linen napkin",
    negativePromptAnchors: "plastic foam, cartoon coffee, oversaturated, 3d render, fake food",
    backgroundVariations: [
      "weathered dark walnut cafe table with dark ceramic cup, latte art rosette, and freshly baked croissant",
      "sun-drenched marble bistro table with iced cold brew and morning newspaper",
      "cozy modern kitchen coffee bar with matte black espresso machine and glass syrup dispensers",
      "rustic wooden window counter in Paris cafe with rain droplets on glass outside",
    ],
    supportingElements: [
      "scattered roasted whole dark espresso beans across dark wood",
      "flaky golden-brown butter croissant on a crumpled parchment paper",
      "folded neutral oatmeal linen napkin with small brass spoon",
      "small glass pouring beaker with warm creamy oat milk",
    ],
    audienceIntents: [
      { intent: "dreamy", label: "Cozy Cafe Aesthetic", keywords: "cozy coffee aesthetic, rainy day cafe vibes, aesthetic latte art" },
      { intent: "realistic", label: "Morning Brew Routine", keywords: "5-minute home latte, best French press recipe, daily morning routine" },
      { intent: "functional", label: "Barista Guides", keywords: "espresso grind dial-in, milk steaming guide, cold brew ratio formula" },
      { intent: "luxury", label: "Specialty Pour-Over", keywords: "single-origin Ethiopian pour-over, manual lever espresso, specialty roasters" },
      { intent: "budget", label: "At-Home Cafe Drinks", keywords: "make Starbucks at home for $1, copycat brown sugar shaken espresso" },
    ],
  },
};

/**
 * Intelligent niche detector: matches user's chosen niche or analyzes prompt keywords
 */
export function detectNicheStrategy(prompt: string, userNiche?: string): NicheStrategy {
  const combined = `${userNiche || ""} ${prompt}`.toLowerCase();

  // 1. Direct alias matching
  for (const strategy of Object.values(NICHE_STRATEGIES)) {
    if (userNiche && userNiche.toLowerCase().includes(strategy.id)) {
      return strategy;
    }
    for (const alias of strategy.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");
      if (regex.test(combined)) {
        return strategy;
      }
    }
  }

  // 2. Default to Home Decor if unspecified (Pinterest's #1 category)
  return NICHE_STRATEGIES.homedecor;
}

/**
 * Enhances prompt with dedicated niche strategy, diverse background rotation,
 * and anti-AI realism directives.
 */
export function applyNicheStrategyToPrompt(
  prompt: string,
  options: {
    niche?: string;
    style?: string;
    variationIndex?: number;
    intent?: "dreamy" | "realistic" | "functional" | "luxury" | "budget";
  } = {}
): {
  enhancedPrompt: string;
  negativePrompt: string;
  nicheUsed: string;
  environmentUsed: string;
  intentUsed: string;
} {
  const strategy = detectNicheStrategy(prompt, options.niche);
  const cleanPrompt = prompt.trim();
  const subjectOnly = cleanPromptSubject(cleanPrompt);

  // Deterministic seed based on prompt characters
  let baseHash = 0;
  for (let i = 0; i < cleanPrompt.length; i++) {
    baseHash = (baseHash << 5) - baseHash + cleanPrompt.charCodeAt(i);
  }
  baseHash = Math.abs(baseHash);

  const vIdx = options.variationIndex ?? 0;

  // Pick unique background from niche strategy pool
  const bgIndex = (baseHash + vIdx) % strategy.backgroundVariations.length;
  const environment = strategy.backgroundVariations[bgIndex];

  // Pick supporting element
  const propIndex = (baseHash + vIdx) % strategy.supportingElements.length;
  const prop = strategy.supportingElements[propIndex];

  // Pick audience intent
  const intentMatch =
    strategy.audienceIntents.find((i) => i.intent === options.intent) ||
    strategy.audienceIntents[baseHash % strategy.audienceIntents.length];

  const styleTag = options.style || "Editorial";

  // Build enhanced prompt
  const enhancedPrompt = `${subjectOnly}, ${strategy.coreFocus}. Staged in ${environment}, accented with ${prop}. Mood: ${intentMatch.keywords}, ${styleTag} Pinterest visual aesthetic. ${strategy.realismDirectives}. Photographed with natural soft illumination, 2:3 vertical framing, pristine depth of field, authentic organic textures, immaculate viral Pinterest quality.`;

  // Build specialized negative prompt
  const negativePrompt = `${strategy.negativePromptAnchors}, oversaturated, lowres, watermark, text blur, signature, deformed, ugly, bad anatomy`;

  return {
    enhancedPrompt,
    negativePrompt,
    nicheUsed: strategy.name,
    environmentUsed: environment,
    intentUsed: intentMatch.label,
  };
}

/**
 * Generates prompt-aware & niche-aware catchy overlay content
 * (Kicker, Main Title, Script Accent, Subtitle, Bullets, Icons)
 */
export function getNicheOverlayContent(
  prompt: string,
  options: {
    niche?: string;
    preset?: string;
    pinType?: string;
    customHook?: string;
  } = {}
): CatchyOverlayContent {
  const strategy = detectNicheStrategy(prompt, options.niche);
  const cleanSubject = cleanPromptSubject(prompt);

  // Extract core keywords
  const words = cleanSubject.split(/\s+/).filter((w) => w.length > 2);
  const primaryKw = words.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Style Inspo";

  if (options.customHook && options.customHook.trim()) {
    const custom = options.customHook.trim();
    const customWords = custom.split(/\s+/);
    let kicker = strategy.name.split(" ")[0].toUpperCase();
    let accentScript = "Ideas";
    let mainTitle = custom;

    const lowerCustom = custom.toLowerCase();
    if (lowerCustom.includes("bathroom")) {
      kicker = "BATHROOM DESIGN";
      accentScript = "Ideas";
    } else if (lowerCustom.includes("kitchen")) {
      kicker = "KITCHEN DESIGN";
      accentScript = "Ideas";
    } else if (lowerCustom.includes("living room")) {
      kicker = "COZY";
      accentScript = "Ideas";
    } else if (lowerCustom.includes("bedroom")) {
      kicker = "SANCTUARY";
      accentScript = "Makeover";
    } else if (lowerCustom.includes("hair")) {
      kicker = "HAIR INSPIRATION";
      accentScript = "Transformation";
    } else if (lowerCustom.includes("nail")) {
      kicker = "MANICURE INSPO";
      accentScript = "Aesthetic";
    }

    const lastWord = customWords[customWords.length - 1];
    if (/^(ideas|inspo|makeover|design|style|tips|trends)$/i.test(lastWord) && customWords.length >= 3) {
      accentScript = lastWord.charAt(0).toUpperCase() + lastWord.slice(1).toLowerCase();
      mainTitle = customWords.slice(0, -1).join(" ");
    }

    return {
      kicker,
      mainTitle,
      accentScript,
      subtitle: `Discover curated ${custom.toLowerCase()} inspiration.`,
      footerBullets: ["STYLE", "INSPIRATION", "AESTHETIC"],
      fullHook: custom,
    };
  }

  // Niche-tailored kickers & hooks
  let kicker = "IDEAS & INSPO";
  let mainTitle = primaryKw;
  let accentScript = "Ideas";
  let subtitle = `Simple changes to elevate your ${primaryKw.toLowerCase()} aesthetic.`;
  let footerBullets = ["STYLISH", "PRACTICAL", "EASY"];
  let iconsList: Array<{ icon: any; text: string }> = [
    { icon: "home", text: "Better Layout" },
    { icon: "storage", text: "Smart Storage" },
    { icon: "light", text: "More Light" },
    { icon: "heart", text: "Cozy Vibes" },
  ];

  if (strategy.id === "hairstyles") {
    kicker = "HAIR INSPIRATION";
    accentScript = "Transformation";
    subtitle = `Stunning dimension and effortless movement for everyday chic.`;
    footerBullets = ["HEALTHY SHINE", "EASY STYLING", "MODERN CUT"];
    iconsList = [
      { icon: "scissors", text: "Precision Cut" },
      { icon: "sparkles", text: "Color Shine" },
      { icon: "heart", text: "Easy Routine" },
      { icon: "star", text: "Trending Look" },
    ];
  } else if (strategy.id === "nails") {
    const lowerP = cleanSubject.toLowerCase();
    const isPurple = lowerP.includes("purple") || lowerP.includes("plum") || lowerP.includes("dark");
    kicker = isPurple ? "Dark Purple" : "MANICURE INSPO";
    mainTitle = lowerP.includes("almond") ? "Almond Nails" : `${primaryKw} Nails`;
    accentScript = lowerP.includes("almond") ? "Almond" : "Aesthetic";
    subtitle = `Trendy nail art designs that take minutes to style.`;
    footerBullets = ["THAT TAKE MINUTES", "CLEAN CUTICLES", "TRENDING"];
    iconsList = [
      { icon: "sparkles", text: "Gloss Finish" },
      { icon: "star", text: "Almond Shape" },
      { icon: "heart", text: "Clean Girl" },
      { icon: "scissors", text: "Long Lasting" },
    ];
  } else if (strategy.id === "homedecor") {
    const lowerP = cleanSubject.toLowerCase();
    if (lowerP.includes("christmas") || lowerP.includes("holiday") || lowerP.includes("xmas")) {
      kicker = "35 CHRISTMAS";
      mainTitle = "Decor Ideas";
      accentScript = "2026";
      subtitle = "Cozy minimalist Christmas tree and fireplace mantel styling ideas.";
      footerBullets = ["MORE IDEAS", "HOLIDAY DECOR", "WARM LIGHTING"];
      iconsList = [
        { icon: "home", text: "Holiday Mantel" },
        { icon: "storage", text: "Nordic Tree" },
        { icon: "light", text: "Fairy Lights" },
        { icon: "heart", text: "Warm Hearth" },
      ];
    } else if (lowerP.includes("kitchen")) {
      kicker = "KITCHEN DESIGN";
      const isBlue = lowerP.includes("blue") || lowerP.includes("walnut");
      mainTitle = isBlue
        ? "Open Concept Kitchen"
        : primaryKw.includes("Kitchen")
        ? primaryKw
        : `${primaryKw} Kitchen`;
      accentScript = "Ideas";
      subtitle = isBlue
        ? "Dusty blue shaker cabinets paired with warm walnut accents."
        : `Curated design inspiration for your ${primaryKw.toLowerCase()} remodel.`;
      footerBullets = isBlue
        ? ["DUSTY BLUE", "WALNUT ISLAND", "WARM WOOD"]
        : ["SMART LAYOUT", "ISLAND STORAGE", "WARM ACCENTS"];
      iconsList = [
        { icon: "home", text: "Open Layout" },
        { icon: "storage", text: "Island Storage" },
        { icon: "light", text: "Brass Pendants" },
        { icon: "heart", text: "Warm Earthy" },
      ];
    } else if (lowerP.includes("living room") || lowerP.includes("living")) {
      kicker = "SMALL SPACE";
      mainTitle = primaryKw.includes("Living") ? primaryKw : `${primaryKw} Living Room`;
      accentScript = "Ideas";
      subtitle = "Simple design ideas to make your living room feel larger and brighter.";
      footerBullets = ["BETTER LAYOUT", "SMART STORAGE", "FRESH LOOK"];
      iconsList = [
        { icon: "home", text: "Better Layout" },
        { icon: "storage", text: "Smart Storage" },
        { icon: "light", text: "More Light" },
        { icon: "heart", text: "Cozy Vibes" },
      ];
    } else if (lowerP.includes("bedroom")) {
      kicker = "SANCTUARY";
      mainTitle = "Cozy Bedroom";
      accentScript = "Makeover";
      subtitle = "Warm neutral layers and soft ambient lighting ideas.";
      footerBullets = ["WARM LAYERS", "SOFT LIGHT", "COZY VIBES"];
    } else if (lowerP.includes("bathroom") || lowerP.includes("bath") || lowerP.includes("vanity") || lowerP.includes("tub") || lowerP.includes("shower")) {
      kicker = "BATHROOM DESIGN";
      const isLuxury = lowerP.includes("luxury") || lowerP.includes("traditional") || lowerP.includes("master");
      mainTitle = isLuxury ? "Luxury Master Bathroom" : "Modern Bathroom";
      accentScript = "Ideas";
      subtitle = "Rich wood double vanity paired with freestanding tub and marble tiles.";
      footerBullets = ["FREESTANDING TUB", "MARBLE TILES", "SPA RETREAT"];
      iconsList = [
        { icon: "home", text: "Better Layout" },
        { icon: "storage", text: "Double Vanity" },
        { icon: "light", text: "Ambient Sconces" },
        { icon: "heart", text: "Spa Retreat" },
      ];
    } else {
      kicker = "HOME DESIGN";
      mainTitle = primaryKw;
      accentScript = "Ideas";
      subtitle = `Simple design changes to elevate your ${primaryKw.toLowerCase()} aesthetic.`;
      footerBullets = ["BETTER LAYOUT", "SMART STORAGE", "FRESH LOOK"];
      iconsList = [
        { icon: "home", text: "Better Layout" },
        { icon: "storage", text: "Smart Storage" },
        { icon: "light", text: "More Light" },
        { icon: "heart", text: "Cozy Vibes" },
      ];
    }
  } else if (strategy.id === "crafts") {
    kicker = "EASY DIY";
    accentScript = "Craft Project";
    subtitle = `Step-by-step handmade inspiration using simple tactile materials.`;
    footerBullets = ["BEGINNER", "LOW BUDGET", "CREATIVE"];
    iconsList = [
      { icon: "scissors", text: "Easy Steps" },
      { icon: "sparkles", text: "Raw Materials" },
      { icon: "heart", text: "Handmade" },
      { icon: "star", text: "Budget Friendly" },
    ];
  } else if (strategy.id === "food") {
    kicker = "QUICK & DELICIOUS";
    accentScript = "Recipe Ideas";
    subtitle = `Easy wholesome recipe with rich comforting flavors you'll crave.`;
    footerBullets = ["20 MINUTES", "SIMPLE INGREDIENTS", "DELICIOUS"];
    iconsList = [
      { icon: "sparkles", text: "Fresh Herbs" },
      { icon: "star", text: "Quick Prep" },
      { icon: "heart", text: "Family Loved" },
      { icon: "home", text: "One Pot" },
    ];
  } else if (strategy.id === "fashion") {
    kicker = "OUTFIT FORMULA";
    accentScript = "Street Style";
    subtitle = `Effortless capsule wardrobe styling that looks instantly expensive.`;
    footerBullets = ["CHIC", "COMFORTABLE", "ELEVATED"];
    iconsList = [
      { icon: "star", text: "Capsule Piece" },
      { icon: "sparkles", text: "Layered Fit" },
      { icon: "heart", text: "All-Day Wear" },
      { icon: "scissors", text: "Tailored Look" },
    ];
  } else if (strategy.id === "travel") {
    const lowerP = cleanSubject.toLowerCase();
    kicker = lowerP.includes("road") ? "ROAD TRIP" : lowerP.includes("canada") ? "THE BEST" : "DISCOVER";
    accentScript = lowerP.includes("road") ? "Places" : lowerP.includes("canada") ? "in Canada" : "Destinations";
    subtitle = "Scenic routes and unforgettable places to explore on your next journey.";
    footerBullets = lowerP.includes("road") ? ["SCENIC ROUTES", "UNFORGETTABLE VIEWS"] : ["NATURE", "ADVENTURE", "BEAUTY"];
    iconsList = [
      { icon: "star", text: "New Places" },
      { icon: "heart", text: "New Stories" },
      { icon: "sparkles", text: "Same You" },
      { icon: "home", text: "Bucket List" },
    ];
  } else if (strategy.id === "fitness") {
    kicker = "FITNESS & HEALTH";
    accentScript = "Better You";
    subtitle = "Simple daily habits and workouts that make a massive difference.";
    footerBullets = ["BETTER HEALTH", "MORE ENERGY", "HAPPIER YOU"];
    iconsList = [
      { icon: "heart", text: "Eat Well" },
      { icon: "sparkles", text: "Stay Active" },
      { icon: "star", text: "Be Happy" },
      { icon: "home", text: "Daily Vitality" },
    ];
  } else if (strategy.id === "coffee") {
    kicker = "GOOD COFFEE";
    accentScript = "Better Days";
    subtitle = "Rich comforting roasts and cafe aesthetics to elevate your mornings.";
    footerBullets = ["SIP", "RELAX", "REPEAT"];
    iconsList = [
      { icon: "heart", text: "Morning Ritual" },
      { icon: "sparkles", text: "Artisan Roast" },
      { icon: "star", text: "Cafe Aesthetics" },
      { icon: "home", text: "Daily Brew" },
    ];
  } else if (strategy.id === "kids") {
    kicker = "LITTLE MOMENTS";
    accentScript = "Big Joy";
    subtitle = "Whimsical playful spaces and creative moments that spark childhood wonder.";
    footerBullets = ["PLAY", "LEARN", "GROW"];
    iconsList = [
      { icon: "star", text: "Play Daily" },
      { icon: "heart", text: "Learn Creative" },
      { icon: "sparkles", text: "Grow Joyful" },
      { icon: "home", text: "Cozy Space" },
    ];
  }

  // Dedicated Preset Layout Tailoring (Ensure exact slot alignment for all 18 presets)
  if (options.preset === "bold_center_badge") {
    const numMatch = cleanSubject.match(/\b(\d{1,3})\b/);
    const num = numMatch ? numMatch[1] : "35";
    const topicWithoutNum = cleanSubject.replace(new RegExp(`\\b${num}\\b`, "i"), "").replace(/\s+/g, " ").trim();
    if (topicWithoutNum) {
      mainTitle = topicWithoutNum;
    }
    if (!kicker || kicker === "IDEAS & INSPO" || kicker === "HOME DESIGN") {
      kicker = cleanSubject.toLowerCase().includes("christmas") ? "2026" : "GUIDE";
    }
  } else if (options.preset === "editorial_tall_script") {
    const numMatch = cleanSubject.match(/\b(\d{1,3})\b/);
    const num = numMatch ? numMatch[1] : "20";
    const topicWithoutNum = cleanSubject.replace(new RegExp(`\\b${num}\\b`, "i"), "").replace(/\s+/g, " ").trim();
    if (topicWithoutNum) {
      mainTitle = topicWithoutNum;
    }
  } else if (options.preset === "classic_clean_travel" && !/travel|trip|canada|santorini|flight|destination|explore/i.test(cleanSubject)) {
    if (accentScript === "in Canada") {
      accentScript = "Ideas & Styling";
    }
  }

  const generatedHook = buildPunchy5to6WordHook(cleanSubject, strategy.id, options.pinType);

  return {
    kicker,
    mainTitle,
    accentScript,
    subtitle,
    footerBullets,
    iconsList,
    fullHook: generatedHook,
  };
}

/**
 * Constructs a high-CTR, deeply topic-relevant 5 to 6 word punchy headline hook
 * based on prompt topic, niche, and user intent.
 */
export function buildPunchy5to6WordHook(
  rawSubject: string,
  strategyId: string,
  pinType?: string
): string {
  const clean = cleanPromptSubject(rawSubject).trim();
  const lower = clean.toLowerCase();

  const stopWords = new Set([
    "with", "using", "from", "into", "about", "photo", "image", "picture", 
    "shot", "render", "super", "very", "and", "the", "for", "that", "this",
    "stunning", "beautiful", "gorgeous", "ultra", "realistic", "high", "end",
    "featuring", "featured", "look", "looking", "take", "minutes", "ideas"
  ]);

  const rawWords = clean.split(/[\s,&|]+/).filter((w) => w.length > 1);
  const meaningfulWords = rawWords.filter((w) => !stopWords.has(w.toLowerCase()));
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

  // If user provided a specific listicle number (e.g. 35, 20, 15, 10, 7)
  const numMatch = clean.match(/\b(\d{1,3})\b/);
  const userNum = numMatch ? numMatch[1] : null;

  // 1. Kitchen Design
  if (lower.includes("kitchen")) {
    const descriptors = meaningfulWords
      .filter((w) => !/^(kitchen|room|decor|design|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `${descriptors} Kitchen Remodel Ideas To Try`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "7 Open Concept Kitchen Remodel Ideas";
  }

  // 2. Living Room
  if (lower.includes("living room") || (lower.includes("living") && lower.includes("room"))) {
    const descriptors = meaningfulWords
      .filter((w) => !/^(living|room|decor|design|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `Cozy ${descriptors} Living Room Decor Ideas`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Cozy Modern Living Room Decor Ideas";
  }

  // 3. Bedroom
  if (lower.includes("bedroom")) {
    const descriptors = meaningfulWords
      .filter((w) => !/^(bedroom|room|decor|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `Warm ${descriptors} Bedroom Sanctuary Inspo Ideas`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Warm Cozy Bedroom Sanctuary Makeover Ideas";
  }

  // 4. Bathroom
  if (lower.includes("bathroom") || lower.includes("bath") || lower.includes("vanity") || lower.includes("shower") || lower.includes("tub")) {
    const descriptors = meaningfulWords
      .filter((w) => !/^(bathroom|bath|vanity|tub|shower|decor|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `Luxury ${descriptors} Bathroom Remodel Inspiration`;
      return phrase.split(/\s+/).slice(0, 5).join(" ");
    }
    return "Luxury Modern Bathroom Remodel Inspiration";
  }

  // 5. Christmas / Holidays
  if (lower.includes("christmas") || lower.includes("holiday") || lower.includes("xmas")) {
    const num = userNum || "35";
    const descriptors = meaningfulWords
      .filter((w) => !/^(christmas|holiday|xmas|decor|ideas?|\d+|202\d)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `${num} Cozy ${descriptors} Christmas Decor Ideas`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "35 Cozy Christmas Decor Ideas 2026";
  }

  // 6. Nails & Manicures
  if (lower.includes("nail") || lower.includes("manicure")) {
    const num = userNum || "20";
    const descriptors = meaningfulWords
      .filter((w) => !/^(nails?|manicure|art|ideas?|\d+|minutes)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `${num} Chic ${descriptors} Nails Ideas`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "20 Dark Purple Almond Nails Ideas";
  }

  // 7. Hair & Hairstyles
  if (lower.includes("hair") || lower.includes("balayage") || lower.includes("curls") || lower.includes("bob") || lower.includes("braid")) {
    const descriptors = meaningfulWords
      .filter((w) => !/^(hair|hairstyle|cut|color|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (descriptors) {
      const phrase = `Trending ${descriptors} Hair Inspiration To Save`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Trending Dimensional Hair Inspiration To Save";
  }

  // 8. Travel & Destinations
  if (lower.includes("travel") || lower.includes("destination") || lower.includes("vacation") || lower.includes("trip") || lower.includes("canada") || lower.includes("santorini")) {
    if (lower.includes("canada")) {
      return "The Best Travel Spots In Canada";
    }
    if (lower.includes("santorini")) {
      return "Discover Dream Santorini Travel Destinations";
    }
    const place = meaningfulWords
      .filter((w) => !/^(travel|places?|destinations?|spots?|trip|guide|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (place) {
      const phrase = `The Best Travel Spots In ${place}`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Discover Dream Travel Destinations To Explore";
  }

  // 9. Food & Recipes
  if (lower.includes("salad") || lower.includes("healthy eating") || lower.includes("recipe") || lower.includes("dinner") || lower.includes("meal")) {
    const food = meaningfulWords
      .filter((w) => !/^(food|recipe|recipes|eating|ideas?|\d+|meal)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (food) {
      const phrase = `Easy Healthy ${food} Meal Prep Ideas`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Easy Healthy Eating Salad Meal Prep";
  }

  // 10. Coffee
  if (lower.includes("coffee") || lower.includes("cafe")) {
    return "Cozy Morning Coffee Ritual At Home";
  }

  // 11. Fitness
  if (lower.includes("fitness") || lower.includes("workout") || lower.includes("gym")) {
    return "Simple Daily Habits For More Energy";
  }

  // 12. Crafts & DIY
  if (lower.includes("diy") || lower.includes("craft")) {
    const craft = meaningfulWords
      .filter((w) => !/^(diy|craft|crafts|ideas?|\d+)$/i.test(w))
      .slice(0, 2)
      .map(cap)
      .join(" ");
    if (craft) {
      const phrase = `Creative DIY ${craft} Projects To Try`;
      return phrase.split(/\s+/).slice(0, 6).join(" ");
    }
    return "Creative DIY Craft Projects To Try";
  }

  // 13. General Algorithmic 5-6 Word Builder
  const keySnippet = meaningfulWords.slice(0, 3).map(cap).join(" ") || "Style Inspo";
  const num = userNum || (pinType?.toLowerCase().includes("listicle") ? "10" : "7");
  const candidate = `${num} Inspiring ${keySnippet} Ideas To Try`;
  const candWords = candidate.split(/\s+/);
  if (candWords.length >= 5 && candWords.length <= 6) {
    return candidate;
  }
  if (candWords.length > 6) {
    return candWords.slice(0, 6).join(" ");
  }
  return `${candidate} Today`;
}
