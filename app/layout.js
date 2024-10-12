"use client"; // Mark this as a client component

import SessionProviderWrapper from "./components/SessionProviderWrapper";  // Import your session provider wrapper
import Navbar from "./components/navbar"; // Import the Navbar
import localFont from "next/font/local";
import { useSession } from "next-auth/react"; // Import useSession to access session
import { Toaster } from 'react-hot-toast'; 
import "./globals.css";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Ensure that the entire layout is wrapped by the SessionProvider */}
        <SessionProviderWrapper>
          <AppContent>{children}</AppContent>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

// Separate the content that depends on useSession into a client component
function AppContent({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-blue-800 min-h-screen flex">
      {/* Show Navbar if session exists */}
      {session && <Navbar />}
      <main className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
