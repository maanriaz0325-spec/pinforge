export type AspectRatio = "2:3" | "9:16" | "1:1" | "4:5" | "16:9";

export interface AspectRatioDetails {
  id: AspectRatio;
  label: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  description: string;
}

export const ASPECT_RATIOS: Record<AspectRatio, AspectRatioDetails> = {
  "2:3": {
    id: "2:3",
    label: "Pinterest 2:3",
    name: "Pinterest Standard",
    ratio: "2:3",
    width: 768,
    height: 1152,
    description: "Standard Pinterest vertical pin (Best for feed engagement)",
  },
  "9:16": {
    id: "9:16",
    label: "Tall 9:16",
    name: "Tall / Mobile",
    ratio: "9:16",
    width: 704,
    height: 1280,
    description: "Full-screen vertical format (Stories, Reels & Idea Pins)",
  },
  "1:1": {
    id: "1:1",
    label: "Square 1:1",
    name: "Square",
    ratio: "1:1",
    width: 1024,
    height: 1024,
    description: "Classic square format for versatile multi-platform feeds",
  },
  "4:5": {
    id: "4:5",
    label: "Portrait 4:5",
    name: "Portrait",
    ratio: "4:5",
    width: 768,
    height: 960,
    description: "Instagram & social portrait format with rich detail",
  },
  "16:9": {
    id: "16:9",
    label: "Landscape 16:9",
    name: "Landscape",
    ratio: "16:9",
    width: 1024,
    height: 576,
    description: "Wide horizontal banner format for headers and blogs",
  },
};

export function getDimensionsForAspect(aspect?: string | null): { width: number; height: number; aspect: AspectRatio } {
  if (aspect && aspect in ASPECT_RATIOS) {
    const matched = ASPECT_RATIOS[aspect as AspectRatio];
    return { width: matched.width, height: matched.height, aspect: matched.id };
  }
  return { width: 768, height: 1152, aspect: "2:3" };
}
