# PinForge – Complete Tool Strategy & Logic Blueprint

Pinterest Pin Generation Tool: market research + deep functional logic (Prompt Mode, Auto-Idea Mode, Templates, Brand Kit, Library, Scheduler, Stats)

---

# PART 1 – STRATEGY & OVERVIEW

## 1. Product Vision (ek line mein)

PinForge ek niche-aware Pinterest pin factory hai: user sirf niche + (optional) idea de, tool automatically unique image + Pinterest-SEO text (title, description, alt text, hashtags) + overlay design + schedule + tracking bana kar de. Asli edge: niche template (system prompt) jo har image ko focused aur relevant rakhta hai, aur brand kit jo har pin ko consistent aur beautiful banata hai.

**Core promise:** "Generate 50 unique, on-brand, SEO-ready pins in 10 minutes for under $0.50."

## 2. Market Research (competitors kya kar rahe hain, kya nahi)

Note: yeh analysis categories aur known players par based hai. Launch se pehle har tool ki current pricing/features khud verify karo.

| Category | Examples | Kya acha karte hain | Kya miss karte hain (our gap) |
|---|---|---|---|
| Design editors | Canva (bulk create, Magic Studio) | Templates, fonts, easy editing | Niche-aware idea generation nahi; bulk mein har pin similar lagta hai; SEO data alag banana parta hai; per-pin cost control nahi |
| Pinterest schedulers | Tailwind, Later, Publer | Scheduling, analytics, board management, auto-publish | Image generation weak ya credit-based mehnga; niche strategy nahi; user apni API key/cost control nahi kar sakta |
| AI pin makers | Predis-type, generic "AI pin generator" apps | Fast text-to-pin | Mostly ek fixed model; unique variations kam; brand consistency weak; text in image error-prone; no BYO key |
| General image AI | Midjourney, Ideogram, Flux tools | Best image quality | Pinterest format, SEO, overlay, schedule, library kuch nahi |
| Keyword tools | Pinterest Trends, Pinterest search suggest | Keyword demand data | Image creation se disconnected |

### Competitor weaknesses jo hum solve karte hain

1. Sab pins same lagte hain → hum idea-diversification engine (har pin ko alag angle/composition) lagate hain.
2. Niche focus nahi → Niche Template system prompt har generation mein inject hota hai.
3. Cost opaque → har model ki cost pehle dikhti hai, stats mein total spend track hota hai.
4. Text-in-image kharab → 3 modes: Canvas overlay (perfect typography), AI in-image, No text.
5. SEO alag step → image generate hote hi title/description/alt/hashtags auto-ready.
6. Brand inconsistency → multi Brand Kit (reference image, logo, font, colors, overlay preset).
7. Workflow tracking nahi → Library → Schedule → Calendar → "Used" tickmark.
8. Vendor lock-in → Runware (multi-model) + OpenRouter (free text models), user ki apni keys.

**Benefit (user ko kya milta hai):** Time saving (bulk), lower cost (Draft/Eco models), consistent niche authority, better CTR (unique visuals), better search reach (keyword-targeted text), organized posting.

## 3. App Structure (Sidebar)

1. Generate (Way 1 & Way 2)
2. Templates (create/save/edit/delete per niche)
3. Library (all generated pins + SEO data + schedule field)
4. Schedule (calendar view)
5. Brand Kit (multi-kit manager)
6. Stats (footprint + cost)
7. Settings (Runware key, OpenRouter key, defaults)

## 4. Data Models (database tables)

- **Settings:** runware_key_enc, openrouter_key_enc, default_text_model, default_image_model, currency, timezone.
- **Niche:** id, name (e.g. "Home Decor", "Vegan Recipes"), is_custom.
- **Template:** id, niche_id, name, system_prompt (long text), style_notes, forbidden_elements, keyword_seeds[], default_pin_types[], created_at. (Ek niche ke andar unlimited templates.)
- **BrandKit:** id, kit_name, brand_name, website_url, style_vibe, custom_adjectives, reference_image, logo_png, logo_position, logo_opacity, google_font_url, font_family, overlay_preset, palette[], negative_prompt, brand_voice, cta_presets[], default_aspect, default_model, default_text_model, utm_template.
- **Job** (ek generate click): id, mode (prompt/auto), input_lines[], settings_snapshot (JSON), status, total_items, estimated_cost, actual_cost, created_at.
- **JobItem** (ek input line × variation): id, job_id, line_index, variation_index, pin_type, final_prompt, status (queued/running/done/failed), retries, error.
- **Pin** (Library): id, job_item_id, image_url/path, width, height, model_used, cost, title, description, alt_text, hashtags[], target_keyword, secondary_keywords[], destination_url, template_id, brand_kit_id, pin_type, text_mode, overlay_text, schedule_date (nullable), status (draft/scheduled/published), used (bool), used_at, created_at.
- **CostEvent:** id, pin_id, kind (image/text), model, amount, created_at.

## 5. The Two Ways to Generate

### Way 1 – Prompt Mode (user prompts deta hai)

User per line = ek prompt deta hai (single ya bulk). Tool us prompt ko enhance karta hai aur image banata hai.

### Way 2 – Auto-Idea Mode (user prompt nahi deta)

User sirf niche template select karta hai. Do sub-options:

- **(a) Zero input:** tool khud N ideas generate karta hai (user count batata hai, e.g. 20 pins).
- **(b) Single-line ideas:** user per line ek chhoti image definition deta hai ("cozy reading nook with plants"). Tool us line ko template ke criteria ke mutabiq full prompt mein expand karta hai.

**Universal rule:** Har line = ek item. Empty lines ignore, duplicates detect (warn), trailing spaces trim, max lines per job configurable (e.g. 200).

### Mode matrix (user ke sab combinations)

| Mode | Input | Template | Prompt Enhance | Brand Kit |
|---|---|---|---|---|
| Way 1 | Detailed prompts (1 ya bulk) | Optional | Optional toggle | Optional |
| Way 2a | No input, sirf count | Required | N/A (auto ideas) | Optional |
| Way 2b | Single-line ideas | Required | Auto (expansion) | Optional |

Way 1 mein template optional isliye hai ke user ka taste/niche relevance maintain rahe; agar select ho to template ka system prompt background context ban jata hai, user ka prompt primary instruction rehta hai (user prompt hamesha template se upar priority).

## 6. Generation Pipeline (step-by-step logic)

Har job in stages se guzarti hai:

**Stage 0 – Validation**
- Runware key present? Selected model valid? Template/Brand Kit exist karte hain?
- Input lines parse + dedupe. Count > limit → error.

**Stage 1 – Cost estimate (pehle dikhao)**

```
image_cost = items × variations × model_price
text_cost  = items × variations × text_model_price (free = 0)
total      = image_cost + text_cost
```

User ko confirmation modal: "48 pins, Premium model, est. $0.46". Confirm ke baad hi run.

**Stage 2 – Pin-type assignment** (section 7)
**Stage 3 – Idea & Prompt building** (section 8)
**Stage 4 – Image generation via Runware** (section 9)
**Stage 5 – Text layer** (section 10)
**Stage 6 – SEO data generation** (section 11)
**Stage 7 – Save to Library + CostEvent + stats update**

**Queue behaviour:** concurrency limit (e.g. 3–5 parallel for fast models, 1–2 for slow models like GPT Image 2). Har item independent hai: ek fail ho to baqi chalte rahein. Retry max 2 (exponential backoff). Failed items "Retry failed" button se dobara chalte hain. Partial results Library mein foran aate hain (progress bar live).

## 7. Pin Type Logic (single vs bulk)

Pin types ki list (editable): Listicle, How-to/Tutorial, Inspiration/Aesthetic, Product/Showcase, Quote, Infographic-style, Before/After, Recipe/Step, Comparison, Tips & Mistakes.

**Case A – Single prompt (1 item):** user ek pin type select karta hai.

**Case B – Bulk prompts (N items):** user har type ka ratio/percentage set karta hai (e.g. Listicle 40%, How-to 30%, Inspiration 30%).

Ratio → count algorithm (Largest Remainder Method):

1. raw_i = N × ratio_i / 100
2. base_i = floor(raw_i)
3. remaining = N − Σ base_i
4. Remaining slots un types ko do jinki fractional part (raw_i − base_i) sabse badi ho.
5. Validation: ratios ka total 100 hona chahiye; UI auto-normalize ka option de.

Phir types ko items par shuffle karke assign karo (taake ek type sequence mein cluster na ho). Ya user "keep order" select kare to sequentially assign.

**Pin type ka asar:** har type ka alag composition rule + overlay layout + title formula hota hai. Misal: Listicle → "Number Pop" overlay + title mein number; Quote → centered text, plain background; Product → No-text ya minimal text.

## 8. Prompt Building Engine (sabse important hissa)

### 8.1 Final prompt ka structure (layers, priority order)

1. User/Idea core (subject, jo sabse zaroori hai)
2. Pin-type composition rule
3. Niche template system prompt (context, focus, forbidden elements)
4. Brand Kit style (vibe preset + custom adjectives + palette)
5. Image style setting (simple, minimalist, bold, luxury, dark moody, editorial, bright airy, cozy rustic, boho watercolor, vintage, flat-lay, 3D render, etc.)
6. Aspect-ratio composition hint ("vertical composition, leave top third clear for text" jab Canvas overlay ho)
7. Technical quality terms (model-specific)
8. Negative prompt (brand kit + template forbidden elements + global: "watermark, distorted hands, extra fingers, blurry text")

