// app/admin/projects/page.js

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

export default function AdminProjectsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [technologies, setTechnologies] = useState(""); // Comma-separated string
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State for editing
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editProjectUrl, setEditProjectUrl] = useState("");
  const [editTechnologies, setEditTechnologies] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editIsFeatured, setEditIsFeatured] = useState(false);

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

  // Fetch projects from Firestore useEffect
  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      const projectsCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/projects`,
      );
      const q = query(projectsCollectionRef, orderBy("createdAt", "desc"));

      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const fetchedProjects = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(fetchedProjects);
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error("Error fetching projects:", err);
          setError("Failed to load projects. Please check permissions.");
          setLoading(false);
        },
      );

      return () => unsubscribeSnapshot();
    }
  }, [authLoading, user, appId, db]);

  // Handle adding a new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !title ||
      !description ||
      !imageUrl ||
      !clientName ||
      !category ||
      !technologies
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const projectsCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/projects`,
      );
      await addDoc(projectsCollectionRef, {
        title,
        description,
        imageUrl,
        projectUrl: projectUrl || null, // Store null if empty
        technologies: technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech), // Convert string to array
        clientName,
        category,
        isFeatured,
        createdAt: new Date(), // Add timestamp
      });
      setMessage("Project added successfully!");
      // Clear form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setProjectUrl("");
      setTechnologies("");
      setClientName("");
      setCategory("");
      setIsFeatured(false);
    } catch (err) {
      console.error("Error adding project:", err);
      setError(`Failed to add project: ${err.message}`);
    }
  };

  // Function to start editing a project
  const handleEditProject = (project) => {
    setEditingProject(project); // Set the project being edited
    // Populate the edit form fields with the project's current data
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditImageUrl(project.imageUrl || "");
    setEditProjectUrl(project.projectUrl || "");
    setEditTechnologies(
      project.technologies ? project.technologies.join(", ") : "",
    ); // Convert array to string
    setEditClientName(project.clientName);
    setEditCategory(project.category);
    setEditIsFeatured(project.isFeatured || false);
    setMessage(""); // Clear any previous messages
    setError(""); // Clear any previous errors
  };

  // Function to save edited project
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!editingProject) return; // Should not happen if edit form is visible

    // Basic validation
    if (
      !editTitle ||
      !editDescription ||
      !editImageUrl ||
      !editClientName ||
      !editCategory ||
      !editTechnologies
    ) {
      setError("Please fill in all required fields for editing.");
      return;
    }

    try {
      const projectDocRef = doc(
        db,
        `artifacts/${appId}/public/data/projects`,
        editingProject.id,
      );
      const updatedData = {
        title: editTitle,
        description: editDescription,
        imageUrl: editImageUrl,
        projectUrl: editProjectUrl || null,
        technologies: editTechnologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        clientName: editClientName,
        category: editCategory,
        isFeatured: editIsFeatured,
        updatedAt: new Date(), // Update timestamp
      };

      await updateDoc(projectDocRef, updatedData); // Update the document in Firestore
      setMessage("Project updated successfully!");
      setEditingProject(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating project:", err);
      setError(`Failed to update project: ${err.message}`);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingProject(null); // Exit edit mode
    setError("");
    setMessage("");
  };

  // Function to delete a project
  const handleDeleteProject = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return; // User cancelled
    }
    setError("");
    setMessage("");
    try {
      const projectDocRef = doc(
        db,
        `artifacts/${appId}/public/data/projects`,
        id,
      );
      await deleteDoc(projectDocRef); // Delete the document from Firestore
      setMessage("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(`Failed to delete project: ${err.message}`);
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
          Manage Projects
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
        {editingProject ? (
          // --- EDIT PROJECT FORM ---
          <form onSubmit={handleSaveEdit} className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Edit Project
            </h2>
            <div>
              <label
                htmlFor="editTitle"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editTitle"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="editDescription"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="editDescription"
                rows="4"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="editImageUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="editImageUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/project-image.jpg"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a placeholder like
                https://placehold.co/600x400/000000/FFFFFF?text=Project if you
                don't have a real image yet.
              </p>
            </div>
            <div>
              <label
                htmlFor="editProjectUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Live Project URL (Optional)
              </label>
              <input
                type="url"
                id="editProjectUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://live-project.com"
                value={editProjectUrl}
                onChange={(e) => setEditProjectUrl(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="editTechnologies"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Technologies (Comma-separated){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editTechnologies"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Next.js, Tailwind CSS, Firebase"
                value={editTechnologies}
                onChange={(e) => setEditTechnologies(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate technologies with commas (e.g., React, Node.js,
                MongoDB).
              </p>
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
                htmlFor="editCategory"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editCategory"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E-commerce, SaaS, Portfolio"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsFeatured"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={editIsFeatured}
                onChange={(e) => setEditIsFeatured(e.target.checked)}
              />
              <label
                htmlFor="editIsFeatured"
                className="text-gray-700 text-sm font-bold"
              >
                Feature on Homepage
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
                type="button" // Important: type="button" to prevent form submission
                onClick={handleCancelEdit}
                className="flex-grow bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // --- ADD NEW PROJECT FORM (original form) ---
          <form onSubmit={handleAddProject} className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Add New Project
            </h2>
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows="4"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="imageUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/project-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a placeholder like
                https://placehold.co/600x400/000000/FFFFFF?text=Project if you
                don't have a real image yet.
              </p>
            </div>
            <div>
              <label
                htmlFor="projectUrl"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Live Project URL (Optional)
              </label>
              <input
                type="url"
                id="projectUrl"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://live-project.com"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="technologies"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Technologies (Comma-separated){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="technologies"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Next.js, Tailwind CSS, Firebase"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate technologies with commas (e.g., React, Node.js,
                MongoDB).
              </p>
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
                htmlFor="category"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E-commerce, SaaS, Portfolio"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <label
                htmlFor="isFeatured"
                className="text-gray-700 text-sm font-bold"
              >
                Feature on Homepage
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Project
            </button>
          </form>
        )}

        {/* List of Existing Projects */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-12">
          Existing Projects
        </h2>
        {loading ? (
          // SKELETON LOADER FOR ADMIN PROJECTS LISTING
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
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>{" "}
                    {/* Title */}
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>{" "}
                    {/* Image */}
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>{" "}
                    {/* Description line 1 */}
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>{" "}
                    {/* Description line 2 */}
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>{" "}
                    {/* Client */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>{" "}
                    {/* Category */}
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
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">
            No projects added yet. Use the form above to add your first project!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="rounded-md mb-4 object-cover w-full h-48"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x200/cccccc/000000?text=Image+Error";
                    }}
                  />
                )}
                <p className="text-gray-700 text-sm mb-2 flex-grow">
                  {project.description}
                </p>
                <p className="text-gray-600 text-xs mb-1">
                  <strong>Client:</strong> {project.clientName}
                </p>
                <p className="text-gray-600 text-xs mb-1">
                  <strong>Category:</strong> {project.category}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-gray-600 text-xs mb-1">
                    <strong>Tech:</strong> {project.technologies.join(", ")}
                  </p>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2 block"
                  >
                    View Live Project
                  </a>
                )}
                {project.isFeatured && (
                  <span className="text-sm font-semibold text-purple-600 mt-2">
                    ✨ Featured
                  </span>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex-grow bg-indigo-500 text-white p-2 rounded-md shadow-sm hover:bg-indigo-600 transition duration-300 flex items-center justify-center text-sm"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
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
