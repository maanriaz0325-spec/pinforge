# PinForge

> Niche-Aware Pinterest Pin Factory: Generate 50 unique, on-brand, SEO-ready pins in 10 minutes for under $0.50.

PinForge combines niche-specific strategist prompts, multi-model AI image generation (Runware BYO key), free copy models (OpenRouter), a 3-mode typography engine (Canvas overlay, AI in-image, No text), an automated Pinterest SEO engine, and a posting calendar scheduler.

---

## Architecture & Technology Stack

- **Framework:** Next.js 15 (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS + Lucide Icons
- **Database & ORM:** Prisma ORM with SQLite for zero-friction local development, PostgreSQL ready for production
- **Queue & Background Worker:** BullMQ + Redis (`docker-compose.yml` included)
- **Image Processing:** Sharp + Canvas engine
- **Security:** AES-256-GCM encryption at rest for API credentials (`runwareKeyEnc`, `openrouterKeyEnc`)
- **Testing:** Vitest for pure engine & cryptographic units

---

## Quickstart

### 1. Install Dependencies
```bash
cd pinforge
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and `.env.local`:
```bash
cp .env.example .env
cp .env.example .env.local
```

### 3. Initialize Database & Seed
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
This populates:
- The 5 ModelRegistry tiers (Draft FLUX Schnell, Standard SDXL, Premium FLUX Dev, GPT Image 2, Eco Wan)
- The 10 PinTypes (Listicle, How-To, Inspiration, Product, Quote, Infographic, Before/After, Recipe, Comparison, Tips & Mistakes)
- Starter Home Decor niche and Scandinavian Living Room template

### 4. Run Tests
```bash
npm run test
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## App Modules (7 Core Views)
1. **Generate (`/generate`):** Way 1 (Prompt Mode) & Way 2 (Auto-Idea Mode)
2. **Templates (`/templates`):** Niche system prompt strategist editor & quality scores
3. **Library (`/library`):** Raw & final pin storage, SEO copy editor, canvas overlay editor
4. **Schedule (`/schedule`):** Month/week calendar view, auto-spread algorithm, Used tickmarks
5. **Brand Kit (`/brand-kit`):** 5-color palettes, logo positioning, reference seed images
6. **Stats (`/stats`):** Real-time generation spend, cost per pin, budget guard
7. **Settings (`/settings`):** Encrypted Runware & OpenRouter key storage with interactive Test Connection