### 8.2 Prompt Enhance option (Way 1)

Toggle + intensity: Light (sirf clarity), Balanced, Rich (lighting, lens, mood, materials add). LLM ko instruction: "Original subject change mat karo; sirf visual detail add karo; max 80 words." Result user ko preview mein dikhao (editable) bulk mein "Enhance all" button.

### 8.3 Auto-Idea generation (Way 2a)

Template ke system_prompt + keyword_seeds LLM ko do aur N ideas maango structured JSON mein: `[{idea, angle, composition, target_keyword}]`.

**Diversity engine (taake sab alag hon):**
- LLM ko ek angle taxonomy do: composition (close-up, flat-lay, wide scene, top-down, detail shot), setting, color mood, time of day, season, subject variation.
- Har idea ko ek unique (composition × mood × setting) combo assign karo; jis combo repeat ho use reject/regenerate.
- Semantic duplicate check: ideas ke embeddings (ya simple keyword-overlap > 60%) compare karo; similar ho to regenerate.
- Ek hi LLM call mein sab ideas manga ke aap "already used ideas" list bhi context mein do taake repetition na ho.

### 8.4 Single-line idea expansion (Way 2b)

Har line ko template ke saath LLM expand karta hai: line → 60–90 word image prompt. Line ka meaning kabhi change nahi hona chahiye (guard: "preserve subject exactly").

### 8.5 Variations (1–4)

Har variation ek alag prompt leti hai, same seed nahi. Logic: base prompt se LLM ko bolo "generate N variants jinmein subject same ho magar composition, camera angle, lighting, ya styling alag ho." Fallback (LLM fail ho to): rule-based modifiers list ("overhead view", "close-up detail", "wide environmental shot", "golden-hour light") rotate karo. Library mein variants ek group_id se linked rahein taake user favorite ko "Generate variations of this" kar sake (us pin ke prompt ko base bana kar).

## 9. Image Models via Runware

### 9.1 Model registry (config table, hard-coded nahi)

Har model ki entry: label, tier, runware_model_id (AIR format), price_per_image, supports_seed_image (bool), supports_negative_prompt, native_sizes, avg_seconds, max_prompt_length, notes.

Starting tiers: Draft (FLUX Schnell ~$0.0019), Standard (SDXL ~$0.0030), Premium (FLUX Dev $0.0096), GPT Image 2 ($0.0060, text accurate, slow ~30s), Eco (Wan 2.5-type ~$0.0015). Aur models add karne ke liye sirf registry mein row add karo, UI automatically dikhata hai. Exact model IDs aur prices Runware ke model catalog se verify karo; prices change hote hain.

**Rule:** user jo model select kare, wahi model ID Runware request mein jaye. Brand Kit default model sirf pre-fill karta hai.

### 9.2 Aspect ratio → pixel size

Zyada models ko width/height 64 ke multiple chahiye hote hain. Recommended dimensions (model ke native size ke hisab se override karo):

| Ratio | Name | Generate size | Final export |
|---|---|---|---|
| 2:3 | Pinterest | 768×1152 | 1000×1500 (upscale/resize) |
| 9:16 | Tall | 576×1024 | 1080×1920 |
| 1:1 | Square | 1024×1024 | 1080×1080 |
| 4:5 | Portrait | 832×1024 | 1080×1350 (light crop) |
| 16:9 | Landscape | 1024×576 | 1920×1080 |

GPT Image 2 ke liye uske supported sizes use karo (aur nearest ratio crop karo). Final export par resize ke liye high-quality Lanczos; optional Runware upscaler.

### 9.3 Request logic

- Endpoint: Runware REST, taskType: imageInference, har request ka unique taskUUID.
- Fields: positivePrompt, negativePrompt, model, width, height, numberResults: 1, outputType: URL, outputFormat: JPG/PNG, optional seed.
- Reference image (Brand Kit): agar Brand Kit ON aur reference image uploaded ho to seedImage + strength bhejo (strength default 0.5–0.65: kam = reference ke zyada qareeb, zyada = prompt ko zyada freedom). Sirf un models mein jo image-to-image support karte hon; warna user ko warning aur reference skip.
- Jab Canvas overlay mode ho to prompt mein "empty negative space at top/bottom for text" shamil karo.
- Output image ko apne storage mein download/copy karo (Runware URLs temporary ho sakte hain) phir Library mein save.

### 9.4 Settings → API

- Runware API Key field + Test Connection button: ek chhoti sasti call (account/credit details ya minimum-size cheapest image) bhej kar valid/invalid/credit-low status dikhao (green/red).
- Key encrypted store karo; UI mein masked (••••1234); frontend se direct exposed na ho (server proxy use karo).

## 10. Text Rendering (3 modes)

### Mode A – Canvas Overlay (recommended)

Clean image generate → phir code se typography.

1. Overlay text decide: LLM se hook text maango (pin-type formula ke mutabiq, max 6–9 words; listicle mein number lead).
2. Preset apply: 11 presets (Editorial, Bold Modern, Script Romance, Solid Block, Frosted Glass, Gradient Top, Scrim Editorial, Outline Punch, Bottom Bar, Number Pop, Accent Underline). Har preset ek JSON config: font, weight, size ratio, alignment, background type, padding, position, colors.
3. Brand Kit inject: font family (Google Font load), palette se text/accent color, logo.
4. Auto-fit: font size ko binary-search se fit karo (max 3–4 lines). Line breaking balanced (orphan words na hon).
5. Contrast safety: image ke text-area ki average luminance calculate karo; WCAG contrast < 4.5 ho to automatically scrim/outline/solid band add karo ya text color flip karo.
6. Safe zones: Pinterest UI par neeche/kinaron par overlay aata hai, isliye important text margin 6–8% rakho.
7. Logo composite: corner (user chooses), opacity, size = 12–18% width.
8. Optional URL strip: "Add URL at bottom" toggle ON ho to bottom mein chhoti, readable domain line (Brand Kit ka website ya per-job override).
9. Result: final flattened image + overlay JSON save (taake edit ho sake).

### Mode B – AI In-Image Text

Text prompt mein quote karke do ("text reads: '...'"), sirf text-accurate models (GPT Image 2) recommend karo. Chhota text (≤6 words). Is mode mein quality check mushkil hai, isliye UI par note: "may contain spelling errors – regenerate if needed." Is mode mein overlay preset disable ho jata hai.

### Mode C – No Text

Sirf image. Logo/URL option phir bhi available (watermark ke tor par).

### Text LLM via OpenRouter

- Settings mein OpenRouter API key + model dropdown (free models list) + Test button.
- Key save hone par available free models fetch karo (OpenRouter models list API se, jin ki price 0 ho) taake dropdown hamesha updated rahe.
- Fallback chain: selected model fail/rate-limit → next free model → last resort: rule-based template text. Yeh isliye zaroori hai kyunke free models rate limits aur downtime rakhte hain.
- Structured JSON output maango; invalid JSON ho to ek baar "repair" retry.
- Batching: bulk mein ek call mein 5–10 pins ka SEO data maango (calls aur rate-limit kam).

## 11. Pinterest SEO Engine

**Goal:** har pin ke saath search-optimized text data jo Library mein pin ke sath save ho.

**Input to LLM:** final image prompt + niche + template keyword seeds + pin type + overlay text + brand voice + destination URL. (Image ko "samajhna" is liye prompt-based hai: jo prompt se image bani wahi ground truth hai. Optional upgrade: vision-capable model se actual image analyze karna.)

**Output (JSON):**
- target_keyword (primary)
- secondary_keywords[] (3–5)
- title
- description
- alt_text
- hashtags[]
- board_suggestion

**Pinterest SEO rules (validation code se enforce karo):**
- Title: max 100 chars (best first ~40 chars mein primary keyword), natural, click-worthy, keyword stuffing nahi.
- Description: max 500 chars, pehli 1–2 lines mein primary keyword, 2–3 secondary keywords natural sentence mein, soft CTA ("Save this for later").
- Alt text: image ko literally describe kare (accessibility + search), 125–250 chars, primary keyword natural.
- Hashtags: 3–5 relevant, niche-specific (zyada nahi); description ke end par.
- Har pin ka title/description alag ho (duplicate content check: similarity > 70% → regenerate).
- Banned: misleading claims, ALL CAPS spam, emoji overload.

**Keyword source priority:** template keyword seeds → LLM-suggested long-tail → (future) Pinterest Trends/autosuggest import.

**Editing:** Library mein user har field edit kar sakta hai, character counter live, "Regenerate SEO" button.

## 12. Templates (Sidebar → Templates)

**Create flow:** Niche select/create → Template name → System prompt (editor) → style notes → forbidden elements → keyword seeds → default pin types → Save.

