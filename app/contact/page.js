// app/contact/page.js

"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // Icons for contact info

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(""); // For success/error messages
  const [isError, setIsError] = useState(false); // To style success/error messages

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("");
    setIsError(false);

    try {
      // Send data to our Next.js API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(
          data.message || "Your message has been sent successfully!",
        );
        setIsError(false);
        // Clear form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitMessage(
          data.error || "Failed to send your message. Please try again.",
        );
        setIsError(true);
      }
    } catch (error) {
      console.error("Client-side form submission error:", error);
      setSubmitMessage("An unexpected error occurred. Please try again later.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Have a project in mind, a question, or just want to say hello? We'd
          love to hear from you! Reach out via the form below or our direct
          contact details.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-xl">
          {/* Contact Information Section */}
          <div className="flex flex-col justify-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="flex items-center space-x-4">
              <Mail size={36} className="text-indigo-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Email Us</p>
                <a
                  href="mailto:contact@atomicitywebworks.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@atomicitywebworks.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone size={36} className="text-indigo-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Call Us</p>
                <a
                  href="tel:+919876543210"
                  className="text-blue-600 hover:underline"
                >
                  +91 98765 43210
                </a>{" "}
                {/* Replace with your actual number */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin size={36} className="text-indigo-600" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Visit Us</p>
                <p className="text-gray-700">
                  123 Web Street, Digital City, Bhopal, MP, India
                </p>{" "}
                {/* Replace with your actual address */}
              </div>
            </div>
            <p className="text-gray-600 mt-6">
              Our team is available Monday to Friday, 9:00 AM - 6:00 PM (IST).
            </p>
          </div>

          {/* Contact Form Section */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Send Us a Message
            </h2>
            {submitMessage && (
              <p
                className={`p-3 rounded-md mb-4 text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {submitMessage}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
