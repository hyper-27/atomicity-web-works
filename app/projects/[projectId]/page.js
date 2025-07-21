// app/projects/[projectId]/page.js

'use client'; // This page uses client-side hooks like useState and useEffect

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db, appId } from '@/lib/firebase'; // Import our Firebase db and appId
import Image from 'next/image'; // For displaying project images
import Link from 'next/link'; // For navigation back to projects list
import { ExternalLink, Tag, User, Calendar } from 'lucide-react'; // Icons for details

export default function ProjectDetailsPage({ params }) {
    const { projectId } = params; // Get the dynamic project ID from the URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError('');
            try {
                // Construct the Firestore document reference using the projectId
                const projectDocRef = doc(db, `artifacts/${appId}/public/data/projects`, projectId);
                const docSnap = await getDoc(projectDocRef); // Fetch the document

                if (docSnap.exists()) {
                    // If the document exists, set its data to state
                    setProject({ id: docSnap.id, ...docSnap.data() });
                } else {
                    // If no document found with that ID
                    setError('Project not found or invalid ID.');
                }
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to load project details. Please try again.');
            } finally {
                setLoading(false); // Loading is complete (success or failure)
            }
        };

        if (projectId) { // Only fetch if projectId is available
            fetchProject();
        }
    }, [projectId, appId, db]); // Dependencies: Re-run if projectId, appId, or db instance changes

    // Conditional rendering for loading, error, and not found states
    if (loading) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
                {/* REPLACE THIS SIMPLE TEXT */}
                {/* <p className="text-xl text-gray-700">Loading project details...</p> */}

                {/* ADD THIS SKELETON LOADER */}
                <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div> {/* Title skeleton */}
                    <div className="h-64 bg-gray-200 rounded-lg mb-8"></div> {/* Image skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 1 */}
                        <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 2 */}
                        <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 3 */}
                        <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 4 */}
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div> {/* Overview title */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div> {/* Description line */}
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div> {/* Description line */}
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div> {/* Description line */}
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mt-8 mb-4"></div> {/* Technologies title */}
                    <div className="flex flex-wrap gap-3">
                        <div className="h-8 w-20 bg-gray-200 rounded-full"></div> {/* Tech tag */}
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div> {/* Tech tag */}
                        <div className="h-8 w-16 bg-gray-200 rounded-full"></div> {/* Tech tag */}
                    </div>
                    <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mt-10"></div> {/* Button skeleton */}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-red-50 py-12 px-4">
                <h1 className="text-3xl font-bold text-red-800 mb-4">Error</h1>
                <p className="text-lg text-red-700 text-center">{error}</p>
                <p className="text-md text-red-600 mt-4">Please check the URL or contact Atomicity Web Works.</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Project Not Found</h1>
                <p className="text-lg text-gray-700 text-center">The project ID provided does not match any records.</p>
                <p className="text-md text-gray-600 mt-4">Please ensure the link is correct.</p>
            </div>
        );
    }

    // Main content for displaying project details
    return (
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-100">
            <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl">
                <Link href="/projects" className="flex items-center text-blue-600 hover:underline mb-8">
                    &larr; Back to All Projects
                </Link>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center">{project.title}</h1>

                {project.imageUrl && (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={800} // Larger width for detail page
                        height={500} // Larger height for detail page
                        className="w-full rounded-lg shadow-md mb-8 object-cover h-auto max-h-[500px]" // Responsive image styling
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x500/cccccc/000000?text=Image+Error"; }}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
                    <div className="flex items-center space-x-3">
                        <User size={24} className="text-indigo-500" />
                        <div>
                            <p className="font-semibold">Client:</p>
                            <p>{project.clientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Tag size={24} className="text-indigo-500" />
                        <div>
                            <p className="font-semibold">Category:</p>
                            <p>{project.category}</p>
                        </div>
                    </div>
                    {project.createdAt && (
                        <div className="flex items-center space-x-3">
                            <Calendar size={24} className="text-indigo-500" />
                            <div>
                                <p className="font-semibold">Date Added:</p>
                                <p>{project.createdAt?.toDate ? new Date(project.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Project Overview</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Technologies Used</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-md font-semibold px-4 py-2 rounded-full shadow-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {project.projectUrl && (
                    <div className="text-center mt-10">
                        <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
                        >
                            <ExternalLink size={24} className="mr-2" /> View Live Project
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}