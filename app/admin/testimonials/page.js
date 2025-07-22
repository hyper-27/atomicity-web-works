// app/admin/testimonials/page.js

"use client"; // This directive must be the absolute first line in a Client Component file.

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, appId } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [quote, setQuote] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [clientImageUrl, setClientImageUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [isApproved, setIsApproved] = useState(true);

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State for editing
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editQuote, setEditQuote] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editClientTitle, setEditClientTitle] = useState("");
  const [editClientImageUrl, setEditClientImageUrl] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editIsApproved, setEditIsApproved] = useState(true);

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
        router.push("/admin"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribeAuth();
  }, [auth, router]);

  // Fetch testimonials from Firestore useEffect
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      const testimonialsCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/testimonials`,
      );
      const q = query(testimonialsCollectionRef, orderBy("createdAt", "desc"));

      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const fetchedTestimonials = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTestimonials(fetchedTestimonials);
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error("Error fetching testimonials:", err);
          setError("Failed to load testimonials. Please check permissions.");
          setLoading(false);
        },
      );

      return () => unsubscribeSnapshot();
    }
  }, [authLoading, user, appId, db]);

  // Handle adding a new testimonial
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!quote || !clientName) {
      setError("Please fill in the Quote and Client Name fields.");
      return;
    }

    try {
      const testimonialsCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/testimonials`,
      );
      await addDoc(testimonialsCollectionRef, {
        quote,
        clientName,
        clientTitle: clientTitle || null,
        clientImageUrl: clientImageUrl || null,
        rating: Number(rating), // Ensure rating is stored as a number
        isApproved,
        createdAt: new Date(),
      });
      setMessage("Testimonial added successfully!");
      // Clear form
      setQuote("");
      setClientName("");
      setClientTitle("");
      setClientImageUrl("");
      setRating(5);
      setIsApproved(true);
    } catch (err) {
      console.error("Error adding testimonial:", err);
      setError(`Failed to add testimonial: ${err.message}`);
    }
  };

  // Function to start editing a testimonial
  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setEditQuote(testimonial.quote);
    setEditClientName(testimonial.clientName);
    setEditClientTitle(testimonial.clientTitle || "");
    setEditClientImageUrl(testimonial.clientImageUrl || "");
    setEditRating(testimonial.rating || 5);
    setEditIsApproved(testimonial.isApproved || false);
    setMessage("");
    setError("");
  };

  // Function to save edited testimonial
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!editingTestimonial) return;

    if (!editQuote || !editClientName) {
      setError("Please fill in the Quote and Client Name fields for editing.");
      return;
    }

    try {
      const testimonialDocRef = doc(
        db,
        `artifacts/${appId}/public/data/testimonials`,
        editingTestimonial.id,
      );
      const updatedData = {
        quote: editQuote,
        clientName: editClientName,
        clientTitle: editClientTitle || null,
        clientImageUrl: editClientImageUrl || null,
        rating: Number(editRating),
        isApproved: editIsApproved,
        updatedAt: new Date(),
      };

      await updateDoc(testimonialDocRef, updatedData);
      setMessage("Testimonial updated successfully!");
      setEditingTestimonial(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError(`Failed to update testimonial: ${err.message}`);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingTestimonial(null); // Exit edit mode
    setError("");
    setMessage("");
  };

  // Function to delete a testimonial
  const handleDeleteTestimonial = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this testimonial? This action cannot be undone.",
      )
    ) {
      return; // User cancelled
    }
    setError("");
    setMessage("");
    try {
      const testimonialDocRef = doc(
        db,
        `artifacts/${appId}/public/data/testimonials`,
        id,
      );
      await deleteDoc(testimonialDocRef);
      setMessage("Testimonial deleted successfully!");
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError(`Failed to delete testimonial: ${err.message}`);
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
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Manage Testimonials
        </h1>

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

        {/* Conditional Rendering for Add vs. Edit Form */}
        {editingTestimonial ? (
          // --- EDIT TESTIMONIAL FORM ---
          <form onSubmit={handleSaveEdit} className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Edit Testimonial
            </h2>
            <div>
              <label
                htmlFor="editQuote"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                id="editQuote"
                rows="4"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editQuote}
                onChange={(e) => setEditQuote(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="editClientName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editClientName"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="editClientTitle"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Title/Company (Optional)
              </label>
              <input
                type="text"
                id="editClientTitle"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CEO, XYZ Corp."
                value={editClientTitle}
                onChange={(e) => setEditClientTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="editClientImageUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Image URL (Optional)
              </label>
              <input
                type="url"
                id="editClientImageUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://placehold.co/100x100/000000/FFFFFF?text=Client"
                value={editClientImageUrl}
                onChange={(e) => setEditClientImageUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a placeholder like
                https://placehold.co/100x100/000000/FFFFFF?text=Client if you
                don't have a real image yet.
              </p>
            </div>
            <div>
              <label
                htmlFor="editRating"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Rating (1-5)
              </label>
              <input
                type="number"
                id="editRating"
                min="1"
                max="5"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsApproved"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={editIsApproved}
                onChange={(e) => setEditIsApproved(e.target.checked)}
              />
              <label
                htmlFor="editIsApproved"
                className="text-gray-700 text-sm font-bold"
              >
                Approved for Public Display
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-grow bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-grow bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // --- ADD NEW TESTIMONIAL FORM (original form) ---
          <form onSubmit={handleAddTestimonial} className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Add New Testimonial
            </h2>
            <div>
              <label
                htmlFor="quote"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                id="quote"
                rows="4"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="clientName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="clientTitle"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Title/Company (Optional)
              </label>
              <input
                type="text"
                id="clientTitle"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CEO, XYZ Corp."
                value={clientTitle}
                onChange={(e) => setClientTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="clientImageUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Client Image URL (Optional)
              </label>
              <input
                type="url"
                id="clientImageUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://placehold.co/100x100/000000/FFFFFF?text=Client"
                value={clientImageUrl}
                onChange={(e) => setClientImageUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a placeholder like
                https://placehold.co/100x100/000000/FFFFFF?text=Client if you
                don't have a real image yet.
              </p>
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Rating (1-5)
              </label>
              <input
                type="number"
                id="rating"
                min="1"
                max="5"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isApproved"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
              />
              <label
                htmlFor="isApproved"
                className="text-gray-700 text-sm font-bold"
              >
                Approved for Public Display
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Testimonial
            </button>
          </form>
        )}

        {/* List of Existing Testimonials */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-12">
          Existing Testimonials
        </h2>
        {loading ? (
          // SKELETON LOADER FOR ADMIN TESTIMONIALS LISTING
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {Array(4)
              .fill(0)
              .map(
                (
                  _,
                  index, // Display 4 skeleton cards
                ) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col"
                  >
                    <div className="h-6 bg-gray-200 rounded w-5/6 mb-4"></div>{" "}
                    {/* Quote line 1 */}
                    <div className="h-6 bg-gray-200 rounded w-4/5 mb-6"></div>{" "}
                    {/* Quote line 2 */}
                    <div className="flex items-center mt-auto">
                      <div className="rounded-full h-12 w-12 bg-gray-200 mr-3"></div>{" "}
                      {/* Image skeleton */}
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>{" "}
                        {/* Client Name */}
                        <div className="h-4 bg-gray-200 rounded w-32"></div>{" "}
                        {/* Client Title */}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 w-1/2 bg-gray-200 rounded-md"></div>{" "}
                      {/* Edit button */}
                      <div className="h-10 w-1/2 bg-gray-200 rounded-md"></div>{" "}
                      {/* Delete button */}
                    </div>
                  </div>
                ),
              )}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-600">
            No testimonials added yet. Use the form above to add your first
            testimonial!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col"
              >
                <p className="text-gray-800 italic mb-4 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-auto">
                  {testimonial.clientImageUrl && (
                    <Image
                      src={testimonial.clientImageUrl}
                      alt={testimonial.clientName}
                      width={48}
                      height={48}
                      className="rounded-full mr-3 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/48x48/cccccc/000000?text=Client";
                      }}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.clientName}
                    </p>
                    {testimonial.clientTitle && (
                      <p className="text-sm text-gray-600">
                        {testimonial.clientTitle}
                      </p>
                    )}
                    {testimonial.rating && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {testimonial.isApproved ? (
                  <span className="text-xs font-semibold text-green-600 mt-2">
                    ✅ Approved
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-600 mt-2">
                    ❌ Not Approved
                  </span>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="flex-grow bg-indigo-500 text-white p-2 rounded-md shadow-sm hover:bg-indigo-600 transition duration-300 flex items-center justify-center text-sm"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="flex-grow bg-red-500 text-white p-2 rounded-md shadow-sm hover:bg-red-600 transition duration-300 flex items-center justify-center text-sm"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
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
