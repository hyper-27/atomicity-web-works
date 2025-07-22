// components/Header.js

"use client"; // Header uses Link and Image, so it must be a Client Component

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/atomicity-logo.png?v=2"
            alt="Atomicity Web Works Logo"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <span className="text-2xl font-bold">Atomicity Web Works</span>
        </Link>

        {/* *** UPDATED NAVIGATION LINKS HERE *** */}
        <div>
          <Link
            href="/"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Services
          </Link>
          <Link
            href="/rates"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Rates
          </Link>
          <Link
            href="/projects"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Projects
          </Link>
          <Link
            href="/testimonials"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Testimonials
          </Link>
          <Link
            href="/about"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            className="mx-2 hover:text-blue-400 transition duration-300"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
