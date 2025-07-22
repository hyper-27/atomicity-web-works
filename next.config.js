// next.config.js

// Use CommonJS export syntax for compatibility
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co', // For your current mock images
      // Add other image domains here as needed in the future, e.g.:
      // 'firebasestorage.googleapis.com', // If you upload images to Firebase Storage
      // 'cdn.example.com', // Any other domain your images might come from
    ],
    // --- CORRECTED SVG SUPPORT ---
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    // --- END SVG SUPPORT ---
  },
  // You can add other Next.js configurations here if needed later
};

module.exports = nextConfig; // Export using CommonJS syntax
