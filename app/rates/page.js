'use client'; 
// This page will run on the client-side
// app/rates/page.js



export default function RatesPage() {
  return (
    // Main container with styling to push footer down
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">Our Transparent Pricing</h1>
        <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          At Atomicity Web Works, we believe in clear and competitive pricing tailored to your project's unique needs. Below are our standard packages, but we're always happy to provide custom quotes!
        </p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Basic Website Package */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-600 flex flex-col justify-between transform hover:scale-105 transition duration-300">
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Basic Site</h2>
              <p className="text-gray-600 mb-6">Perfect for small businesses, portfolios, or personal blogs.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">
                ₹5,000<span className="text-xl font-normal text-gray-500"> / one-time</span>
              </p>
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Responsive Design (Mobile-Friendly)</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Up to 5 Pages</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Basic SEO Setup</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Contact Form Integration</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> 1 Month Post-Launch Support</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Get Basic Site
            </button>
          </div>

          {/* Standard Website Package */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-purple-600 flex flex-col justify-between transform hover:scale-105 transition duration-300">
            <div>
              <h2 className="text-3xl font-bold text-purple-600 mb-4">Standard Site</h2>
              <p className="text-gray-600 mb-6">Ideal for growing businesses needing more features and content.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">
                ₹15,000<span className="text-xl font-normal text-gray-500"> / one-time</span>
              </p>
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Everything in Basic, plus:</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Up to 15 Pages</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Content Management System (CMS) Integration</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Advanced SEO & Analytics Setup</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Custom Features (e.g., Blog, Gallery)</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> 3 Months Post-Launch Support</li>
              </ul>
            </div>
            <button className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition duration-300">
              Get Standard Site
            </button>
          </div>

          {/* E-commerce / AI Agents Package (Custom Quote) */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-pink-600 flex flex-col justify-between transform hover:scale-105 transition duration-300">
            <div>
              <h2 className="text-3xl font-bold text-pink-600 mb-4">E-commerce / AI Agents</h2>
              <p className="text-gray-600 mb-6">For online stores, complex applications, or AI-powered solutions.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">
                Custom Quote<span className="text-xl font-normal text-gray-500"> / project</span>
              </p>
              <ul className="text-gray-700 space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Advanced Features & Integrations</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Payment Gateway Integration</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Inventory Management</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> AI/ML Integration (e.g., Chatbots, Recommendation Engines)</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Dedicated Project Manager</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✔</span> Ongoing Maintenance & Support Plans</li>
              </ul>
            </div>
            <button className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition duration-300">
              Request Custom Quote
            </button>
          </div>

        </div> {/* End Pricing Grid */}

        <p className="text-center text-gray-600 mt-12 text-sm">
          *All prices are estimates and may vary based on specific project requirements and complexity.
        </p>
      </div>
    </div>
  );
}