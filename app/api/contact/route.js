// app/api/contact/route.js

// Next.js API Routes in App Router use standard Web API Request/Response objects.
// This file handles POST requests to /api/contact.

import { collection, addDoc } from "firebase/firestore";
import { db, appId } from "@/lib/firebase"; // Import our Firebase db and appId

export async function POST(request) {
  try {
    const data = await request.json(); // Parse the JSON body from the client

    // Basic validation (you can add more robust validation here)
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        {
          status: 400, // Bad Request
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Add a timestamp to the submission
    const submissionData = {
      ...data,
      createdAt: new Date(), // Firestore Timestamp
    };

    // Construct the Firestore collection path for contact submissions
    const contactCollectionRef = collection(
      db,
      `artifacts/${appId}/public/data/contact_submissions`,
    );

    // Save the data to Firestore
    await addDoc(contactCollectionRef, submissionData);

    // Send a success response back to the client
    return new Response(
      JSON.stringify({ message: "Message sent successfully!" }),
      {
        status: 200, // OK
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error saving contact form to Firestore:", error);
    // Send an error response back to the client
    return new Response(
      JSON.stringify({
        error: "Internal Server Error. Could not send message.",
      }),
      {
        status: 500, // Internal Server Error
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// You can also define other HTTP methods (GET, PUT, DELETE) in this file if needed
// export async function GET(request) { ... }
