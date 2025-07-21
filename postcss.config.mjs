// postcss.config.mjs

// Import the PostCSS plugin for Tailwind CSS
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer'; // Autoprefixer is also a PostCSS plugin

// Use ES Module export syntax
export default {
  plugins: {
    // Use the imported tailwindcss plugin
    [tailwindcss]: {},
    // Use the imported autoprefixer plugin
    [autoprefixer]: {},
  },
};