**Rules:**
- Ek niche ke andar unlimited templates (e.g. Home Decor → "Scandinavian Living Room", "Boho Bedroom").
- Niche custom ho sakti hai (user apni marzi ki).
- Duplicate / Edit / Delete / Export-Import (JSON).
- Optional "Generate template with AI": user niche + 2-3 lines taste likhe → LLM system prompt draft kare → user review/save.

**Template system prompt ka recommended structure (yeh hi niche focus deta hai):**
1. Role: "You are a Pinterest visual strategist for [niche]."
2. Audience: kaun search karta hai, unki intent.
3. Visual identity: colors, materials, lighting, mood.
4. Must include / Must avoid.
5. Composition preferences (pin-type wise).
6. Diversity rule: "Every pin must differ in angle, setting, or subject."
7. Keyword themes.

**Backend usage:** Generate page par "Template" button → dropdown mein user ke saved templates (niche → template name) → select karne par template_id job settings snapshot mein jata hai aur Stage 3 mein system prompt inject hota hai.

## 13. Generate Page – Settings Panel (final list)

1. Way selector: Prompt Mode / Auto-Idea Mode
2. Input type: Single / Bulk (per line = ek item)
3. Template button (dropdown) – Way 2 mein required, Way 1 mein optional
4. Brand Kit toggle + kit selector (ON ho to kit ki settings apply)
5. Pin type: single → ek select; bulk → type-wise ratio sliders
6. Aspect ratio: 2:3, 9:16, 1:1, 4:5, 16:9
7. Variations: 1–4
8. Image quality/model: registry se cards (cost per pin visible)
9. Image style: Simple, Minimalist, Bold, Luxury, Dark & Moody, Editorial, Bright & Airy, Cozy Rustic, Boho Watercolor, Vintage, Flat-lay, 3D, Pastel, Cinematic
10. Text rendering: Canvas overlay / AI in-image / No text
11. Overlay preset (Canvas mode)
12. Add URL at bottom: on/off (+ URL input)
13. Prompt enhance: off/light/balanced/rich (Way 1)
14. Text model (OpenRouter free model)
15. Live cost estimate + Generate button

**Precedence rule jab settings conflict karein:** Job-level manual choice > Template > Brand Kit default > Global default.

## 14. Library

Har pin card: thumbnail, title, status badge (Draft/Scheduled/Published), model, cost, "Used" tick.

**Pin detail panel:** full image, editable SEO fields (title, description, alt text, hashtags, keyword), destination URL, overlay re-edit, Schedule field (date, month, year; optional time), Download, Regenerate, Variations-of-this, Delete.

**Filters/search:** by niche, template, brand kit, status, used/unused, date, model, keyword. **Bulk actions:** select many → schedule, download ZIP, delete, mark used, export CSV (title, description, link, image filename — Pinterest bulk-upload friendly).

## 15. Scheduler (Calendar)

- Library se pin ka schedule_date set karo (ya calendar par drag/drop).
- Calendar (month/week view): har date mein us din ke pin thumbnails + date label.
- Bulk auto-spread: "Spread 30 selected pins over 30 days, 2 per day" – posting frequency logic (min gap, optional time slots).
- Status flow: Draft → Scheduled → (date aa jaye) → "Due" → user post kare → Published (tick).
- Tickmark (Used): user pin post karne ke baad tick karta hai → used = true, used_at = now, history mein record, stats mein "published" count badhta hai. Library mein un-used pins filter se mil jate hain taake dobara use na ho.
- Overdue pins (date guzar gayi, tick nahi) highlight (red) – "Missed".
- Reminder (in-app/email, optional).
- **Important:** Pinterest ka official posting API access approval maangta hai, isliye v1 mein manual publish + tick rakho; v2 mein official API auto-publish add karo (agar approval mil jaye).

## 16. Download + Smart Compression

Download dialog options: Original / Compressed (toggle "Reduce file size"), format (JPG/WebP/PNG), single ya ZIP.

**Compression logic (quality bachate hue):**
1. Dimensions same rakho (resize na karo).
2. Format: photo ke liye JPG (mozjpeg, progressive) ya WebP; text-heavy/flat graphics ke liye PNG-quantized ya WebP lossless.
3. Target-size search: quality 92 se shuru → binary search neeche jab tak file ≤ target (default ~300–500 KB for 1000×1500) ya quality floor 78 par pahunche.
4. Quality guard: SSIM/PSNR check; SSIM < 0.95 ho to quality wapas barhao.
5. Chroma subsampling 4:4:4 text overlay wali images mein (text edges saaf rahen), 4:2:0 photos mein.
6. EXIF/metadata strip.
7. UI par before/after size dikhao (e.g. 2.1 MB → 380 KB, −82%).

Pinterest limit se bohat neeche rehna (fast loading), magar quality visible degrade na ho.

## 17. Brand Kit (multi-kit) + Extra Strong Features

**Existing:** kit name, brand name, URL, style vibe, custom adjectives, reference image (seedImage), logo, Google Font, overlay preset, default ratio/model/text model, Generate with AI, Duplicate/Reset/Save.

**"Generate with AI" logic:** website URL fetch → HTML se brand name, meta tags, logo/OG image, CSS colors → LLM se style vibe + adjectives + overlay preset suggest → form pre-fill → user review → Save (kabhi auto-save nahi).

**Extra features jo Brand Kit ko strong karte hain:**
1. Color palette (5 colors) – primary, secondary, accent, text, background; reference image/logo se auto-extract (k-means). Prompt mein color words inject + overlay colors yehi use karte hain.
2. Brand voice – tone (friendly, expert, luxe), banned words, preferred phrases → SEO text par apply.
3. Negative prompt library – brand-specific "never show" list.
4. CTA presets – ("Save for later", "Shop the look") overlay aur description mein.
5. Logo controls – position, size, opacity, light/dark logo variants (contrast ke hisab se auto-switch).
6. Font pairing – heading + body font, aur preset-wise override.
7. Style lock / Seed lock – optional fixed seed range ya reference strength taake series consistent rahe.
8. Brand asset library – badges, stickers, frames, texture/paper backgrounds, decorative shapes (transparent PNG) jo overlay mein add ho sakein.
9. Overlay layout memory – user ka custom overlay (position/size) kit mein save.
10. Default UTM/link template – `?utm_source=pinterest&utm_campaign={niche}` har pin ke link mein auto.
11. Board mapping – niche/template → default board name (library/CSV export mein).
12. Brand consistency score – generated pin ka dominant color palette vs kit palette compare; score low ho to warning/regenerate suggestion.
13. Per-kit analytics – kis kit se kitne pins, kitna cost.

**Generate page integration:** Brand Kit toggle ON → kit dropdown → kit ka style, palette, reference image, logo, font, overlay preset, negative prompt, defaults sab auto-apply (job-level manual override allowed). Template + Brand Kit saath mein: template = niche content focus, brand kit = visual identity.

## 18. Stats & Cost Tracking

**Metrics:**
- Total pins generated / scheduled / published / unpublished (draft)
- Pins per month (bar chart) + per niche/template/brand kit
- Generation success vs failed rate
- Cost: total spend (image + text), cost per pin, cost per month, cost per model, cost per published pin
- Model usage breakdown
- Compression savings (optional)
- Pipeline funnel: Generated → Scheduled → Published

**Formulas:**
- cost_per_pin = Σ(image + text cost) / pins
- publish_rate = published / generated
- monthly_spend = Σ CostEvent in month

**Cost accuracy:** estimate pehle (price registry se), actual baad mein Runware response ke cost field se (agar available) warna registry price. Failed/retried generations ka cost bhi record karo agar charge hua.

## 19. Reliability, Security, Edge Cases

- API keys: server-side encrypted, never logged, masked in UI.
- Rate limits: Runware/OpenRouter 429 → exponential backoff + queue slow-down.
- Idempotency: har JobItem ka unique id; page refresh par job resume (status DB mein), double-charge na ho.
- Cancel job: pending items rok do, completed save rahen.
- Safety: NSFW/policy block ho to item failed mark + reason, baqi continue.
- Low credit: Runware insufficient-balance error par queue pause + clear message.
- Empty template system prompt, oversize prompts: truncate + warn.
- Reference image unsupported model: warning, skip reference.
- Large bulk (100+): chunking (batches of 10), progress persistence.
- Storage: images object storage (S3/R2) mein; DB mein sirf path.
- Undo/regenerate: har pin ka history (prompt, seed, settings) save taake reproducible ho.

## 20. Recommended Build Order

1. Settings (keys + test connection) + model registry
2. Single-prompt generation (Runware) + Library
3. Aspect ratio, variations, cost estimate
4. Canvas overlay engine + presets
5. OpenRouter text + SEO engine
6. Templates + Way 2 (auto-idea + single-line)
7. Bulk queue + pin-type ratio
8. Brand Kit (basic → advanced)
9. Scheduler + tick tracking
10. Compression + export (ZIP/CSV)
11. Stats dashboard
12. Polish: AI template generator, brand score, auto-publish (v2)

## 21. Final Mastermind Principles

1. Prompt layering with strict priority – user idea hamesha sab se upar.
2. Diversity by design – combo-based angle assignment, duplicate rejection.
3. Cost transparency – estimate → confirm → track.
4. Fail soft – ek item fail, poora job nahi.
5. Config over code – models, presets, pin types sab registry/JSON.
6. SEO hard-validation – character limits code se enforce.
7. User control – har generated cheez editable aur regenerable.

