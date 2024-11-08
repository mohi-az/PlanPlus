import type { Config } from "tailwindcss";
import daisyui from "daisyui";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: '#171821',
      }
      ,
      height: {
        "remain": "calc(100vh - 60px)"
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "aqua", "dracula", "dim", "forest","night"]

  }
};
export default config;
