// app/admin/certificates/page.js

"use client"; // This directive must be the absolute first line in a Client Component file.

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, appId } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Award, Copy } from "lucide-react"; // Icon for certificate and copy
import { format } from "date-fns"; // For date formatting

export default function AdminCertificatesPage() {
  // State variables for the certificate issuance form
  const [internName, setInternName] = useState("");
  const [programName, setProgramName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Default issue date to today's date in YYYY-MM-DD format for the input type="date"
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [skillsLearned, setSkillsLearned] = useState(""); // Comma-separated string for input
  const [projectWorkedOn, setProjectWorkedOn] = useState(""); // Comma-separated string for input

  // State variables for displaying existing certificates
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true); // For loading existing certificates
  const [authLoading, setAuthLoading] = useState(true); // For initial authentication check
  const [user, setUser] = useState(null); // Stores authenticated user info
  const [message, setMessage] = useState(""); // For success messages
  const [error, setError] = useState(""); // For error messages

  const router = useRouter(); // Next.js router for redirection

  // Authentication check useEffect: Runs once on component mount
  // Redirects to admin login if user is not authenticated
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
        setAuthLoading(false); // Authentication check is complete
      } else {
        setUser(null); // No user authenticated
        setAuthLoading(false); // Authentication check is complete
        router.push("/admin"); // Redirect to login page
      }
    });
    // Cleanup function: Unsubscribe from auth listener when component unmounts
    return () => unsubscribeAuth();
  }, [auth, router]); // Dependencies: Re-run if auth or router instance changes

  // Fetch certificates from Firestore useEffect: Runs when authentication is confirmed
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true); // Start loading existing certificates
      // Construct the Firestore collection reference for public certificates
      const certificatesCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/certificates`,
      );
      // Create a query to order certificates by creation date (newest first)
      const q = query(certificatesCollectionRef, orderBy("createdAt", "desc"));

      // onSnapshot sets up a real-time listener to the query.
      // It fetches the initial data and then listens for any changes in the collection.
      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const fetchedCertificates = snapshot.docs.map((doc) => ({
            id: doc.id, // Firestore document ID
            ...doc.data(), // All other fields from the document
          }));
          setCertificates(fetchedCertificates); // Update state with fetched certificates
          setLoading(false); // Stop loading
          setError(""); // Clear any previous errors
        },
        (err) => {
          // Error callback: handles any errors during fetching
          console.error("Error fetching certificates:", err);
          setError(
            "Failed to load certificates. Please check permissions or your internet connection.",
          );
          setLoading(false); // Stop loading on error
        },
      );

      // Cleanup function: Unsubscribe from the real-time listener when component unmounts
      return () => unsubscribeSnapshot();
    }
  }, [authLoading, user, appId, db]); // Dependencies: Re-run if auth status, user, appId, or db changes

  // Helper function to generate a simple unique certificate ID
  // This ID will be stored as a field in the Firestore document
  const generateCertificateId = () => {
    const timestamp = Date.now().toString(36); // Base36 timestamp for uniqueness
    const random = Math.random().toString(36).substring(2, 7); // Short random string
    return `AWW-${timestamp}-${random}`.toUpperCase(); // Prefix with "AWW-" for Atomicity Web Works
  };

  // Handle form submission to issue a new certificate
  const handleIssueCertificate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages

    // Basic validation for required fields
    if (!internName || !programName || !startDate || !endDate || !issueDate) {
      setError("Please fill in all required fields (marked with *).");
      return;
    }

    try {
      const certificateId = generateCertificateId(); // Generate a unique ID for this certificate
      // Construct the public verification URL for this certificate
      // window.location.origin gets the base URL (e.g., http://localhost:3000 or https://yourdomain.com)
      const verificationUrl = `${window.location.origin}/certificates/${certificateId}`;

      // Prepare the data object to be saved to Firestore
      const certificateData = {
        certificateId, // Our custom unique ID
        internName,
        programName,
        startDate: new Date(startDate), // Convert date string to Date object for Firestore
        endDate: new Date(endDate), // Convert date string to Date object for Firestore
        issueDate: new Date(issueDate), // Convert date string to Date object for Firestore
        // Convert comma-separated strings to arrays, trim whitespace, and filter out empty strings
        skillsLearned: skillsLearned
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        projectWorkedOn: projectWorkedOn
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p),
        issuedBy: "Atomicity Web Works", // Your company name
        verificationUrl, // The public URL for verification
        createdAt: new Date(), // Timestamp of creation in Firestore
      };

      // Get a reference to the 'certificates' collection
      const certificatesCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/certificates`,
      );
      // Add the new certificate document to Firestore. Firestore will auto-generate its document ID,
      // and our custom 'certificateId' will be a field within that document.
      await addDoc(certificatesCollectionRef, certificateData);

      setMessage(
        `Certificate issued successfully! Verification URL: ${verificationUrl}`,
      );
      // Reset form fields after successful submission
      setInternName("");
      setProgramName("");
      setStartDate("");
      setEndDate("");
      setIssueDate(new Date().toISOString().split("T")[0]); // Reset to today's date
      setSkillsLearned("");
      setProjectWorkedOn("");
    } catch (err) {
      console.error("Error issuing certificate:", err);
      setError(`Failed to issue certificate: ${err.message}`);
    }
  };

  // Helper function to copy text to the clipboard
  const copyToClipboard = (text) => {
    // Using document.execCommand('copy') for broader compatibility in iframe environments
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setMessage("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      setError("Failed to copy URL. Please copy manually.");
    } finally {
      document.body.removeChild(textarea); // Clean up the temporary textarea
    }
  };

  // Helper function to format Firestore Timestamps for display
  const formatDateForDisplay = (timestamp) => {
    return timestamp?.toDate ? format(timestamp.toDate(), "PPP") : "N/A"; // e.g., Jan 1, 2023
  };

  // Conditional rendering for authentication status
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
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Issue & Manage Certificates
        </h1>

        {/* Display success or error messages */}
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

        {/* Issue New Certificate Form */}
        <form onSubmit={handleIssueCertificate} className="space-y-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Issue New Certificate
          </h2>
          <div>
            <label
              htmlFor="internName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Intern Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="internName"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={internName}
              onChange={(e) => setInternName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="programName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Program Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="programName"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Full-Stack Web Development Internship"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="issueDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="issueDate"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="skillsLearned"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Skills Learned (Comma-separated)
            </label>
            <textarea
              id="skillsLearned"
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, Node.js, Firebase, API Integration, UI/UX Design"
              value={skillsLearned}
              onChange={(e) => setSkillsLearned(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Separate skills with commas.
            </p>
          </div>
          <div>
            <label
              htmlFor="projectWorkedOn"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Project Worked On (Comma-separated)
            </label>
            <textarea
              id="projectWorkedOn"
              rows="3"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Theater Booking System, E-commerce Dashboard"
              value={projectWorkedOn}
              onChange={(e) => setProjectWorkedOn(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Separate projects with commas.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Issue Certificate
          </button>
        </form>

        {/* List of Issued Certificates */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-12">
          Issued Certificates
        </h2>
        {loading ? (
          // SKELETON LOADER FOR ADMIN CERTIFICATES LISTING
          <div className="space-y-6 animate-pulse">
            {Array(3)
              .fill(0)
              .map(
                (
                  _,
                  index, // Display 3 skeleton cards
                ) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-purple-600"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>{" "}
                      {/* Intern Name */}
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>{" "}
                      {/* Icon */}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>{" "}
                    {/* Program */}
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>{" "}
                    {/* Dates */}
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>{" "}
                    {/* Issued */}
                    <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>{" "}
                    {/* Skills */}
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>{" "}
                    {/* Projects */}
                    <div className="h-12 bg-gray-200 rounded-md mt-4"></div>{" "}
                    {/* Verification Link/Copy */}
                  </div>
                ),
              )}
          </div>
        ) : certificates.length === 0 ? (
          <p className="text-center text-gray-600">
            No certificates issued yet. Use the form above to issue your first
            one!
          </p>
        ) : (
          <div className="space-y-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md border-l-4 border-purple-600"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {cert.internName}
                  </h3>
                  <Award size={24} className="text-yellow-500" />
                </div>
                <p className="text-gray-700 mb-1">
                  <strong>Program:</strong> {cert.programName}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Dates:</strong> {formatDateForDisplay(cert.startDate)}{" "}
                  - {formatDateForDisplay(cert.endDate)}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Issued:</strong>{" "}
                  {formatDateForDisplay(cert.issueDate)}
                </p>
                {cert.skillsLearned && cert.skillsLearned.length > 0 && (
                  <p className="text-gray-600 text-sm mt-2">
                    <strong>Skills:</strong> {cert.skillsLearned.join(", ")}
                  </p>
                )}
                {cert.projectWorkedOn && cert.projectWorkedOn.length > 0 && (
                  <p className="text-gray-600 text-sm">
                    <strong>Project:</strong> {cert.projectWorkedOn.join(", ")}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-200">
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm truncate"
                    title={cert.verificationUrl}
                  >
                    Verification Link:{" "}
                    <span className="font-mono">{cert.certificateId}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(cert.verificationUrl)}
                    className="ml-2 p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                    title="Copy URL"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