---

# PART 2 – DEEP LOGIC SPECIFICATION (developer-level)

Part 1 overview tha. Yeh part har function ka exact logic, pseudo-code, real prompts, state machines, formulas aur edge cases deta hai. Conventions: pseudo-code mein 'single quotes' strings ke liye; → = "phir".

## 22. System Architecture (layers)

| Layer | Kaam | Tech suggestion |
|---|---|---|
| Frontend (SPA) | Pages, forms, calendar, canvas preview, live progress | React/Next.js, Zustand/Redux, Canvas API (ya Fabric.js/Konva) |
| API server | Auth, CRUD, validation, cost estimate, job creation, key proxy | Node (Fastify/Nest) ya Python (FastAPI) |
| Queue + Workers | Image gen, LLM calls, overlay render, compression (heavy kaam) | BullMQ/Redis ya Celery |
| Database | Relational data | PostgreSQL (JSONB for settings snapshot) |
| Object storage | Images, logos, reference images, ZIPs | S3 / Cloudflare R2 |
| Image processing | Overlay compositing, resize, compression | sharp + node-canvas/Skia ya Pillow |
| External | Runware (images), OpenRouter (text), website fetch | REST |

**Golden rule:** frontend kabhi third-party API key nahi dekhta. Frontend → API server → (key decrypt) → Runware/OpenRouter.

**Overlay kahan render ho?** Do options: (1) Server-side render (consistent, bulk ke liye best, fonts server par load) – recommended for bulk; (2) Client-side canvas (live edit preview). Best hybrid: edit preview client mein, final render server mein same overlay JSON se, taake dono identical aayein.

## 23. Job & Item State Machines

### 23.1 Job states

`DRAFT → ESTIMATED → QUEUED → RUNNING → (COMPLETED | PARTIAL | FAILED | CANCELLED | PAUSED)`

- COMPLETED: sab items done.
- PARTIAL: kuch done, kuch failed (retry available).
- PAUSED: auto – jab credit khatam / key invalid / rate-limit storm; user fix karke Resume.
- Transition rules: RUNNING → CANCELLED sirf user action; cancel par queued items skipped ho jate hain, running items complete hone dete hain (paid hain), results save.

### 23.2 JobItem states

`QUEUED → PROMPTING → IMAGING → TEXTING → SEO → SAVING → DONE` ya kisi bhi stage se `FAILED(stage, reason)`.

Har stage ka checkpoint DB mein save hota hai (e.g. final_prompt, raw_image_path, overlay_json, seo_json). Is se: crash ke baad worker wahin se resume karta hai jahan ruka tha; image dobara generate nahi hoti agar raw_image_path pehle se maujood hai (double charge se bachao).

### 23.3 Idempotency

`item_key = hash(job_id, line_index, variation_index)`. Worker pehle check karta hai: is key ka Pin exist karta hai? haan → skip. Runware taskUUID bhi item_key se deterministic banao taake retry duplicate charge na kare.

## 24. Queue Design

**Concurrency per provider (config table):**

| Model tier | Parallel workers | Why |
|---|---|---|
| Draft / Eco | 5–8 | fast (2–5s), sasta |
| Standard | 4 | medium |
| Premium | 3 | slow-ish, zyada GPU |
| GPT Image 2 | 2 | ~30s per image, rate-limit tight |
| OpenRouter free | 1–2 | free models mein strict rate limit |

**Retry policy:** `delay = min(60s, base * 2^attempt + jitter)` with base=2s, max_attempts=3.

- Retryable: 429, 5xx, timeout, network error.
- Non-retryable: 401/403 (bad key) → job PAUSED; 402/insufficient credit → PAUSED; 400 invalid param → item FAILED; content policy block → item FAILED(policy).

**Circuit breaker:** agar 5 consecutive failures same error type → worker pool pause 60s, job PAUSED with message (poora queue jal na jaye).

**Progress reporting:** WebSocket/SSE events: `item_update{id,status,thumb}`, `job_progress{done,failed,total,spent}`. UI progress bar = (done+failed)/total; live spent counter.

**Crash recovery:** startup par RUNNING items jo 5 min se updated nahi → QUEUED wapas (checkpoint se resume).

## 25. Input Parsing & Validation (exact rules)

```
function parseLines(raw):
  lines = raw.split(/\r?\n/)
  items = []
  for each line in lines:
    t = line.trim().replace(/\s+/g,' ')
    if t == '': continue                 # empty ignore
    if t.startsWith('#'): continue       # optional comment lines
    t = stripBullets(t)                  # '1. ', '- ', '* ' hata do
    if len(t) < 3: warn('too short'); continue
    items.push(t)
  dup = findDuplicates(items, similarity>=0.9)
  return {items, warnings: dup + tooLong(items, max=2000 chars)}
```

| Check | Rule | Action |
|---|---|---|
| Max items | default 200/job (config) | Block with message |
| Min length (Way 2b idea line) | 3 chars | Skip + warn |
| Max length Way 1 prompt | 2000 chars | Truncate warning |
| Max length Way 2b line | 200 chars | Warn (yeh "line" hai, paragraph nahi) |
| Duplicates | exact/near-exact | Show "3 duplicates removed" with undo |
| Template required (Way 2) | must exist | Disable Generate button + tooltip |
| Ratio sum | = 100 | Auto-normalize option |
| Total cost > balance limit (optional user cap) | cap check | Confirmation modal |

**Important:** Per line = one consideration. Multi-sentence prompt ko ek hi item maana jata hai jab tak newline na ho. Agar user ek paragraph paste kare to tool puchta hai: "Treat as 1 prompt, or split by sentences?" (default = 1).

## 26. Pin Type Library (har type ka poora behavior)

| Pin type | Composition rule (image prompt mein) | Overlay preset (default) | Title formula | Text mode default |
|---|---|---|---|---|
| Listicle | 'clean flat-lay or room scene with space for large headline, uncluttered' | Number Pop | {N} {keyword} ideas that {benefit} | Canvas |
| How-to / Tutorial | 'step-in-action scene, hands/process visible, bright natural light' | Bold Modern / Solid Block | How to {outcome} (easy {keyword} guide) | Canvas |
| Inspiration / Aesthetic | 'single hero subject, strong mood, minimal text space' | Scrim Editorial / Editorial | {Mood} {keyword} you will want to save | Canvas ya None |
| Product / Showcase | 'product centered, studio/lifestyle backdrop, sharp detail' | Bottom Bar / none | {Product}: {benefit} {keyword} | None |
| Quote | 'soft textured background, wide empty center' | Script Romance / Editorial | {short quote} | Canvas |
| Infographic-style | 'structured layout, icons, clear zones' | Solid Block | {keyword}: {n} quick facts | AI in-image (GPT) ya Canvas |
| Before/After | 'split composition left/right same subject' | Accent Underline | {keyword} before & after | Canvas |
| Recipe / Step | 'overhead food shot, natural props, steam/freshness cues' | Frosted Glass | {Dish} recipe ({time} min) | Canvas |
| Comparison | 'two subjects side by side, symmetrical' | Outline Punch | {A} vs {B}: which is better? | Canvas |
| Tips & Mistakes | 'subject with subtle caution/checklist feel' | Bold Modern | {N} {keyword} mistakes to avoid | Canvas |

Yeh table `pin_types` config table mein JSON ban kar rehti hai: `{id, name, composition_rule, default_overlay, title_formulas[], hook_patterns[], default_text_mode}`. User apni custom pin types add kar sakta hai.

**Type selection logic (bulk):** user ratios set karta hai; algorithm:

```
function allocate(N, ratios):         # ratios = {Listicle:40, HowTo:30, Inspo:30}
  raw   = {t: N*r/100 for t,r in ratios}
  base  = {t: floor(raw[t])}
  left  = N - sum(base)
  order = sortDesc(types, key = raw[t]-base[t])
  for i in 0..left-1: base[order[i]] += 1
  return base
```

Example: N=17, 40/30/30 → raw 6.8/5.1/5.1 → base 6/5/5 = 16, left=1 → Listicle (0.8 fraction) gets +1 → 7/5/5.

```
function assignTypes(items, counts, mode):
  pool = expand(counts)                  # ['Listicle'x7,'HowTo'x5,'Inspo'x5]
  if mode == 'shuffle': pool = seededShuffle(pool, job_id)
  if mode == 'interleave': pool = roundRobin(counts)   # L,H,I,L,H,I...
  items[i].pin_type = pool[i]
```

Default = interleave (feed mein variety, ek type cluster nahi). Smart assignment (optional): agar prompt mein number/list words ('10 ideas') ho to Listicle prefer, 'how to' ho to How-to prefer – pehle keyword match, phir baqi ratio se fill.

## 27. Prompt Builder – Exact Algorithm

