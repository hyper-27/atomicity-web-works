// app/about/page.js

'use client'; // This is a client component

import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb, Users, CheckCircle, Award } from 'lucide-react'; // Icons for values/sections

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-16 px-4 bg-gray-50 font-sans">
      <div className="container mx-auto max-w-6xl bg-white p-8 md:p-12 rounded-xl shadow-lg">

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            About Atomicity Web Works
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We are a dedicated web development agency committed to building precise, powerful, and pixel-perfect digital solutions for businesses of all sizes.
          </p>
        </section>

        {/* Our Story/Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story & Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Founded with a passion for innovation and a commitment to excellence, Atomicity Web Works began with a simple goal: to transform ideas into impactful online experiences. We believe that a strong digital presence is the cornerstone of modern business success.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to empower businesses by crafting bespoke web solutions that are not only visually stunning but also highly functional, scalable, and secure. We aim to be your trusted partner in navigating the complex digital landscape.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {/* Placeholder Image for Story */}
            <Image
              src="https://placehold.co/500x350/E0E7FF/3F51B5?text=Our+Story"
              alt="Our Story"
              width={500}
              height={350}
              className="rounded-lg shadow-md object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/500x350/cccccc/000000?text=Image+Error"; }}
            />
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
              <Lightbulb size={48} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700 text-sm">
                We stay ahead of the curve, embracing new technologies and creative approaches to deliver cutting-edge solutions.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
              <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-700 text-sm">
                Excellence is non-negotiable. We build robust, reliable, and high-performing websites.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-md">
              <Users size={48} className="text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Client-Centricity</h3>
              <p className="text-gray-700 text-sm">
                Your vision is our priority. We collaborate closely to ensure your goals are met and exceeded.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section (Placeholder) */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-10">Meet Our Team</h2>
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-8 md:space-y-0">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/3 max-w-sm">
              <Image
                src="https://placehold.co/150x150/A78BFA/FFFFFF?text=Founder"
                alt="Founder Name"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover border-4 border-purple-300"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/cccccc/000000?text=Image+Error"; }}
              />
              <h3 className="text-2xl font-semibold text-gray-900">Your Name (Founder)</h3>
              <p className="text-blue-600 font-medium mb-2">Lead Developer & Visionary</p>
              <p className="text-gray-700 text-sm">
                Passionate about creating robust and intuitive web applications that drive business growth.
              </p>
            </div>
            {/* You can add more team members here if applicable */}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-10">Why Choose Atomicity Web Works?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm flex items-start text-left">
              <Award size={36} className="text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expertise & Experience</h3>
                <p className="text-gray-700 text-sm">
                  Years of experience in modern web technologies, delivering successful projects across various industries.
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm flex items-start text-left">
              <Lightbulb size={36} className="text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailored Solutions</h3>
                <p className="text-gray-700 text-sm">
                  We don't believe in one-size-fits-all. Every project is custom-built to meet your unique business needs.
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm flex items-start text-left">
              <CheckCircle size={36} className="text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Process</h3>
                <p className="text-gray-700 text-sm">
                  From concept to launch, we keep you informed every step of the way with clear communication.
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm flex items-start text-left">
              <Users size={36} className="text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dedicated Support</h3>
                <p className="text-gray-700 text-sm">
                  Our commitment doesn't end at launch. We provide ongoing support and maintenance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action at the bottom of About page */}
        <section className="text-center bg-blue-600 text-white p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-lg mb-6">
            Let's discuss your next project and bring your digital vision to life.
          </p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-md hover:bg-gray-100 transform hover:scale-105 transition duration-300">
            Get a Free Consultation
          </Link>
        </section>

      </div>
    </div>
  );
}
