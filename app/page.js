// app/page.js

"use client"; // This directive is necessary as this page uses client-side hooks like useState and useEffect

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // For navigation links

// Firebase Firestore imports for fetching featured projects and testimonials
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, appId } from "@/lib/firebase"; // Ensure db and appId are correctly imported from your firebase config

// Lucide React Icons for visual appeal in various sections
import {
  Rocket,
  ShieldCheck,
  Users,
  Code,
  ShoppingCart,
  Brain,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Handshake,
  Star,
} from "lucide-react"; // Using icons from your previous preferred set

export default function Home() {
  // State for Hero section entrance animation
  const [isVisible, setIsVisible] = useState(false);

  // State variables for managing featured projects data
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingFeaturedProjects, setLoadingFeaturedProjects] = useState(true);
  const [featuredProjectsError, setFeaturedProjectsError] = useState("");

  // State variables for managing testimonials data
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");

  // useEffect hook for Hero section entrance animation
  // This runs once when the component mounts to trigger the animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // useEffect hook to fetch featured projects from Firestore
  // This runs once when the component mounts and sets up a real-time listener
  useEffect(() => {
    setLoadingFeaturedProjects(true); // Set loading to true when fetching starts
    setFeaturedProjectsError(""); // Clear any previous errors

    // Construct the Firestore collection reference for public projects
    const projectsCollectionRef = collection(
      db,
      `artifacts/${appId}/public/data/projects`,
    );

    // Create a query to:
    // 1. Filter documents where 'isFeatured' field is true
    // 2. Order the results by 'createdAt' field in descending order (newest first)
    const q = query(
      projectsCollectionRef,
      where("isFeatured", "==", true), // Filter: only show projects marked as featured
      orderBy("createdAt", "desc"), // Order: newest featured projects first
    );

    // onSnapshot sets up a real-time listener to the query.
    // It fetches the initial data and then listens for any changes in the collection.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          // If documents are found, map them to our state
          const fetchedProjects = snapshot.docs.map((doc) => ({
            id: doc.id, // Document ID from Firestore
            ...doc.data(), // All other fields from the document
          }));
          setFeaturedProjects(fetchedProjects); // Update state with fetched projects
        } else {
          // If no featured projects are found, set the state to an empty array
          setFeaturedProjects([]);
        }
        setLoadingFeaturedProjects(false); // Set loading to false once data is fetched or determined empty
      },
      (err) => {
        // Error callback: handles any errors during fetching
        console.error("Error fetching featured projects from Firestore:", err);
        setFeaturedProjectsError(
          "Failed to load featured projects. Please check your internet connection or Firebase permissions.",
        );
        setFeaturedProjects([]); // Ensure no old data is displayed on error
        setLoadingFeaturedProjects(false); // Set loading to false on error
      },
    );

    // Cleanup function: This is crucial to unsubscribe from the real-time listener
    // when the component unmounts, preventing memory leaks.
    return () => unsubscribe();
  }, [appId, db]); // Dependencies: Re-run this effect if appId or db instance changes

  // useEffect hook to fetch testimonials from Firestore
  useEffect(() => {
    setLoadingTestimonials(true);
    setTestimonialsError("");

    const testimonialsCollectionRef = collection(
      db,
      `artifacts/${appId}/public/data/testimonials`,
    );
    const q = query(
      testimonialsCollectionRef,
      where("isApproved", "==", true), // Only show approved testimonials
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedTestimonials = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTestimonials(fetchedTestimonials);
        } else {
          setTestimonials([]);
        }
        setLoadingTestimonials(false);
      },
      (err) => {
        console.error("Error fetching testimonials:", err);
        setTestimonialsError(
          "Failed to load testimonials. Please check your internet connection or Firebase permissions.",
        );
        setTestimonials([]);
        setLoadingTestimonials(false);
      },
    );

    return () => unsubscribe();
  }, [appId, db]);

  return (
    // Main container for the homepage content.
    // flex flex-col: Makes it a flex container and stacks children vertically.
    // min-h-screen: Ensures it takes at least the full viewport height, pushing the footer down.
    // bg-gray-50 text-gray-800: Sets a light gray background and dark text color.
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section: The main introductory section of the homepage */}
      {/* flex-shrink-0: Prevents this section from shrinking if main becomes a flex container */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-4 bg-slate-900 text-white overflow-hidden flex-shrink-0">
        {/* Subtle background gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 opacity-90 z-0"></div>
        {/* Abstract background shapes for visual interest */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute w-64 h-64 bg-indigo-500 rounded-full -top-16 -left-16 blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute w-80 h-80 bg-teal-500 rounded-full -bottom-20 -right-20 blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>
        </div>

        {/* Content with fade-in and slide-in animations */}
        <div
          className={`z-10 max-w-4xl mx-auto transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src="/atomicity-logo.png?v=2" // Using cache-busting parameter
            alt="Atomicity Web Works Logo"
            width={150}
            height={150}
            className="rounded-full shadow-xl mb-6 border-4 border-white block mx-auto transform transition-transform duration-1000 ease-out-back object-contain" // Added object-contain
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(-50px)",
            }}
          />
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Atomicity Web Works
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-300">
            Crafting Digital Excellence, One Pixel at a Time.
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 inline-block animate-fade-in-up delay-600"
          >
            Get a Free Consultation
          </Link>
        </div>
      </section>

      {/* About Us / Introduction Section: Clean white background, ample whitespace */}
      <section className="py-20 px-4 bg-white text-gray-800 flex-shrink-0">
        <div className="container mx-auto max-w-4xl text-center">
          <Rocket
            size={64}
            className="text-indigo-600 mx-auto mb-6 animate-bounce-subtle"
          />
          <h2 className="text-4xl font-bold mb-6">
            Who We Are: Your Digital Architects
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            Atomicity Web Works is more than just a web agency; we are your
            strategic partners in the digital realm. We specialize in
            transforming visionary concepts into robust, scalable, and
            user-centric web applications that don't just exist, but truly
            thrive.
          </p>
          <p className="text-lg leading-relaxed">
            Our passion lies in the meticulous craft of code and design,
            ensuring every project is a masterpiece of precision and
            performance. From captivating user interfaces to powerful backend
            infrastructures, we build digital experiences that are tailored to
            elevate your brand and drive tangible business growth.
          </p>
          <Link
            href="/about"
            className="mt-8 px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300 inline-block"
          >
            Uncover Our Story
          </Link>
        </div>
      </section>

      {/* Our Expertise Section: Dark background for visual contrast and depth */}
      <section className="py-20 px-4 bg-slate-800 text-white flex-shrink-0">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Core Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expertise Card 1 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <Code size={48} className="text-indigo-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                Custom Web Development
              </h3>
              <p className="text-gray-200">
                Bespoke web applications built from the ground up to meet your
                exact specifications and business logic.
              </p>
            </div>
            {/* Expertise Card 2 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <ShoppingCart size={48} className="text-teal-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                E-commerce Solutions
              </h3>
              <p className="text-gray-200">
                Powerful online stores designed for seamless user experience and
                maximum conversions.
              </p>
            </div>
            {/* Expertise Card 3 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <Brain size={48} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                AI & Automation Integrations
              </h3>
              <p className="text-gray-200">
                Leverage artificial intelligence and automation to streamline
                operations and enhance user engagement.
              </p>
            </div>
            {/* Expertise Card 4 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <LayoutDashboard
                size={48}
                className="text-green-400 mx-auto mb-4"
              />
              <h3 className="2xl font-semibold mb-3">Intuitive Admin Panels</h3>
              <p className="text-gray-200">
                Empower your team with custom, easy-to-use dashboards for
                complete control over your content and data.
              </p>
            </div>
            {/* Expertise Card 5 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <ShieldCheck size={48} className="text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                Security & Optimization
              </h3>
              <p className="text-gray-200">
                Building secure, high-performance websites optimized for speed
                and search engine visibility.
              </p>
            </div>
            {/* Expertise Card 6 */}
            <div className="bg-slate-700 p-8 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <Users size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                User Experience (UX) Design
              </h3>
              <p className="text-gray-200">
                Crafting engaging and intuitive user journeys that keep your
                audience captivated.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300 inline-block"
            >
              View All Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section: Displays projects marked as 'featured' in Firestore */}
      <section className="py-16 px-4 bg-white flex-shrink-0">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Our Featured Work
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Discover some of our most impactful projects that showcase our
            innovative solutions and design excellence.
          </p>

          {/* Display error message if fetching featured projects failed */}
          {featuredProjectsError && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {featuredProjectsError}
            </p>
          )}

          {/* Conditional rendering based on loading state and number of featured projects */}
          {loadingFeaturedProjects ? (
            // Skeleton Loader for Featured Projects
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {Array(3)
                .fill(0)
                .map(
                  (
                    _,
                    index, // Display 3 skeleton cards
                  ) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="w-full h-48 bg-gray-200"></div>{" "}
                      {/* Image skeleton */}
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>{" "}
                        {/* Title skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>{" "}
                        {/* Description line 1 */}
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>{" "}
                        {/* Description line 2 */}
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>{" "}
                        {/* Tech tags skeleton */}
                      </div>
                    </div>
                  ),
                )}
            </div>
          ) : featuredProjects.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No featured projects to display yet. Use the admin panel to mark
              some projects as featured!
            </p>
          ) : (
            // Grid layout for displaying featured project cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                // Each project card
                <div
                  key={project.id}
                  className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  {project.imageUrl && (
                    // Next.js Image component for optimized image display
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={600} // Base width for image optimization
                      height={400} // Base height for image optimization
                      className="w-full h-48 object-cover" // Tailwind classes for responsive sizing and aspect ratio
                      // onError: Fallback for broken image URLs
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400/cccccc/000000?text=Image+Error";
                      }}
                    />
                  )}
                  <div className="p-6 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    {/* line-clamp-3: Limits description to 3 lines for consistent card height */}
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies &&
                        project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                    <p className="text-gray-600 text-xs mb-2">
                      <strong>Client:</strong> {project.clientName}
                    </p>
                    {/* Link to the main projects page (can be updated to individual project pages later) */}
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-indigo-600 hover:underline text-sm font-semibold mt-4 inline-block"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Button to view all projects */}
          <div className="mt-12">
            <Link
              href="/projects"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 inline-block"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Snippet Section: Displays approved testimonials from Firestore */}
      <section className="py-16 px-4 w-full bg-gray-100 text-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">What Our Clients Say</h2>

          {testimonialsError && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
              {testimonialsError}
            </p>
          )}

          {loadingTestimonials ? (
            // Skeleton Loader for Testimonials
            <div className="bg-gray-100 p-8 rounded-lg shadow-md border-l-4 border-indigo-600 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>{" "}
              {/* Star icon placeholder */}
              <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>{" "}
              {/* Quote line 1 */}
              <div className="h-6 bg-gray-200 rounded w-5/6 mx-auto mb-6"></div>{" "}
              {/* Quote line 2 */}
              <div className="h-5 bg-gray-200 rounded w-1/4 mx-auto"></div>{" "}
              {/* Client name skeleton */}
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No testimonials to display yet. Encourage your clients to share
              their feedback!
            </p>
          ) : (
            // Display the first testimonial (or loop for more if desired, with a carousel)
            <div className="bg-gray-50 p-8 rounded-lg shadow-md border-l-4 border-indigo-600 mb-8">
              <Star
                size={32}
                className="text-yellow-500 mx-auto mb-4"
                fill="currentColor"
              />
              <p className="text-xl italic text-gray-700 mb-6">
                "{testimonials[0].quote}"
              </p>
              <p className="font-semibold text-lg text-gray-900">
                - {testimonials[0].clientName}
                {testimonials[0].clientTitle
                  ? `, ${testimonials[0].clientTitle}`
                  : ""}
              </p>
            </div>
          )}
          <Link
            href="/testimonials"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
          >
            Read More Testimonials
          </Link>
        </div>
      </section>

      {/* Our Commitment to Excellence Section: Light background for contrast */}
      <section className="py-20 px-4 bg-gray-100 text-gray-800 flex-shrink-0">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Commitment to Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Commitment Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
              <Lightbulb size={48} className="text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                Innovative Solutions
              </h3>
              <p className="text-gray-600">
                We stay ahead of the curve, integrating the latest technologies
                to give you a competitive edge.
              </p>
            </div>
            {/* Commitment Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
              <Handshake size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                Partnership Approach
              </h3>
              <p className="text-gray-600">
                We work hand-in-hand with you, ensuring transparency and
                collaboration from concept to launch.
              </p>
            </div>
            {/* Commitment Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300">
              <TrendingUp size={48} className="text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3">
                Results-Driven Focus
              </h3>
              <p className="text-gray-600">
                Our ultimate goal is to deliver digital products that achieve
                your business objectives and drive growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section: Consistent dark background */}
      <section className="py-20 px-4 bg-slate-900 text-white text-center flex-shrink-0">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Ready to Build Your Digital Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and turn your ideas into a powerful
            online presence.
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 inline-block"
          >
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