```
function buildPrompt(item, ctx):
  # ctx = {template, brandKit, style, pinType, aspect, textMode, model}
  core      = item.userPrompt || item.expandedIdea            # P1
  comp      = pinType.composition_rule                        # P2
  niche     = summarize(ctx.template.system_prompt, 60 words) # P3 (compressed)
  brand     = join(kit.style_vibe_phrase, kit.custom_adjectives, paletteWords(kit.palette)) # P4
  style     = STYLE_MAP[ctx.style]                            # P5
  layout    = textMode=='canvas' ? 'empty negative space at ' + safeZone(pinType) : ''  # P6
  quality   = MODEL_PROFILE[model].quality_terms              # P7
  positive  = assemble(model.format, [core, comp, niche, brand, style, layout, quality])
  negative  = dedupe(global_neg + kit.negative + template.forbidden)
  positive  = fitToLimit(positive, model.max_prompt_length)   # drop from lowest priority upward
  return {positive, negative}
```

**Truncation order (jab limit cross ho):** pehle P7 → P5 → P6 → P4 → P3 → P2 kaato; P1 (user core) kabhi nahi kat'ta.

### 27.1 Model-specific prompt formatting (MODEL_PROFILE)

| Model family | Format | Negative prompt | Notes |
|---|---|---|---|
| FLUX (Schnell/Dev) | Natural-language sentences, 40–120 words | Usually ignored / minimal | Likhne ka style: descriptive paragraph, 'shot on 50mm, soft window light' |
| SDXL | Comma-separated tags + weights | Supported – use fully | Quality tags: 'highly detailed, sharp focus' |
| GPT Image 2 | Clear instructional English; text in quotes | No separate field – put 'avoid: ...' in prompt | Best for in-image text |
| Wan/Eco | Short, concrete | Per model | Keep under ~60 words |

Prompt builder pehle intermediate structured object banata hai, phir `render(model.format)` se final string – isliye model add karna sirf profile add karna hai.

### 27.2 Style map (image style setting)

| Style | Prompt fragment |
|---|---|
| Simple | 'simple clean composition, minimal props, natural light' |
| Minimalist | 'minimalist, lots of negative space, neutral palette, restrained' |
| Bold | 'bold saturated colors, high contrast, graphic, striking' |
| Luxury | 'luxurious, premium materials, marble/gold accents, refined soft lighting' |
| Dark & Moody | 'low-key lighting, deep shadows, rich dark tones, dramatic mood' |
| Editorial | 'magazine editorial photography, considered styling, shallow depth of field' |
| Bright & Airy | 'bright, airy, soft diffused daylight, pastel highlights' |
| Cozy Rustic | 'warm cozy, wood textures, soft blankets, golden warm light' |
| Boho Watercolor | 'boho watercolor illustration, earthy tones, hand-painted texture' |
| Vintage | 'vintage film look, muted warm tones, grain' |
| Cinematic | 'cinematic lighting, anamorphic feel, color graded' |

**Conflict rule:** Brand Kit style_vibe aur job-level style dono ho to job-level style primary, kit vibe sirf adjectives/palette ke taur par merge (contradict na kare, e.g. 'Dark Moody' vs 'Bright & Airy' → job wins, kit vibe skip + log).

### 27.3 Prompt Enhance (Way 1) – exact LLM instruction

```
SYSTEM: You rewrite image-generation prompts. Keep the user's subject, objects and
intent EXACTLY. Never add new main subjects, people, text or brand names.
Only add visual detail: lighting, camera/lens, composition, materials, mood, color.
Intensity = {light|balanced|rich}. Output ONE prompt, max {80|110|150} words, plain English.
Target model style: {natural-language | tag-style}.
USER: {original prompt}
```

**Guardrail:** enhance ke baad subject-preservation check: original ke nouns (top 5) enhanced mein present hon; nahi to fallback = original prompt + rule-based quality suffix.

## 28. Auto-Idea Engine (Way 2) – Exact Logic

### 28.1 Idea generation call (Way 2a)

```
SYSTEM: {template.system_prompt}
TASK: Generate {N} DISTINCT Pinterest image concepts for this niche.
Return ONLY JSON: [{'idea': str(<=25 words), 'angle': enum, 'composition': enum,
 'setting': str, 'mood': str, 'season': str, 'target_keyword': str}]
RULES: no two ideas share the same (composition + setting). Each idea must be a single
visual scene. Use these keyword themes: {keyword_seeds}. Avoid: {template.forbidden}.
Already used (do not repeat): {last 40 ideas for this template}.
```

**Batching:** N > 25 ho to chunks of 20 (token limit + quality). Har chunk ko pichle chunk ki ideas 'already used' mein do.

### 28.2 Diversity Engine (algorithm)

Axes (editable per template): composition = {close-up, flat-lay, overhead, wide-environment, detail macro, eye-level, in-use/human-hand}, mood = {calm, energetic, cozy, elegant, playful, dramatic}, setting, season, time_of_day.

```
function diversify(ideas):
  seen = []
  for idea in ideas:
    sig = (idea.composition, idea.setting_cluster, idea.mood)
    sim = max(jaccard(tokens(idea.idea), tokens(s.idea)) for s in seen)
    if sig in seenSigs or sim >= 0.55:
       rejected.push(idea); continue
    seen.push(idea)
  if rejected: regenerate(len(rejected), avoid=seen)   # max 2 rounds
  return seen
```

**Coverage balancing:** composition counts ko dekho – koi value > 35% share ho to uski extra ideas replace.

### 28.3 History memory

Har template ke liye `idea_history` table (idea text + hash). Naye job mein last ~100 ideas LLM context mein jati hain taake aaj ki generation kal se repeat na ho. Ye "unique per pin, always" ki asli guarantee hai.

### 28.4 Single-line expansion (Way 2b)

```
SYSTEM: {template.system_prompt}
TASK: Expand the short idea into one detailed image prompt (60–90 words) that fits this
niche. PRESERVE the idea's subject exactly. Add setting, lighting, composition, mood.
Pin type composition: {pinType.composition_rule}. Style: {style}. Brand: {brand}.
Idea: {line}
```

Bulk mein batch karo (5 lines per call) JSON array mein; index mismatch guard (output count != input count → per-line retry).

### 28.5 Variation maker (1–4)

```
Base prompt: {P}
Create {V-1} variants. Same subject and niche. Change ONLY: camera angle, composition,
lighting, styling/props, or color accent. Each variant must differ from all others on
at least 2 of those. Return JSON array of strings.
```

Variation 1 = original prompt (unchanged). Fallback agar LLM down: modifier pool rotation: `['overhead top-down view','close-up detail shot','wide environmental view','low angle','golden-hour light','overcast soft light','with contrasting accent color']`. Variants ka `group_id = hash(job_id,line_index)`.

**Cost note:** variations = extra image generations (items × V). Estimate modal par clearly: '12 prompts × 3 variations = 36 images'.

## 29. Runware Integration – Exact Logic

### 29.1 Dimension resolver

```
function resolveSize(aspect, model):
  target = ASPECT[aspect]            # {w:2,h:3}
  if model.native_sizes: return nearest(model.native_sizes, ratio=w/h)
  maxSide = model.max_side || 1024
  if h >= w: H = maxSide; W = round64(H * w/h)
  else:      W = maxSide; H = round64(W * h/w)
  return {W, H}                      # round64 = nearest multiple of 64, min 512
```

Generation size aur final export size alag hote hain (section 9.2). Final export par Lanczos resize; agar generation size export se chhota ho to optional Runware upscaler (extra cost, user toggle).

### 29.2 Request/response shape (reference)

```
POST https://api.runware.ai/v1
Headers: Authorization: Bearer {key}, Content-Type: application/json
Body: [{
  'taskType': 'imageInference',
  'taskUUID': '{deterministic uuid from item_key}',
  'positivePrompt': '...',
  'negativePrompt': '...',          # skip for models that ignore it
  'model': '{runware_model_id}',    # exactly user-selected model
  'width': 768, 'height': 1152,
  'numberResults': 1,
  'outputType': 'URL', 'outputFormat': 'JPG',
  'seedImage': '{uploaded ref id/URL}',  # only if Brand Kit ref ON + model supports
  'strength': 0.55,
  'includeCost': true               # cost response mein mangna
}]
Response: data[0] = {imageURL, cost?, seed, taskUUID}
```

Field names aur options Runware docs se re-verify karo; yeh logic structure hai. Cost: agar response mein cost aaye to wahi CostEvent.amount, warna registry price.

### 29.3 After-response steps

1. imageURL download (timeout 60s) → storage mein `raw/{job}/{item}.jpg`.
2. Checkpoint save: raw_image_path, seed, cost.
3. Basic sanity check: file size > 10 KB, decodable, dimensions match; fail → retry once.
4. Optional quality gate (v2): NSFW/blank/black-image detection (mean luminance near 0/255 → retry).

### 29.4 Reference image (seedImage) policy

- Upload ek dafa → Runware ko diya jata hai (upload task ya base64) → reference ID Brand Kit mein cache.
- strength slider in Brand Kit (0.3 = reference ke bohat qareeb, 0.8 = loose). Default 0.6.
- Warning logic: reference + very different prompt (e.g. kitchen reference, bedroom prompt) → low strength se composition bigar sakti hai; UI hint: 'Reference sirf style/color ke liye hai; high strength recommended'.
- Model seedImage support nahi karta → skip + banner 'Reference not applied for {model}'.

### 29.5 Test Connection logic

