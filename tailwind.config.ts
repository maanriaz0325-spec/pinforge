import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pin: {
          red: "#E60023",
          darkred: "#ad081b",
          lightred: "#fbe8ea",
        },
      },
    },
  },
  plugins: [],
};

export default config;
