// components/LayoutClientWrapper.js

"use client"; // This component must be a Client Component

// Removed: import { Inter } from 'next/font/google';
import Header from "./Header";
import Footer from "./Footer";

// Removed: const inter = Inter({ subsets: ['latin'] });

// This component will contain all client-side logic for the layout
export default function LayoutClientWrapper({ children }) {
  return (
    <>
      {" "}
      {/* Use a React Fragment instead of body */}
      <Header />
      {children}
      <Footer />
    </>
  );
}