```
function testRunware(key):
  try account/balance call (agar available) -> show balance
  else: 1 cheapest image (Eco, 512x512, 4 steps) -> success => 'Connected ✅ (cost ~$0.0015)'
  map errors: 401 => 'Invalid key', 402 => 'No credit', timeout => 'Network issue'
  save status + last_tested_at
```

Test button ke baad key encrypted save hoti hai (AES-256-GCM, server secret). Key change hone par purani cached status reset.

## 30. Canvas Overlay Engine – Exact Algorithms

### 30.1 Overlay JSON (single source of truth)

```json
{
 "canvas": {"w":1000,"h":1500},
 "text": {"content":"12 Cozy Reading Nooks","preset":"scrim_editorial",
          "font":"Playfair Display","weight":700,"color":"#FFFFFF","align":"center",
          "maxLines":4,"box":{"x":0.08,"y":0.62,"w":0.84,"h":0.28}},
 "background": {"type":"scrim","from":"rgba(0,0,0,0)","to":"rgba(0,0,0,0.65)","height":0.45},
 "logo": {"src":"...","pos":"bottom_right","scale":0.14,"opacity":0.9,"margin":0.04},
 "url":  {"text":"yoursite.com","size":0.022,"pos":"bottom_center"},
 "accent": {"color":"#C8553D"}
}
```

Overlay JSON Pin ke saath save hoti hai → user baad mein text edit kare to image dobara generate nahi hoti, sirf re-render (free).

### 30.2 Text auto-fit (binary search)

```
function fitText(text, font, box, maxLines):
  lo = 18px; hi = box.h; best = lo
  while hi - lo > 1:
    mid = (lo+hi)/2
    lines = balancedWrap(text, font, mid, box.w)   # minimum raggedness
    if len(lines) <= maxLines and height(lines, mid*1.15) <= box.h:
       best = mid; lo = mid
    else: hi = mid
  return layout(best)
```

Balanced wrap: greedy wrap ke baad lines ki width variance minimize karo (Knuth-Plass jaisa simple version) taake last line mein 1 akela word (orphan) na aaye. Agar font size < min readable (32px at 1000w) ho to text shorten karne ke liye LLM se 'shorter hook' maango.

### 30.3 Smart placement (text kahan rakhein)

Image ko 3 horizontal bands (top/middle/bottom) mein baanto, har band ka visual busyness = edge density (Sobel) + luminance variance. Sab se kam busy band = text area (preset allow kare to). Isi liye prompt mein 'empty negative space at top/bottom' dena helpful hai. Preset ka fixed position ho (e.g. Bottom Bar) to override na karo.

### 30.4 Contrast safety

```
L_bg = mean relative luminance of region under text box
ratio = contrast(textColor, L_bg)
if ratio < 4.5:
   step1: switch text color white<->dark (best ratio)
   step2: add scrim/blur card (opacity 0.35 -> 0.7)
   step3: add outline/shadow
```

Yeh automatic chalta hai taake koi pin unreadable na ho; edit panel mein 'Auto-contrast' on/off.

### 30.5 Preset configs (har preset ka JSON summary)

| Preset | Font style | Background | Position | Best for |
|---|---|---|---|---|
| Editorial | Serif 600 | Cream card, 92% opacity, radius 12 | Center-bottom | Lifestyle, decor |
| Bold Modern | Heavy sans 800, UPPERCASE | None + subtle shadow | Center | Tips, how-to |
| Script Romance | Script + small sans sub | Cream card | Center | Wedding, quotes |
| Solid Block | Sans 700, white | Brand color band (60% height) | Bottom | Informational |
| Frosted Glass | Sans 600 | Blur(18px)+white 20% card | Center | Food, travel |
| Gradient Top | Sans 700 | Top gradient scrim | Top | Hero photos |
| Scrim Editorial | Serif 700 white | Bottom gradient 0→0.65 | Bottom | Any photo |
| Outline Punch | Sans 900 + 6px dark stroke | None | Center | Busy images |
| Bottom Bar | Sans 700 | Solid accent bar 14% height | Bottom | Product, CTA |
| Number Pop | Number 3× size accent, text below | None/scrim | Top-left | Listicles |
| Accent Underline | Sans 700 | Accent underline bar 8px | Top/Center | Minimal, clean |

### 30.6 Logo & URL composite

- Logo scale = clamp(0.10–0.18 × canvas width); margin 4%; transparent PNG, opacity user-set.
- Logo overlay-text se collide kare to logo ko dusre corner mein shift (collision check on bounding boxes).
- URL strip: ON ho to bottom safe-zone mein chhoti line (size ~2.2% height), semi-transparent pill background agar contrast low. URL source priority: job override → Brand Kit website → off.
- Light/dark logo variant: logo region ki luminance se auto-pick.

### 30.7 Fonts

Google Font URL se @font-face load → server mein font file download+cache (rendering consistent) → render se pehle `fonts.ready` wait. Font fail hone par fallback chain: kit font → preset default → system serif/sans. Font family + URL mismatch validate karo.

## 31. SEO Engine – Exact Logic

### 31.1 Pipeline

1. Context assemble: final_prompt, idea, pin_type, niche, template.keyword_seeds, brand_voice, overlay_text, destination_url.
2. Keyword selection: primary keyword = best match of idea ↔ template seeds (token overlap); agar match low ho to LLM se long-tail suggest (3–6 words, search-like phrase, jaise 'small apartment reading nook ideas').
3. LLM call (batch 5 pins).
4. Validators + auto-fix.
5. Score (0–100) + save.

### 31.2 SEO prompt

```
SYSTEM: You are a Pinterest SEO copywriter. Pinterest is a visual search engine: people
search phrases. Write natural, helpful text, never keyword stuffing.
For each pin return JSON:
{'target_keyword':str,'secondary_keywords':[3-5],'title':str(<=100 chars, primary keyword
in first 40 chars),'description':str(300-480 chars, primary keyword in first sentence,
2-3 secondary keywords naturally, soft CTA at end, NO hashtags inside),
'alt_text':str(125-250 chars, literal description of the image, include primary keyword once),
'hashtags':[3-5 lowercase, niche-specific, no spaces],'board_suggestion':str}
Tone: {brand_voice}. Language: {lang}. Avoid: {banned words}, ALL CAPS, emoji spam, clickbait claims.
Pins: [{idx, idea, final_prompt_summary, pin_type, overlay_text}]
```

### 31.3 Validators (code, LLM par bharosa nahi)

| Field | Rule | Auto-fix |
|---|---|---|
| title | 1–100 chars | Trim at word boundary; primary kw missing → prepend/rewrite once |
| description | 150–500 chars | Too long → trim last sentence; too short → expand call |
| alt_text | 100–300 chars | Regenerate if too short |
| hashtags | 3–5, `^[a-z0-9]+$` | Normalize; extras drop |
| keyword density | primary kw count in desc ≤ 2 | Rewrite if stuffed |
| uniqueness | cosine/Jaccard vs last 200 pins' titles < 0.7 | Regenerate with 'differ from: ...' |
| banned/claims | health/medical guarantees etc. | Flag |

### 31.4 SEO score (UI badge)

```
score = 25*kwInTitle + 15*kwInFirst40 + 20*kwInDescFirstSentence + 10*secondaryKwCoverage
      + 10*altTextQuality + 10*lengthOptimal + 10*uniqueness      (har term 0–1)
```

80+ green, 60–79 amber, <60 red + 'Fix' button (targeted regeneration).

### 31.5 Image understanding

Default: prompt-derived (zero extra cost). Optional 'Vision check' (agar user vision-capable OpenRouter model chune): final image + prompt bhejo → alt text ko actual image ke saath verify karo (hallucinated objects remove). Overlay-text pins mein alt text mein overlay words shamil karo.

## 32. Template System – Full Logic

### 32.1 Example template (Home Decor → 'Scandinavian Living Room')

```
ROLE: You are a Pinterest visual strategist for Scandinavian home decor.
AUDIENCE: Women 25–45 renovating small apartments; search intent = ideas, shopping, DIY.
VISUAL IDENTITY: white/oak/charcoal, natural daylight, linen, wool throws, plants, clean lines.
MUST INCLUDE: real-life lived-in feel, natural textures, balanced negative space.
MUST AVOID: clutter, neon colors, text/watermarks, people faces, brand logos.
COMPOSITION: Listicle = full-room wide shot; How-to = detail close-up of the element;
  Inspiration = styled vignette.
DIVERSITY: every pin must differ in room area, angle, or featured object.
KEYWORD THEMES: scandinavian living room, small space decor, hygge, minimalist decor.
```

### 32.2 Template fields → where used

| Field | Used in |
|---|---|
| system_prompt | Idea generator, expander, prompt builder (compressed), SEO context |
| forbidden_elements | Negative prompt + idea filter |
| keyword_seeds | Idea generation, SEO primary keyword |
| default_pin_types | Pre-select ratios on Generate page |
| style_notes | Style conflict resolution |

### 32.3 Template Quality Score (create hone par)

Check: role defined? audience? visual identity? avoid-list? ≥ 5 keyword seeds? length 150–800 words? → score + suggestions ('add forbidden elements'). Yeh user ko strong template likhne par guide karta hai.

