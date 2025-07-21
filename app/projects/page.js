'use client';
// app/projects/page.js

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // For linking to individual projects if we add that later
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // Firestore imports
import { db, appId } from '@/lib/firebase'; // Our Firebase instance

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // Mock data for display if Firestore fetching fails or is not ready
  const mockProjects = [
    {
      id: 'mock1',
      title: 'E-commerce Store Redesign',
      description: 'A modern and responsive e-commerce platform built for a boutique fashion brand, focusing on seamless user experience and secure transactions.',
      imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=E-commerce+Project', // <--- CHECK THIS EXACTLY
      projectUrl: '#',
      technologies: ['Next.js', 'Tailwind CSS', 'Stripe', 'Firebase'],
      clientName: 'Fashion Forward Boutique',
      category: 'E-commerce',
      isFeatured: true,
      createdAt: new Date(),
    },
    {
      id: 'mock2',
      title: 'SaaS Dashboard Development',
      description: 'Developed an intuitive and powerful SaaS dashboard for a data analytics startup, providing real-time insights and customizable reporting features.',
      imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=SaaS+Dashboard', // <--- CHECK THIS EXACTLY
      projectUrl: '#',
      technologies: ['React', 'Node.js', 'MongoDB', 'D3.js'],
      clientName: 'Data Insights Co.',
      category: 'SaaS',
      isFeatured: false,
      createdAt: new Date(new Date().setHours(new Date().getHours() - 1)),
    },
    {
      id: 'mock3',
      title: 'Personal Portfolio Website',
      description: 'Crafted a sleek and dynamic online portfolio for a freelance graphic designer, showcasing their diverse work and enabling direct client inquiries.',
      imageUrl: 'https://placehold.co/600x400/666666/FFFFFF?text=Portfolio+Site', // <--- CHECK THIS EXACTLY
      projectUrl: '#',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
      clientName: 'Jane Doe Designs',
      category: 'Portfolio',
      isFeatured: true,
      createdAt: new Date(new Date().setHours(new Date().getHours() - 2)),
    },
  ];


  useEffect(() => {
    setLoading(true);
    setError('');
    setMessage(''); // Clear any previous messages

    const projectsCollectionRef = collection(db, `artifacts/${appId}/public/data/projects`);
    const q = query(projectsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // If there's data in Firestore, display it
        const fetchedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(fetchedProjects);
        setMessage('Projects loaded from database.');
        setError('');
      } else {
        // If Firestore collection is empty, display mock data
        setProjects(mockProjects);
        setMessage('No projects found in the database. Displaying mock data.');
        setError('');
      }
      setLoading(false);
    }, (err) => {
      // If there's an error fetching from Firestore (e.g., permissions), display mock data
      console.error("Error fetching projects from Firestore:", err);
      setError("Failed to load projects from our database. Displaying examples.");
      setProjects(mockProjects); // Fallback to mock data on error
      setLoading(false);
    });

    // Cleanup function: Stop listening to real-time updates when the component unmounts
    return () => unsubscribe();
  }, [appId, db]); // Dependencies: Re-run effect if appId or db instance changes

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">
          Our Portfolio of Work
        </h1>
        <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Explore a selection of our recent web development projects, showcasing our expertise and diverse capabilities across various industries.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-yellow-100 text-yellow-700 p-3 rounded-md mb-4 text-center">
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No projects to display yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={600} // Larger width for project display
                    height={400} // Larger height for project display
                    className="w-full h-48 object-cover" // Ensure image covers its space
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/000000?text=Image+Error"; }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies && project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mb-2"><strong>Client:</strong> {project.clientName}</p>
                  <p className="text-gray-600 text-xs mb-2"><strong>Category:</strong> {project.category}</p>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm font-semibold mt-4 inline-block"
                    >
                      View Live Project &rarr;
                    </a>
                  )}
                  {project.isFeatured && (
                    <span className="text-sm font-semibold text-purple-600 mt-2 block">✨ Featured Project</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}