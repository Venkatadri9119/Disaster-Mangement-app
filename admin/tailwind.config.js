/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
          hover: "#1E293B"
        },
        emergency: {
          critical: "#EF4444",
          high: "#F97316",
          normal: "#10B981",
          volunteer: "#3B82F6",
          shelter: "#8B5CF6",
          resource: "#F59E0B"
        }
      }
    },
  },
  plugins: [],
}
