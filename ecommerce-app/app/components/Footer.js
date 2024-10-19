'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

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
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-gray-400">
            We offer a wide range of high-quality Polo shirts and other apparel products for every occasion. Our mission is to bring you the best in style and comfort.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="text-gray-400 hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/category" className="text-gray-400 hover:text-white">
                Categories
              </Link>
            </li>
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

        {/* Newsletter Section */}
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
            <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700">
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <Link href="#">
              <span className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 4.56v15.04c0 .69-.56 1.25-1.25 1.25h-21.5c-.69 0-1.25-.56-1.25-1.25V4.56C0 3.87.56 3.31 1.25 3.31h21.5c.69 0 1.25.56 1.25 1.25zm-12.41 8.44v-2.44h-.44v2.44h.44zm-3.92-2.44v2.44h-.44v-2.44h.44zm7.83-.44v-3.57h-1.11v3.57h-1.43v-3.57h-1.05v3.57h-1.56v-3.57h-1.14v3.57h-1.11v-3.57h-1.43v3.57H8.8v-3.57H7.7v3.57H5.87v-2.88c.01-.65.54-1.17 1.2-1.17h9.91c.66 0 1.19.52 1.2 1.17v2.88H16.5z"
                  />
                </svg>
              </span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.46 6.04a7.96 7.96 0 0 1-2.3.63 4.16 4.16 0 0 0 1.79-2.29 8.3 8.3 0 0 1-2.61 1.04 4.06 4.06 0 0 0-7.1 3.64 11.55 11.55 0 0 1-8.4-4.26 4.03 4.03 0 0 0 1.26 5.4 3.97 3.97 0 0 1-1.85-.53v.05a4.05 4.05 0 0 0 3.23 3.98 3.92 3.92 0 0 1-1.83.07 4.06 4.06 0 0 0 3.79 2.85A8.17 8.17 0 0 1 2 19.54a11.55 11.55 0 0 0 6.29 1.85c7.55 0 11.68-6.36 11.68-11.88 0-.18-.01-.35-.02-.52a8.34 8.34 0 0 0 2.03-2.11z"
                  />
                </svg>
              </span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.23 3.84 9.54 8.77 10.49.65.12.89-.28.89-.64v-2.25c-3.56.77-4.3-1.5-4.3-1.5-.59-1.49-1.45-1.88-1.45-1.88-1.19-.85.09-.83.09-.83 1.32.09 2.01 1.37 2.01 1.37 1.17 2 3.07 1.41 3.81 1.08.12-.85.46-1.41.83-1.73-2.84-.33-5.83-1.45-5.83-6.46 0-1.43.5-2.6 1.31-3.52-.13-.32-.57-1.65.12-3.45 0 0 1.07-.34 3.51 1.34a12.29 12.29 0 0 1 6.38 0c2.43-1.68 3.5-1.34 3.5-1.34.7 1.8.25 3.13.12 3.45.82.92 1.31 2.09 1.31 3.52 0 5.02-3 6.13-5.86 6.46.48.43.91 1.27.91 2.56v3.79c0 .35.23.76.89.64 4.93-.95 8.77-5.26 8.77-10.49C24 5.37 18.63 0 12 0z"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Arrow */}
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
        <p>&copy; 2024 My E-Commerce Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
