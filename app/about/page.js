'use client';
// app/about/page.js


export default function About() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-8 bg-gray-50">
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">About Atomicity Web Works</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        We are a dedicated web agency committed to building high-quality, scalable, and user-centric web applications. Our passion lies in transforming ideas into powerful digital realities.
      </p>
    </div>
  );
}