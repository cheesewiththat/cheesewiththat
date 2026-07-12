import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bone: "var(--bone)",
        ink: "var(--ink)",
        charcoal: "var(--charcoal)",
        cream: "var(--warm-white)",
        brass: "var(--brass)",
        cobalt: "var(--cobalt)",
        vermilion: "var(--vermilion)",
        chartreuse: "var(--chartreuse)",
        plum: "var(--plum)",
        teal: "var(--teal)",
        racing: "var(--racing-red)",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Iowan Old Style", "Georgia", "serif"],
        sans: ["Space Grotesk", "Avenir Next", "Arial", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "monospace"],
      },
      maxWidth: { page: "90rem" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
