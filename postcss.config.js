// postcss.config.js

// Use CommonJS export syntax for compatibility
module.exports = {
  plugins: {
    // THIS IS THE CRUCIAL CHANGE: Use the full package name as a string key
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