### 32.4 'Generate template with AI'

Input: niche + 2–3 lines taste + (optional) reference URL/Pinterest board description → LLM structured 7-section system prompt + 8 keyword seeds + forbidden list → editable draft → Save. Kabhi auto-save nahi.

### 32.5 Versioning & safety

- Edit par version++; Pin mein template_version save taake purani pins ka source clear rahe.
- Delete par pins delete nahi hote (soft-delete, pins ka template_id null-safe).
- Template ek hi niche se bound; niche delete par warning.
- Backend injection: template_id job settings_snapshot mein copy hoti hai (snapshot) → job chalte waqt template edit ho jaye to running job affect nahi.

### 32.6 Way 1 + Template interplay

User prompt = P1 (primary). Template compressed (≈60 words) P3 mein. Agar user ka prompt template ke forbidden element ko contradict kare (e.g. user 'neon sign' likhe, template ne neon avoid) → user wins, aur UI soft warning: 'Template avoids neon; your prompt includes it – proceeding with your prompt.'

## 33. Brand Kit – Resolution & Intelligence

### 33.1 Settings precedence (single function)

```
function resolve(field, job, template, kit, global):
  if job.manual[field] !== undefined: return job.manual[field]
  if kit.enabled && kit[field]: return kit[field]
  if template.defaults[field]: return template.defaults[field]
  return global[field]
```

UI mein har setting ke side par chhota badge: 'from Brand Kit' / 'manual' – user ko pata rahe value kahan se aayi.

### 33.2 'Generate with AI' (website → kit)

1. fetch(url) (timeout 10s, robots-friendly, max 1.5MB).
2. Extract: `<title>`, og:site_name → brand name; meta description; theme-color; og:image; favicon/logo candidates; CSS color frequency (top 5 non-gray hex); Google Fonts links → font family.
3. Logo choice: SVG/PNG with 'logo' in path/alt, else favicon; background-remove if needed.
4. LLM: page text (first 2000 chars) + colors → `{style_vibe, adjectives[], overlay_preset, voice, niche_guess}`.
5. Prefill form + show 'Review & Save'. Fail (JS-heavy site/blocked) → graceful message + manual fill.

### 33.3 Palette extraction

Reference image/logo → downscale 100px → k-means (k=6) in Lab color space → merge near colors (ΔE<10) → roles assign: background = lightest large cluster, text = highest contrast vs background, primary = most saturated large cluster, accent = most saturated small cluster. User editable.

### 33.4 Palette in prompt

Hex → color words nearest-name map ('#C8553D' → 'terracotta'). Prompt mein 'color palette of terracotta, cream and sage' (models hex nahi samajhte). Palette sirf accent guidance hai, dominant color force nahi (warna images artificial lagti hain).

### 33.5 Brand consistency score (post-generation)

`score = 100 - avg(ΔE(dominantColors(pin), palette)) normalized + style match flag`. < 60 → pin par amber badge 'Off-brand colors – regenerate?'. Optional auto-retry once with palette emphasis.

### 33.6 Additional assets (brand ko beautiful banane wale)

Library of transparent PNG/SVG: stickers, arrows, ribbons/badges ('NEW', 'SAVE THIS'), torn-paper edges, frames, corner flourishes, paper/linen textures. Overlay presets inme se pick karte hain; kit mein 'favorite assets' list. Color-tintable (SVG fill = kit accent).

### 33.7 Multi-kit rules

- Duplicate (copy all incl. assets), Reset (to defaults, confirm), active kit sidebar dropdown mein.
- Generate page: Brand Kit toggle ON → kit select button; OFF → kit completely ignored (no logo/ref/palette).
- Job settings_snapshot mein kit ka snapshot (kit edit hone se purani jobs affect nahi).
- Kit-wise stats (pins, cost) Stats page par.

## 34. OpenRouter Text Layer – Exact Logic

### 34.1 Free-model discovery

```
function refreshFreeModels(key):
  list = GET openrouter models endpoint
  free = list.filter(m => m.pricing.prompt == 0 && m.pricing.completion == 0)
  rank by: context_length desc, supports JSON/structured output, recent update
  cache 6 hours; store in settings.model_options
```

Dropdown mein 'free' badge, context size, aur last-success time. User ek primary + ek/do fallback models chun sakta hai.

### 34.2 Call wrapper (har text task isi se guzarta hai)

```
function llm(task, input, schema):
  chain = [user.primary, ...user.fallbacks, ...autoFree]
  for model in chain:
    for attempt in 1..2:
      r = call(model, task.system, input, temperature=task.temp, max_tokens=task.max)
      if r.status==429: backoff; continue
      json = tryParse(r.text) || repairJSON(r.text)      # strip ``` fences, fix trailing commas
      if valid(json, schema): record(cost=0, model); return json
  return ruleBasedFallback(task, input)                  # templates, never block the job
```

Temperatures: idea generator 0.9 (variety), expander 0.7, enhance 0.6, SEO 0.5 (consistency), hook text 0.7, JSON repair 0.

### 34.3 Rule-based fallbacks (jab sab LLM fail)

- Hook text: pin-type title formula + template keyword (e.g. '{N} {keyword} Ideas').
- SEO: title = formula; description = 3 template sentences filled with keyword; alt text = trimmed image prompt; hashtags = from keyword tokens.
- Ideas: composition × setting × object matrix random combination.

Job kabhi sirf text fail hone se nahi rukta; pin par 'basic SEO – regenerate when LLM available' badge.

### 34.4 Safety & privacy

Prompts mein user ke data sirf zaroori hota hai. Key log mein nahi aati. Free model outputs 'untrusted' – HTML/escape karo, URL/hashtag sanitize.

## 35. Library – Exact Logic

### 35.1 Pin card & states

DRAFT (naya), SCHEDULED (date set), DUE (date aaj/guzar gayi, tick nahi), PUBLISHED (tick). Derived status: DUE DB mein nahi, query se compute hota hai: `schedule_date <= today AND used=false`.

### 35.2 Detail editor logic

| Action | Effect | Cost |
|---|---|---|
| Edit title/desc/alt/hashtags | Direct save (debounced 800ms), char counters, SEO score live | Free |
| Edit overlay text/preset/colors | Re-render overlay from raw_image | Free |
| Regenerate image | New Runware call, same prompt, new seed; old version history mein | Paid |
| Variations of this | Naye prompts (section 28.5) with this pin as base | Paid |
| Regenerate SEO only | LLM call | Free (free model) |
| Swap Brand Kit | Overlay re-render with new kit; image same | Free |
| Delete | Soft delete 30 days (trash) | - |

**Raw vs final image:** hamesha dono store karo: raw_image (bina text) aur final_image (overlay ke saath). Isi se free re-edits possible hote hain.

### 35.3 Filters / search / sort

**Filters:** niche, template, brand kit, pin type, model, status, used/unused, schedule month, SEO score range, has-text-mode. **Search:** full-text on title/description/keyword/prompt. **Sort:** newest, scheduled date, SEO score, cost. **Saved filters** (e.g. 'Unused Home Decor pins').

### 35.4 Bulk actions

Select (checkbox / shift-range / select-all-filtered) → Schedule spread, Assign date, Mark used, Download ZIP (compressed option), Export CSV, Change brand kit (re-render), Delete. Har bulk action preview + undo (5 min).

### 35.5 CSV export (bulk upload friendly)

Columns: Title, Media URL/filename, Pinterest board, Description (with hashtags), Link, Publish date, Keywords. Dates ISO format; description = description + hashtags (≤500 total).

## 36. Scheduler – Exact Logic

### 36.1 Per-pin schedule field

schedule_date (date) + optional schedule_time + user timezone (settings). Library mein date/month/year picker (user manually set kare). Validation: past date allow (backfill) lekin warning; ek hi din mein limit warning (e.g. > 15 pins/din Pinterest spam-risk soft warning).

### 36.2 Auto-spread algorithm (bulk schedule)

```
function spread(pins, startDate, perDay, endDate?, slots?, skipWeekends?):
  pins = sort by (nicheMix ? interleave(niche/template) : created_at)
  day = startDate; slotIdx = 0
  for pin in pins:
    while isSkipped(day) or dayCount(day) >= perDay: day += 1
    pin.schedule_date = day; pin.schedule_time = slots[slotIdx % len(slots)]
    slotIdx++ ; if dayCount(day) == perDay: day += 1
  if endDate and day > endDate: warn('X pins overflow')
```

Options: pins/day (1–5 recommended), custom time slots (e.g. 9:00, 14:00, 20:00), skip weekends, spread similar pins apart (same keyword/type ek din mein cluster na ho).

### 36.3 Calendar UI logic

- Views: Month (default), Week, List. Har date cell mein thumbnails (max 3 + '+N'), date number, status dots.
- Click date → day drawer with all pins; drag-drop pin ek date se dusri par (reschedule, optimistic update).
- Unscheduled tray (side): draft pins drag karke calendar par drop karo.
- Color: Scheduled (blue), Due (amber), Published (green tick), Missed (red outline = date guzri aur tick nahi).
- Month header: 'Scheduled 42 · Published 30 · Missed 3'.

### 36.4 Tickmark / Used logic

```
onTick(pin):
  pin.used = true; pin.status = 'PUBLISHED'; pin.used_at = now
  history.push({pin_id, action:'published', at: now, by: user})
  stats.published++ (derived from pins, cached)
