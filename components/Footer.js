// components/Footer.js

'use client'; // Footer might use client-side features in the future, good practice

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-center text-sm mt-auto">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Atomicity Web Works. All rights reserved.
        <p className="mt-2">Crafted with precision and passion.</p>
      </div>
    </footer>
  );
}