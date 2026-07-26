/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14131A",
          surface: "#1E1C26",
          surface2: "#26232F",
          border: "#322F3D",
        },
        paper: {
          DEFAULT: "#F2EFE9",
          muted: "#A39FB0",
        },
        violet: {
          DEFAULT: "#8B7FFF",
          dim: "#6A5FD1",
        },
        coral: {
          DEFAULT: "#FF8B6B",
          dim: "#D96F52",
        },
        teal: {
          DEFAULT: "#5EEAD4",
        },
        danger: {
          DEFAULT: "#FF6B7A",
        },
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        pulseBar: {
          "0%, 100%": { transform: "scaleY(0.3)", opacity: "0.5" },
          "50%": { transform: "scaleY(1)", opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        pulseBar: "pulseBar 1.1s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
