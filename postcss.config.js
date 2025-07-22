// postcss.config.js

// Use CommonJS export syntax for compatibility
module.exports = {
  plugins: {
    // Refer to plugins by their package names as strings.
    // PostCSS and Next.js's build system will handle the actual require.
    tailwindcss: {},
    autoprefixer: {},
  },
};
