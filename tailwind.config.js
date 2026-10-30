/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#151B2B",
          dark: "#0D111C",
          light: "#1E263C",
          card: "#192033",
        },
        gold: {
          DEFAULT: "#C7A45A",
          light: "#DFC583",
          dark: "#9E7E36",
          hover: "#B89549",
        },
        ivory: {
          DEFAULT: "#FBF7EF",
          dark: "#F0E8D7",
          muted: "#E5DCC9",
        },
        burgundy: {
          DEFAULT: "#6F1D35",
          hover: "#872441",
          dark: "#4E1324",
        },
        charcoal: {
          DEFAULT: "#222633",
          light: "#2C3243",
          dark: "#191C26",
        },
        mutedgray: "#5F6675",
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Poppins", "sans-serif"],
        hindi: ["Rozha One", "Tiro Devanagari Hindi", "Yatra One", "sans-serif"],
      },
    },
  },
  plugins: [],
};

