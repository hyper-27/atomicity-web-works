'use client';
// app/services/page.js


import Link from 'next/link';

// Import Lucide React Icons (UPDATED)
import {
  Code,          // Used for Custom Web Development
  ShoppingCart,  // Used for E-commerce Solutions (this was missing!)
  Lightbulb,     // Used for UI/UX Design & Branding
  Search,        // Used for SEO & Digital Marketing
  Shield,        // Used for Website Maintenance & Support
  Brain,         // Used for AI & Automation Integration
  // The icons below are not directly used in ServiceCard but are good to have for future use
  // or if you copy-pasted from the home page imports.
  // You can remove them if you want to keep imports minimal, but keeping them doesn't hurt.
  Rocket, LayoutDashboard, TrendingUp, Megaphone, FileText, DollarSign, Cloud, Handshake
} from 'lucide-react';

export default function Services() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">
          Our Comprehensive Digital Solutions
        </h1>
        <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Atomicity Web Works offers a full spectrum of services designed to elevate your online presence, streamline operations, and drive measurable business growth.
        </p>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Category 1: Custom Web Development */}
          <ServiceCard
            icon={<Code size={48} className="text-indigo-600" />}
            title="Custom Web Development"
            description="From dynamic web applications to robust enterprise solutions, we build bespoke platforms tailored to your unique business needs."
            features={[
              "Full-stack Development (Next.js, Node.js, React)",
              "API Development & Integration",
              "Database Design & Optimization",
              "Scalable Architecture"
            ]}
          />

          {/* Category 2: E-commerce Solutions */}
          <ServiceCard
            icon={<ShoppingCart size={48} className="text-teal-600" />}
            title="E-commerce Solutions"
            description="Launch and scale your online store with secure, user-friendly, and high-converting e-commerce platforms."
            features={[
              "Shopify & WooCommerce Development",
              "Payment Gateway Integration",
              "Inventory & Order Management Systems",
              "Custom Product Pages"
            ]}
          />

          {/* Category 3: UI/UX Design & Branding */}
          <ServiceCard
            icon={<Lightbulb size={48} className="text-yellow-600" />}
            title="UI/UX Design & Branding"
            description="Crafting intuitive user interfaces and captivating user experiences that resonate with your audience and strengthen your brand identity."
            features={[
              "Wireframing & Prototyping",
              "Responsive Web Design",
              "Brand Guidelines & Identity",
              "User Research & Testing"
            ]}
          />

          {/* Category 4: SEO & Digital Marketing */}
          <ServiceCard
            icon={<Search size={48} className="text-green-600" />}
            title="SEO & Digital Marketing"
            description="Increase your online visibility, attract more traffic, and convert visitors into loyal customers with our targeted strategies."
            features={[
              "Search Engine Optimization (SEO)",
              "Content Strategy & Marketing",
              "Social Media Integration",
              "Analytics & Reporting"
            ]}
          />

          {/* Category 5: Website Maintenance & Support */}
          <ServiceCard
            icon={<Shield size={48} className="text-red-600" />}
            title="Website Maintenance & Support"
            description="Ensure your website remains secure, fast, and up-to-date with our reliable ongoing maintenance and support plans."
            features={[
              "Regular Security Audits",
              "Performance Optimization",
              "Content Updates & Backups",
              "24/7 Technical Support"
            ]}
          />

          {/* Category 6: AI & Automation Integration */}
          <ServiceCard
            icon={<Brain size={48} className="text-purple-600" />}
            title="AI & Automation Integration"
            description="Leverage the power of Artificial Intelligence and automation to streamline processes, enhance customer interaction, and gain insights."
            features={[
              "AI Chatbot Development",
              "Workflow Automation",
              "Data Analysis & Prediction",
              "Custom AI Model Integration"
            ]}
          />

        </div> {/* End Service Categories Grid */}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Transform Your Digital Presence?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Each project begins with a deep understanding of your goals. Let's discuss how our expertise can drive your success.
          </p>
          <Link href="/contact" className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 inline-block">
            Get a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Reusable ServiceCard Component ---
// This is a separate, smaller React component that we'll use multiple times
// to display each service category in a consistent way.
function ServiceCard({ icon, title, description, features }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition duration-300">
      <div className="mb-6">{icon}</div> {/* Icon for the service */}
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3> {/* Service title */}
      <p className="text-gray-700 mb-6 flex-grow">{description}</p> {/* Service description */}
      <ul className="text-gray-600 space-y-2 text-left w-full"> {/* List of features */}
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span> {/* Checkmark icon */}
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}