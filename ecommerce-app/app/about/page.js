'use client'

import Image from "next/image";
import about from "./../public/poloshirt.webp";
import { useRouter } from 'next/navigation';


export default function AboutUs() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center px-6 py-16 space-y-12 bg-gray-50 text-gray-800">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-orange-500">About Us</h1>

      {/* Brand Description */}
      <section className="max-w-3xl text-center space-y-4">
        <p className="text-lg">
          Welcome to <span className="font-semibold">Trevixa</span>, where timeless elegance meets modern style. Specializing in premium polo shirts, we craft each piece with meticulous attention to detail and an unwavering commitment to quality.
        </p>
        <p className="text-lg">
          Our mission is simple: to provide high-quality, stylish, and comfortable clothing that brings a touch of class to your everyday wardrobe. Whether you're dressing up or keeping it casual, our polo shirts are designed to be as versatile as you are.
        </p>
      </section>

      {/* Brand Story */}
      <section className="max-w-4xl space-y-8">
        <h2 className="text-2xl font-bold text-center text-gray-700">Our Story</h2>
        <div className="flex justify-center flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0 items-center">
        <Image
                src={about}
                alt="Premium Polo Shirts"
                width={250}
                height={200}
            className="rounded-lg shadow-md"

              />
          {/* <img
            src="/path-to-your-image.jpg"
            alt="Crafting polo shirts"
            className="w-full lg:w-1/2 rounded-lg shadow-md"
          /> */}
          <p className="lg:w-1/2 text-gray-600">
            Founded with a passion for quality clothing, <span className="font-semibold">Trevixa</span> was born out of a love for polo shirts and the elegance they bring to any outfit. From our humble beginnings to a growing family of customers, we have always prioritized craftsmanship, comfort, and style.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-3xl space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-orange-500">Quality</h3>
            <p className="text-gray-600">We use only the finest materials to ensure each shirt is made to last, offering the perfect balance of softness, durability, and breathability.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-orange-500">Simplicity</h3>
            <p className="text-gray-600">Our designs are minimal yet stylish, focusing on clean lines and timeless colors that can be worn in any setting.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-orange-500">Customer-Centric</h3>
            <p className="text-gray-600">Your satisfaction is our priority. We aim to create an enjoyable shopping experience, offering exceptional customer support and service.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <p className="text-lg text-gray-700">Ready to elevate your style? Discover our collection of polo shirts and join us on a journey of elegance and comfort.</p>
        <button
                onClick={() => router.push("/")}
                className="bg-orange-500 text-white px-8 py-3 mt-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Go to Shop
              </button>
      </section>
    </div>
  );
}
