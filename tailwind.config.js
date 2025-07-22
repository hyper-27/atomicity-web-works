// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Define custom keyframes for animations
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.4" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      // Map keyframes to animation utilities
      animation: {
        "pulse-slow": "pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      // Custom easing function for the logo slide-in
      transitionTimingFunction: {
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      // Ensure Tailwind's default colors include slate and indigo if not explicitly imported
      colors: {
        // You can define custom colors here if needed,
        // but for now, we rely on Tailwind's default palette which includes slate, indigo, teal etc.
      },
    },
  },
  plugins: [],
};
