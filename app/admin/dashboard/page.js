// app/admin/dashboard/page.js

'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
                router.push('/admin'); // Redirect to login if not authenticated
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
                <p className="text-xl text-gray-700">Checking authentication...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
                <p className="text-xl text-red-500">Access Denied. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-8 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mb-6">
                Welcome, {user.email}! You are securely logged in.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Manage Projects</h2>
                    <p className="text-gray-600">Add, edit, or remove client projects and design examples.</p>
                    <Link href="/admin/projects" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 inline-block">
                        Go to Projects
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Manage Testimonials</h2>
                    <p className="text-gray-600">Curate and display client testimonials.</p>
                    <Link href="/admin/testimonials" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 inline-block">
                        Go to Testimonials
                    </Link>
                </div>



                {/* NEW: Contact Submissions Card */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Submissions</h2>
                    <p className="text-gray-600">View and manage messages received from your contact form.</p>
                    <Link href="/admin/submissions" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 inline-block">
                        View Submissions
                    </Link>
                </div>

                {/* THIS IS THE CARD FOR CERTIFICATES - ENSURE IT'S HERE */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Issue Certificates</h2>
                    <p className="text-gray-600">Generate and manage verifiable internship/program certificates.</p>
                    <Link href="/admin/certificates" className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 inline-block">
                        Go to Certificates
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">Client Design Previews</h2>
                    <p className="text-gray-600">Upload and showcase private design mockups for clients.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Go to Previews</button>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="mt-8 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
                Log Out
            </button>
        </div>
    );
}