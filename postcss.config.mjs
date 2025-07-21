// postcss.config.mjs

// Use ES Module export syntax
export default {
  plugins: {
    // Refer to plugins by their package names as strings.
    // PostCSS and Next.js's build system will handle the actual import/require.
    tailwindcss: {},
    autoprefixer: {},
  },
};
