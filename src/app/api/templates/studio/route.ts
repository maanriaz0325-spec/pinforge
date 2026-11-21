import { NextRequest, NextResponse } from "next/server";
import templatesData from "@/server/data/apd_templates.json";

export interface StudioTemplate {
  id: string;
  name: string;
  description: string;
  primaryCategory: string;
  categories: string[];
  designTypes: string[];
  width: number;
  height: number;
  aspectRatio: string;
  layoutId: string;
  collageGap: number;
  fonts: string[];
  colors: string[];
  layerTexts: string[];
  headlinePreview: string;
  visualConfig?: {
    badge?: { text: string; shape: string; bg: string; color: string } | null;
    blockStyle?: string;
    bandColor?: string;
    accentColor?: string;
    scriptWord?: string | null;
    photoTheme?: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const layout = searchParams.get("layout");
    const ratio = searchParams.get("ratio");
    const query = searchParams.get("q")?.toLowerCase();

    let filtered: StudioTemplate[] = templatesData as StudioTemplate[];

    if (category && category !== "all") {
      const catLower = category.toLowerCase();
      filtered = filtered.filter((t) =>
        t.primaryCategory.toLowerCase() === catLower ||
        t.categories.some((c) => c.toLowerCase() === catLower || c.toLowerCase().includes(catLower))
      );
    }

    if (layout && layout !== "all") {
      filtered = filtered.filter((t) => t.layoutId.toLowerCase() === layout.toLowerCase());
    }

    if (ratio && ratio !== "all") {
      filtered = filtered.filter((t) => t.aspectRatio === ratio);
    }

    if (query) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.headlinePreview.toLowerCase().includes(query) ||
          t.categories.some((c) => c.toLowerCase().includes(query))
      );
    }

    // Category summary counts
    const categoryCounts: Record<string, number> = {
      All: (templatesData as StudioTemplate[]).length,
    };
    (templatesData as StudioTemplate[]).forEach((t) => {
      categoryCounts[t.primaryCategory] = (categoryCounts[t.primaryCategory] || 0) + 1;
      t.categories.forEach((c) => {
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      });
    });

    return NextResponse.json({
      success: true,
      total: filtered.length,
      categoryCounts,
      data: filtered,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load studio templates";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
