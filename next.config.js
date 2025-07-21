// next.config.js
// This file uses ES Module syntax (import/export) instead of CommonJS (module.exports)

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
    contentDispositionType: 'inline', // <--- CHANGED FROM 'header' to 'inline'
    // --- END SVG SUPPORT ---
  },
  // You can add other Next.js configurations here if needed later
};

export default nextConfig;