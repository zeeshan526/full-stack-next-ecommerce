'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';


export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-12 relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-400">
            We offer a wide range of high-quality Polo shirts and other apparel products for every occasion. Our mission is to bring you the best in style and comfort.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/shop" className="text-gray-400 hover:text-white">
                Products
              </Link>
            </li>
            {/* <li>
              <Link href="/category" className="text-gray-400 hover:text-white">
                Categories
              </Link>
            </li> */}
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Newsletter</h2>
          <p className="text-gray-400 mb-4">
            Subscribe to our newsletter and get 10% off your first purchase!
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-md text-gray-800"
            />
            <button className="bg-orange-400 px-4 py-2 rounded-r-md hover:bg-orange-500">
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            
          <a href="#" className="hover:text-orange-500">
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaLinkedinIn className="w-6 h-6" />
          </a>
          </div>
        </div>
      </div>

      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      )}

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
        <p>&copy; 2024 Trevixa. All rights reserved.</p>
      </div>
    </footer>
  );
}
