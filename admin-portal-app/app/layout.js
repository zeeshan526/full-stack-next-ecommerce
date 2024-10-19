"use client"; // Mark this as a client component

import SessionProviderWrapper from "./components/SessionProviderWrapper"; // Import your session provider wrapper
import Navbar from "./components/navbar"; // Import the Navbar
import localFont from "next/font/local";
import { useSession } from "next-auth/react"; // Import useSession to access session
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { useState } from "react";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
  const [showNav, setShowNav]=useState(false);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  const toggleNavbar = () => {
    setShowNav((prev) => !prev);
  };

  return (
    <div className="bg-blue-800">
            <div className="flex items-center justify-between p-2 md:hidden">
      <button onClick={()=>toggleNavbar()} className="p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <span className="text-white text-lg mx-auto">
          Ecommerce Admin Panel
        </span>
     </div>
      <div className=" min-h-screen flex">
        {/* Show Navbar if session exists */}
        {session && <Navbar show={!showNav} toggleNavbar={toggleNavbar} />}
        <main className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
          {children}
        </main>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
}
