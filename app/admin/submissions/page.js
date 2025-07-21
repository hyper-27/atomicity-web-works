// app/admin/submissions/page.js

'use client'; // This directive must be the absolute first line in a Client Component file.

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { db, appId } from '@/lib/firebase'; // Import our Firebase db and appId
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth'; // Import for auth check
import { auth } from '@/lib/firebase'; // Import auth for auth check
import { Trash2 } from 'lucide-react'; // Icon for delete
import { format } from 'date-fns'; // For date formatting

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages

  const router = useRouter();

  // Authentication check useEffect
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false);
      } else {
        setUser(null);
        setAuthLoading(false);
        router.push('/admin'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribeAuth();
  }, [auth, router]);

  // Fetch submissions from Firestore useEffect
  useEffect(() => {
    if (!authLoading && user) { // Only fetch if auth check is done and user is logged in
      setLoading(true);
      // Construct the Firestore collection path
      const submissionsCollectionRef = collection(db, `artifacts/${appId}/public/data/contact_submissions`);
      // Order by creation date (newest first)
      const q = query(submissionsCollectionRef, orderBy('createdAt', 'desc'));

      // onSnapshot sets up a real-time listener
      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const fetchedSubmissions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubmissions(fetchedSubmissions);
        setLoading(false);
        setError(''); // Clear any previous errors
      }, (err) => {
        console.error("Error fetching contact submissions:", err);
        setError("Failed to load contact submissions. Please check permissions.");
        setLoading(false);
      });

      // Cleanup: Stop listening when component unmounts
      return () => unsubscribeSnapshot();
    }
  }, [authLoading, user, appId, db]);

  // Handle deleting a submission
  const handleDeleteSubmission = async (id) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return; // User cancelled
    }
    setError('');
    setMessage('');
    try {
      const submissionDocRef = doc(db, `artifacts/${appId}/public/data/contact_submissions`, id);
      await deleteDoc(submissionDocRef);
      setMessage('Submission deleted successfully!');
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(`Failed to delete submission: ${err.message}`);
    }
  };

  // If not authenticated, show loading/redirect message
  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-100">
      <div className="container mx-auto max-w-5xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Contact Form Submissions</h1>

        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        {loading ? (
          // SKELETON LOADER FOR ADMIN SUBMISSIONS LISTING
          <div className="space-y-6 animate-pulse">
            {Array(3).fill(0).map((_, index) => ( // Display 3 skeleton cards
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-indigo-600 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0 sm:pr-4 flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div> {/* Date */}
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div> {/* From */}
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div> {/* Subject */}
                  <div className="h-4 bg-gray-200 rounded w-full"></div> {/* Message line 1 */}
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div> {/* Message line 2 */}
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div> {/* Delete button */}
              </div>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-center text-gray-600">No contact form submissions yet.</p>
        ) : (
          <div className="space-y-6">
            {submissions.map(submission => (
              <div key={submission.id} className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-indigo-600 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0 sm:pr-4 flex-grow">
                  <p className="text-sm text-gray-500 mb-1">
                    {submission.createdAt?.toDate ? format(submission.createdAt.toDate(), 'PPP, p') : 'N/A'}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">From: {submission.name} ({submission.email})</p>
                  <p className="text-md text-gray-800 mb-2">Subject: {submission.subject}</p>
                  <p className="text-gray-700 text-sm">{submission.message}</p>
                </div>
                <button
                  onClick={() => handleDeleteSubmission(submission.id)}
                  className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-300 flex items-center justify-center flex-shrink-0"
                  title="Delete Submission"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
