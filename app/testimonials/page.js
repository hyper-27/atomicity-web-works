'use client';
// app/testimonials/page.js


import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'; // Firestore imports
import { db, appId } from '@/lib/firebase'; // Our Firebase instance

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For informational messages

  // Mock data for display if Firestore fetching fails or is not ready
  const mockTestimonials = [
    {
      id: 'mock_t1',
      quote: 'Atomicity Web Works transformed our online presence. Their attention to detail and commitment to quality is unparalleled!',
      clientName: 'Sarah Chen',
      clientTitle: 'CEO, InnovateTech Solutions',
      clientImageUrl: 'https://placehold.co/100x100/000000/FFFFFF?text=SC',
      rating: 5,
      isApproved: true,
      createdAt: new Date(),
    },
    {
      id: 'mock_t2',
      quote: 'The team at Atomicity delivered an intuitive e-commerce platform that exceeded our expectations. Highly recommend!',
      clientName: 'David Lee',
      clientTitle: 'Founder, Urban Crafts',
      clientImageUrl: 'https://placehold.co/100x100/333333/FFFFFF?text=DL',
      rating: 5,
      isApproved: true,
      createdAt: new Date(new Date().setHours(new Date().getHours() - 1)),
    },
    {
      id: 'mock_t3',
      quote: 'Their expertise in custom web development is truly impressive. They turned our complex ideas into a seamless reality.',
      clientName: 'Priya Sharma',
      clientTitle: 'CTO, Global Analytics',
      clientImageUrl: 'https://placehold.co/100x100/666666/FFFFFF?text=PS',
      rating: 4,
      isApproved: true,
      createdAt: new Date(new Date().setHours(new Date().getHours() - 2)),
    },
    {
      id: 'mock_t4',
      quote: 'We had a great experience working with Atomicity. Their support was excellent throughout the project.',
      clientName: 'Mark Johnson',
      clientTitle: 'Marketing Director',
      clientImageUrl: 'https://placehold.co/100x100/999999/FFFFFF?text=MJ',
      rating: 5,
      isApproved: false, // This one will NOT be shown on the public page
      createdAt: new Date(new Date().setHours(new Date().getHours() - 3)),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError('');
    setMessage('');

    // Construct the Firestore collection path for public testimonials
    const testimonialsCollectionRef = collection(db, `artifacts/${appId}/public/data/testimonials`);

    // Create a query:
    // 1. Filter by 'isApproved == true' to only show public testimonials.
    // 2. Order by 'createdAt' in descending order (newest first).
    const q = query(
      testimonialsCollectionRef,
      where('isApproved', '==', true), // Filter for approved testimonials
      orderBy('createdAt', 'desc')
    );

    // onSnapshot sets up a real-time listener.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedTestimonials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetchedTestimonials);
        setMessage('Testimonials loaded from database.');
        setError('');
      } else {
        setTestimonials(mockTestimonials.filter(t => t.isApproved)); // If no real data, show approved mock data
        setMessage('No approved testimonials found in the database. Displaying examples.');
        setError('');
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching testimonials from Firestore:", err);
      setError("Failed to load testimonials from our database. Displaying examples.");
      setTestimonials(mockTestimonials.filter(t => t.isApproved)); // Fallback to approved mock data on error
      setLoading(false);
    });

    // Cleanup function: Stop listening to real-time updates when the component unmounts
    return () => unsubscribe();
  }, [appId, db]); // Dependencies: Re-run effect if appId or db instance changes

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">
          What Our Clients Say
        </h1>
        <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Hear directly from our satisfied clients about their experience working with Atomicity Web Works and the impact we've made.
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
          <p className="text-center text-gray-600 text-lg">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No testimonials to display yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-lg flex flex-col transform hover:scale-105 transition duration-300">
                <p className="text-gray-800 text-lg italic mb-6 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-auto">
                  {testimonial.clientImageUrl && (
                    <Image
                      src={testimonial.clientImageUrl}
                      alt={testimonial.clientName}
                      width={64} // Slightly larger image for public display
                      height={64}
                      className="rounded-full mr-4 object-cover border-2 border-gray-200"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/000000?text=Client"; }}
                    />
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonial.clientName}</p>
                    {testimonial.clientTitle && (
                      <p className="text-md text-gray-600">{testimonial.clientTitle}</p>
                    )}
                    {testimonial.rating && (
                      <div className="flex items-center text-yellow-500 mt-1">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <span key={i} className="text-xl">⭐</span> // Star emoji, larger
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Call to Action for more testimonials or contact */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Share Your Success Story?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We love hearing from our clients! If you've had a great experience with Atomicity Web Works, we'd be thrilled to feature your testimonial.
          </p>
          <Link href="/contact" className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}