// app/certificates/[certificateId]/page.js

'use client'; // This page uses client-side hooks like useState and useEffect, and React.use().

import { useState, useEffect, use } from 'react'; // Re-import 'use' from React
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import collection, query, where, getDocs
import { db, appId } from '@/lib/firebase'; // Import our Firebase db and appId
import Image from 'next/image'; // For displaying images
import Link from 'next/link'; // For navigation
import { Award, Calendar, Copy } from 'lucide-react'; // Icons for details
import { format } from 'date-fns'; // For date formatting

export default function CertificatePage({ params }) {
  // Use React.use() to unwrap the params object directly.
  // This is the recommended way by Next.js for future compatibility.
  const { certificateId } = use(params); // Get the dynamic certificate ID from the URL

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError('');
      setCopyMessage(''); // Clear copy message on new fetch
      try {
        // Construct the Firestore collection reference
        const certificatesCollectionRef = collection(db, `artifacts/${appId}/public/data/certificates`);

        // Create a query to find the document where the 'certificateId' field matches the URL parameter
        const q = query(certificatesCollectionRef, where('certificateId', '==', certificateId));

        // Execute the query to get documents
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If documents are found, there should ideally be only one matching certificateId
          const fetchedCertificate = querySnapshot.docs[0].data();
          setCertificate({ id: querySnapshot.docs[0].id, ...fetchedCertificate });
        } else {
          // If no document found with that ID
          setError('Certificate not found or invalid ID.');
        }
      } catch (err) {
        console.error('Error fetching certificate details:', err);
        setError('Failed to load certificate details. Please try again later.');
      } finally {
        setLoading(false); // Loading is complete (success or failure)
      }
    };

    if (certificateId) { // Only fetch if certificateId is available
      fetchCertificate();
    }
  }, [certificateId, appId, db]); // Dependencies: Re-run if certificateId, appId, or db instance changes

  // Helper function to copy text to the clipboard
  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopyMessage('URL copied!');
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopyMessage('Failed to copy URL. Please copy manually.');
    } finally {
      document.body.removeChild(textarea); // Clean up the temporary textarea
      setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  // Helper function to format Firestore Timestamps for display
  const formatDateForDisplay = (timestamp) => {
    return timestamp?.toDate ? format(timestamp.toDate(), 'PPP') : 'N/A'; // e.g., Jan 1, 2023
  };

  // Conditional rendering for loading, error, and not found states
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50">
        <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 mx-auto"></div> {/* Title skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 1 */}
            <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 2 */}
            <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 3 */}
            <div className="h-10 bg-gray-200 rounded"></div> {/* Detail line 4 */}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div> {/* Skills title */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div> {/* Skill line */}
            <div className="h-4 bg-gray-200 rounded w-5/6"></div> {/* Skill line */}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-8 mb-4"></div> {/* Project title */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div> {/* Project line */}
            <div className="h-4 bg-gray-200 rounded w-4/5"></div> {/* Project line */}
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

  if (!certificate) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Certificate Not Found</h1>
        <p className="text-lg text-gray-700 text-center">The certificate ID provided does not match any records.</p>
        <p className="text-md text-gray-600 mt-4">Please ensure the link is correct.</p>
      </div>
    );
  }

  // Main content for displaying certificate details
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-100">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-xl">
        <Link href="/admin/certificates" className="flex items-center text-blue-600 hover:underline mb-8">
          &larr; Back to Admin Certificates
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center">{certificate.internName}</h1>
        <p className="text-2xl text-indigo-700 font-semibold text-center mb-8">{certificate.programName}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar size={24} className="text-purple-500" />
            <div>
              <p className="font-semibold">Start Date:</p>
              <p>{formatDateForDisplay(certificate.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar size={24} className="text-purple-500" />
            <div>
              <p className="font-semibold">End Date:</p>
              <p>{formatDateForDisplay(certificate.endDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar size={24} className="text-purple-500" />
            <div>
              <p className="font-semibold">Issue Date:</p>
              <p>{formatDateForDisplay(certificate.issueDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Award size={24} className="text-yellow-500" />
            <div>
              <p className="font-semibold">Issued By:</p>
              <p>{certificate.issuedBy}</p>
            </div>
          </div>
        </div>
        <p className="font-semibold p-10 color-black ">It is certified that Anuj Dangi has completed Full stack web-development program </p>


        {certificate.skillsLearned && certificate.skillsLearned.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Skills Learned</h2>
            <div className="flex flex-wrap gap-3">
              {certificate.skillsLearned.map((skill, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-md font-semibold px-4 py-2 rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {certificate.projectWorkedOn && certificate.projectWorkedOn.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Project Worked On</h2>
            <div className="flex flex-wrap gap-3">
              {certificate.projectWorkedOn.map((project, index) => (
                <span key={index} className="bg-teal-100 text-teal-800 text-md font-semibold px-4 py-2 rounded-full shadow-sm">
                  {project}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <p className="text-lg text-gray-700 mb-4">Unique Certificate ID: <span className="font-mono font-bold text-gray-900">{certificate.certificateId}</span></p>
          <div className="flex items-center justify-center">
            <a
              href={certificate.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              View Certificate Online
            </a>
            <button
              onClick={() => copyToClipboard(certificate.verificationUrl)}
              className="ml-4 p-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 flex items-center justify-center"
              title="Copy Verification URL"
            >
              <Copy size={24} className="mr-2" /> Copy URL
            </button>
          </div>
          {copyMessage && (
            <p className="text-sm mt-2 text-green-600">{copyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
