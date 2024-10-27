'use client'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../components/CartContext';

const page = () => {
    const { addProductToCart } = useContext(CartContext);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchProducts = async () => {
        debugger
        setLoading(true);
        try {
          const response = await axios.get("/api/products");
          setProducts(response.data);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        //   toast.error("Failed to fetch products");
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  
    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loader"></div>
          </div>
        );
      }

  return (
   
    <div className="bg-white py-12">
    <div className="max-w-full px-4 md:px-12 mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white rounded-lg shadow-lg"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-lg">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/images/placeholder.png"
                  }
                  alt={product.title}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                {product.title}
              </h3>

              <p className="mt-4 text-gray-900 font-bold">
                ${product.price}
              </p>

              <div className="mt-4 flex space-x-2 justify-between">
                <Link
                  href={`/products/${product._id}`}
                  className="inline-block px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all"
                >
                  View Details
                </Link>

                <button
                  onClick={() => addProductToCart(product)}
                  className="inline-block px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-all"
                >
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
  )
}

export default page
