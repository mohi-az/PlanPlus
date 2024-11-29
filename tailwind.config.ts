import type { Config } from "tailwindcss";
import daisyui from "daisyui";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/skeletons/**/*.{js,ts,jsx,tsx,mdx}",

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
      width:{
          '18': '72px'
      },
      height: {
        "remain": "calc(100dvh - 10%)",
        "120": "480px",
        "130": "520px",
        "Adivider": "calc(100vh - 23%)",
        "AdividerWithoutBTN": "calc(100vh - 12%)",
        "remainInDashboard": "calc(100dvh - 42%)",
      },
      minHeight: {
        "remain": "calc(100dvh - 10%)",
        "120": "480px",
        "130": "520px",
        "Adivider": "calc(100vh - 23%)",
        "AdividerWithoutBTN": "calc(100vh - 12%)",

      },
      maxHeight: {
        "remain": "calc(100dvh - 10%)",
        "120": "480px",
        "130": "520px",
        "Adivider": "calc(100vh - 23%)",
        "AdividerWithoutBTN": "calc(100vh - 12%)",
      },
      borderWidth: {
        "1": "1px"
      },
      fontSize: {
        "smX2": ['0.93rem', '1.4rem'],
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "aqua", "dracula", "dim", "forest", "night"]

  }
};
export default config;
