import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 
                0px 1px 0px 0px rgba(25,28,33,0.02), 
                0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
    },
  },
  plugins: [
    function addVariablesForColors({ addBase, theme }) {
      const allColors = flattenColorPalette(theme("colors"));
      const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );

      addBase({
        ":root": newVars,
      });
    },
  ],
};

export default config;
