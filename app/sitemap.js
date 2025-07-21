// app/sitemap.js

// This file defines the XML sitemap for your website.
// Next.js automatically generates sitemap.xml from this file.

export default function sitemap() {
  const baseUrl = 'https://www.atomicitywebworks.com'; // IMPORTANT: Replace with your actual deployed domain!

  return [
    {
      url: baseUrl, // Home page
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Highest priority for the home page
    },
    {
      url: `${baseUrl}/services`, // Services page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rates`, // Rates page
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`, // Projects page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`, // Testimonials page
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`, // About Us page
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`, // Contact Us page
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // IMPORTANT: Add more URLs here as you create new public pages.
    // For dynamic content like individual project pages (if you add them later),
    // you would fetch data from Firestore and dynamically generate URLs here.
  ];
}