import Image from 'next/image';
import Link from 'next/link';
import heroImage from './../public/hero.webp'; // Default image for the hero section
import shirt from './../public/shirt.jpg'; // Default image for all products

export default function FeaturedProductsPage({ products }) {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-12 md:py-24 max-w-full mx-auto">
        {/* Left Side: Text */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            The Best MacBook Pro
          </h1>
          <p className="text-lg text-gray-700">
            Discover the latest MacBook Pro with advanced M1 chip, powerful performance, and stunning retina display. Perfect for professionals and creators.
          </p>
          <Link href="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            Shop Now
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className="mt-8 md:mt-0 md:w-1/2 h-96 flex justify-center items-center"> {/* Adjust the container size */}
          <div className="relative w-full h-full"> {/* Hero image container */}
            <Image
              src={heroImage}
              alt="MacBook Pro"
              layout="fill" // Ensures the image fills the container
              objectFit="contain" // Ensures the image fits without cutting off
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Products List Section */}
      <div className="bg-white py-12">
        <div className="max-w-full px-4 md:px-12 mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="p-4 bg-white rounded-lg shadow-lg">
                  {/* Product Image with container */}
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <Image
                      src={shirt} // Using the default image for now
                      alt={product.name}
                      layout="fill" // Ensures the image fills the container
                      objectFit="contain" // Ensures the image fits within the container without stretching or being cut off
                      className="rounded-lg"
                    />
                  </div>
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">{product.name}</h3>
                  
                  {/* Product Description */}
                  <p className="mt-2 text-gray-700 text-sm">{product.description}</p>
                  
                  {/* Product Price */}
                  <p className="mt-4 text-gray-900 font-bold">${product.price}</p>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    {/* View Details Button */}
                    <Link href={`/products/${product._id}`} className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all">
                      View Details
                    </Link>
                    
                    {/* Add to Cart Button */}
                    <button className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
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
