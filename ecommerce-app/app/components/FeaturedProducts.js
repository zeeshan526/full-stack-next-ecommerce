'use client'

import Image from "next/image";
import Link from "next/link";
import heroImage from "./../public/polo2.jpg"; 
import shirt from "./../public/shirt.png"; 
import { useContext } from "react";
import { CartContext } from "./CartContext"; 

export default function FeaturedProductsPage({ products }) {
    console.log("product",products);

    const { addProductToCart} = useContext(CartContext)

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-12 md:py-24 max-w-full mx-auto">
        {/* Left Side: Text */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            The Best Premium Polo Shirts
          </h1>
          <p className="text-lg text-gray-700">
            Experience the perfect blend of comfort and style with our premium
            Polo shirts. Crafted from high-quality fabrics, these shirts offer a
            refined look for any occasion, whether it's a casual day out or a
            professional setting. Elevate your wardrobe with timeless designs
            built for durability and everyday wear.
          </p>

          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center items-center">
          <Image
            src={heroImage}
            alt="Premium Polo Shirts"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-full px-4 md:px-12 mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="p-4 bg-white rounded-lg shadow-lg"
                >
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <Image
                      src={shirt}
                      alt={product.title}
                      layout="fill" 
                      objectFit="contain" 
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">
                    {product.title}
                  </h3>

                  {/* <p className="mt-2 text-gray-700 text-sm">
                    {product.description}
                  </p> */}

                  <p className="mt-4 text-gray-900 font-bold">
                    ${product.price}
                  </p>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
                    >
                      View Details
                    </Link>

                    <button onClick={()=>addProductToCart(product)} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
