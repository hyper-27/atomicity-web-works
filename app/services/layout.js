// app/services/layout.js
// This file is a Server Component by default and defines metadata for the /services route.

export const metadata = {
  title: "Our Services", // This will be the specific title for the Services page
  description:
    "Explore the comprehensive digital solutions offered by Atomicity Web Works, including custom web development, e-commerce, UI/UX design, SEO, and AI integration.",
};

// This layout component simply renders its children (which will be app/services/page.js)
// It's a Server Component, so it can export metadata.
export default function ServicesLayout({ children }) {
  return <>{children}</>; // A minimal wrapper, just passing children through
}
