// app/admin/page.js

"use client";

const ADMIN_EMAIL = "anujdangi227@gmail.com"; // Your admin email

import { useState, useEffect } from "react";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailAndPassword, // Make sure this is imported!
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added this
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Ensure handleSendSignInLink and handleEmailPasswordLogin are defined here
  // before they are used in the return statement.

  const handleSendSignInLink = async (e) => {
    // ... (your existing handleSendSignInLink code) ...
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (email !== ADMIN_EMAIL) {
      setError("Access denied. This email is not authorized for admin login.");
      setLoading(false);
      return;
    }

    const actionCodeSettings = {
      url: window.location.origin + "/admin",
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage(
        "A sign-in link has been sent to your email. Please check your inbox!",
      );
      setEmail("");
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      setError(`Failed to send link: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: handleEmailPasswordLogin function definition ---
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (email !== ADMIN_EMAIL) {
      setError("Access denied. This email is not authorized for admin login.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Successfully logged in with email and password!");
      // onAuthStateChanged will handle redirection
    } catch (error) {
      console.error("Error with email/password login:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(`Login failed: ${error.message}`);
      }
      setMessage("");
    } finally {
      setLoading(false);
    }
  };
  // --- END NEW FUNCTION DEFINITION ---

  // ... (your existing useEffect for authentication and sign-in link handling) ...
  useEffect(() => {
    const handleSignInLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setError("");
        setMessage("Signing in...");
        setLoading(true);

        let emailForSignIn = window.localStorage.getItem("emailForSignIn");
        if (!emailForSignIn) {
          emailForSignIn = window.prompt(
            "Please provide your email for confirmation:",
          );
        }

        if (emailForSignIn) {
          try {
            await signInWithEmailLink(
              auth,
              emailForSignIn,
              window.location.href,
            );
            window.localStorage.removeItem("emailForSignIn");
            setMessage("Successfully signed in!");
            setError("");
            router.push("/admin/dashboard");
          } catch (error) {
            console.error("Error signing in with email link:", error);
            setError(`Failed to sign in: ${error.message}`);
            setMessage("");
          } finally {
            setLoading(false);
          }
        } else {
          setError("Email not provided for sign-in.");
          setLoading(false);
        }
      } else {
        // If not a sign-in link, and no user is logged in, stop loading.
        // This is important for the initial render of the login form.
        if (!auth.currentUser) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        setLoading(false); // Auth check complete
        if (window.location.pathname === "/admin") {
          router.push("/admin/dashboard");
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setLoading(false); // Auth check complete
        if (window.location.pathname === "/admin/dashboard") {
          router.push("/admin");
        }
      }
    });

    handleSignInLink(); // Call this on mount to check for email links

    return () => unsubscribe();
  }, [auth, router]);

  // ... (rest of your component, including conditional rendering and forms) ...

  // The return statement for the login form remains the same as before.
  // It will use handleEmailPasswordLogin and handleSendSignInLink.
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
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

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email/Password Login Section */}
          <form onSubmit={handleEmailPasswordLogin}>
            {" "}
            {/* Corrected onSubmit */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Login with Email & Password
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email-password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-password"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login with Password"}
            </button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Email Link Login Section */}
          <form onSubmit={handleSendSignInLink}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Login with Magic Link
            </h2>
            <div className="mb-4">
              <label
                htmlFor="email-magic"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-magic"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
