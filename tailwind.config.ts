import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Gradients
    "from-amber-500", "to-emerald-500",
    "from-teal-500", "to-emerald-600",
    "from-emerald-500", "to-teal-600", "to-teal-700",
    "from-purple-500", "to-pink-500", "to-pink-600",
    "from-blue-500", "to-cyan-600", "to-indigo-600",
    "from-blue-600", "to-indigo-700",
    "from-amber-500", "to-rose-500", "to-orange-600",
    "from-indigo-500", "to-violet-600", "to-purple-600",
    "from-indigo-600", "to-purple-800",
    "from-sky-500", "to-blue-600",
    "from-orange-500", "to-amber-600",
    "from-cyan-500", "to-blue-700",
    "from-rose-500", "to-amber-500",
    // Badges & text
    "bg-emerald-50", "text-emerald-700",
    "bg-blue-50", "text-blue-700",
    "bg-amber-50", "text-amber-700",
    "bg-purple-50", "text-purple-700",
    "bg-cyan-50", "text-cyan-700",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