onUntick(pin): used=false; status = schedule_date ? 'SCHEDULED' : 'DRAFT'; history entry
```

Tick calendar cell, pin card aur Library teeno jagah same state. Tick se pin Library ke 'Unused' filter se nikal jata hai → dobara post karne ka khatra kam. Tool history mein har tick/untick/schedule change log hoti hai (audit trail).

### 36.5 Reminders

Daily digest (email/in-app): 'Aaj 3 pins due hain'. Missed pins par weekly summary. Optional: download-ready ZIP link aaj ke pins ka.

### 36.6 Future auto-publish (v2)

Pinterest official API (OAuth app approval chahiye) → board select, create pin (image URL, title, description, link, alt text). Abhi sirf data model tayar rakho: pinterest_board_id, pinterest_pin_id, published_via (manual/api). Isse migration aasaan rahegi.

## 37. Download & Smart Compression – Exact Algorithm

```
function compress(img, opts):   # opts: {format, targetKB, floorQ, keepDimensions:true}
  hasText = pin.text_mode != 'none' or detectSharpEdges(img)
  fmt = opts.format || (hasText ? 'webp' or 'png-q' : 'jpeg')
  lo=floorQ(78), hi=95, best=null
  while hi-lo > 1:
    q = (lo+hi)/2
    out = encode(img, fmt, q, progressive=true, chroma = hasText ? '444' : '420', stripMeta=true)
    if sizeKB(out) <= targetKB and ssim(img,out) >= 0.96: best = out; lo = q   # try higher quality
    else hi = q
  return best || encode(img, fmt, floorQ)       # never below floor; report if target not reachable
```

- Defaults: target 350 KB for 1000×1500 (adjustable), floor quality 78, SSIM guard ≥ 0.96.
- PNG overlay-heavy images: palette quantization (pngquant-style) only if SSIM ≥ 0.97, else WebP lossless/near-lossless.
- Dimensions kabhi change nahi hoti (user ne size reduce karna kaha, resolution nahi).
- UI: before/after size + % saved + preview slider (original vs compressed) taake user khud quality dekh sake.
- ZIP: files naming `{keyword-slug}-{pinId}.jpg` (SEO-friendly filenames), CSV sath mein optional.
- Library par 'Always compress on download' preference.

## 38. Stats & Cost – Exact Definitions

| Metric | Definition (query logic) |
|---|---|
| Total pins generated | COUNT(pins WHERE deleted=false) |
| Scheduled | schedule_date IS NOT NULL AND used=false |
| Published | used=true |
| Unpublished | used=false (draft + scheduled + missed) |
| Missed | schedule_date < today AND used=false |
| Pins per month | GROUP BY date_trunc('month', created_at) |
| Published per month | GROUP BY month(used_at) |
| Total spend | SUM(cost_events.amount) (image + text + retries that were charged) |
| Cost per pin | total_spend / pins_generated |
| Cost per published pin | total_spend / published |
| Spend by model / niche / kit / template | JOIN pins + GROUP BY |
| Success rate | done / (done + failed) |
| Wasted spend | cost of pins deleted/never used (insight: 'sasta model se draft test karo') |
| Compression savings | SUM(original_kb - compressed_kb) |

**Charts:** monthly bar (generated vs published), line (spend over time), donut (spend by model), funnel (Generated → Scheduled → Published), top templates by published rate. Date range filter + per-niche filter. **Budget guard:** user monthly budget set kare; 80% par warning, 100% par generate block (override option).

## 39. Settings Page – Exact Logic

| Setting | Logic |
|---|---|
| Runware API key | Masked field, Show toggle, Save, Test Connection (29.5), status chip, last tested time |
| OpenRouter API key | Same + 'Load free models' → dropdown fill, Test (tiny prompt 'reply OK') |
| Default text model + fallbacks | Selected from free list |
| Default image model/ratio/style | Used when no kit/manual choice |
| Currency/timezone | Calendar + cost display |
| Monthly budget | Budget guard |
| Max concurrency | Advanced; clamp to safe range |
| Data | Export all (JSON/CSV/ZIP), delete all data |

Key storage: server-side encrypted; agar multi-user SaaS ho to per-user keys. Key rotate karne par cached model lists clear.

## 40. Master Generate Flow (end-to-end, ek example)

**Scenario:** Way 2b, Template 'Scandinavian Living Room', 12 lines, ratios Listicle 50/Inspo 50, 2:3, 2 variations, Standard model, Canvas overlay, Brand Kit ON, URL on.

1. UI validate → 12 items; template OK; kit OK.
2. Estimate: 12 × 2 = 24 images × $0.0030 = $0.072 + text (free) → modal confirm.
3. Job created (settings_snapshot: template v3, kit snapshot, model Standard).
4. Types: allocate(12, 50/50) → 6/6 → interleave.
5. Expansion (3 LLM calls × 4 lines) → 12 detailed prompts.
6. Variations → 24 prompts (V1 original, V2 changed angle/lighting).
7. Prompt builder → layered prompt with kit palette + 'empty negative space at bottom' + style.
8. 24 JobItems queued; 4 parallel workers; each: Runware (+seedImage if kit ref) → download → sanity → checkpoint.
9. Hook text (LLM, batch of 6) → overlay JSON per pin → render (preset from kit or pin-type default).
10. SEO (batch of 5) → validate → score.
11. Pin rows saved; library cards stream in live; CostEvents written.
12. Job COMPLETED (or PARTIAL + Retry failed). Summary: '24 pins · $0.072 · avg SEO 86'.

## 41. Error & Edge-Case Matrix

| Situation | System behavior |
|---|---|
| Runware key invalid | Job PAUSED, banner 'Fix key in Settings', no items lost |
| Credit exhausted mid-job | PAUSED; completed pins kept; 'Resume' after top-up |
| One model timeout (GPT Image 2 slow) | Per-model timeout 90s, retry once, else item failed with Retry |
| Prompt blocked by content policy | Item failed(policy) + suggestion to rephrase; others continue |
| LLM returns malformed JSON | Repair → retry → fallback model → rule-based |
| Free model rate-limited | Switch to fallback model automatically |
| Overlay text too long | Shorten via LLM or reduce font to min then wrap to max lines then trim with ellipsis (last resort) |
| Logo missing/corrupt | Skip logo + warning, pin still produced |
| Google Font fails | Fallback font, flag in pin notes |
| Reference image not supported by model | Skip + warning chip |
| User closes browser mid-job | Job continues server-side; resume view on return |
| Duplicate prompts | Detected pre-run; user chooses keep/remove |
| Ratios sum ≠ 100 | Auto-normalize prompt or block |
| Same pin double-ticked | Idempotent; history deduped |
| Calendar timezone shifts | Dates stored as date + tz; display in user tz |
| Huge bulk (500+) | Chunked jobs of 100, sequential, one summary |
| Template deleted while job running | Snapshot protects the job |

## 42. Build Milestones with Acceptance Criteria

| # | Milestone | Done when |
|---|---|---|
| M1 | Settings + keys + Test Connection | Valid/invalid keys correctly detected; keys encrypted |
| M2 | Single prompt → image (Runware) → Library | Selected model ID actually used in request; cost recorded |
| M3 | Aspect/variations/quality + cost estimate | Estimate equals actual within 5% on test runs |
| M4 | Overlay engine (11 presets, fit, contrast, logo, URL) | 100 random images: zero unreadable text (contrast ≥ 4.5) |
| M5 | OpenRouter layer + SEO validators | 100 pins: 100% pass length rules; ≥ 95% unique titles |
| M6 | Templates + Way 2 (2a, 2b) + diversity | 30 ideas from 1 template: no duplicate composition+setting |
| M7 | Bulk queue + pin-type ratios + resume | Kill worker mid-job → resumes with zero duplicate charges |
| M8 | Brand Kit (multi, AI-from-website, palette, ref image) | Kit toggle ON/OFF changes output as specified; snapshot works |
| M9 | Scheduler + tickmark + spread | Spread 60 pins/30 days correct; tick syncs in 3 views |
| M10 | Compression + ZIP/CSV | ≥ 60% size cut with SSIM ≥ 0.96 on test set |
| M11 | Stats + budget guard | Numbers reconcile with raw CostEvents |
| M12 | Hardening: error matrix tests, load test (500 items) | All matrix scenarios pass |

## 43. Differentiation Summary (kyun yeh tool jeetega)

1. Niche Template system prompt = har pin relevant + taste-aware (competitors mein nahi).
2. Idea memory + diversity engine = bulk mein bhi har pin unique.
3. Hybrid text rendering (canvas overlay perfect typography) = AI text errors se bachao.
4. Brand Kit with palette, assets, consistency score = professional consistent feed.
5. SEO engine with hard validators + score = Pinterest search-ready.
6. Cost transparency + budget guard + BYO keys = predictable, cheap, no lock-in.
7. Raw + final image storage = free unlimited re-edits.
8. Library → Schedule → Tick → Stats loop = complete workflow, no tool-hopping.
