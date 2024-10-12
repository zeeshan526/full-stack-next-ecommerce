'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast'; 
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';


export default function ProductsPage() {
  const [products, setProducts] = useState([]); // State to hold the products
  const [loading, setLoading] = useState(false); // State to track loading status
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedProductId, setSelectedProductId] = useState(null); // Track the product ID for deletion
  const router = useRouter();

  // Fetch the products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loader before fetching data
      try {
        const response = await axios.get("/api/products"); // Fetch products from the API
        setProducts(response.data); // Set the products in the state
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false); // Stop loader after fetching
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []);

  // Open confirmation modal when "Delete" is clicked
  const openModal = (id) => {
    setSelectedProductId(id); // Store the ID of the product to delete
    setShowModal(true); // Show the confirmation modal
  };

  // Close modal without deleting
  const closeModal = () => {
    setShowModal(false);
    setSelectedProductId(null); // Reset selected product
  };

  // Handle Delete Product
  const deleteProduct = async () => {
    setLoading(true); // Start loader when delete is in progress
    try {
      await axios.delete(`/api/products/${selectedProductId}`); // Delete product by ID
      setProducts(products.filter((product) => product._id !== selectedProductId)); // Update state after deletion
      toast.success("Product has been deleted!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false); // Stop loader after deletion
      closeModal(); // Close modal after deleting
    }
  };

  // Handle Edit Product (Redirect to form with product details)
  const editProduct = (id) => {
    router.push(`/products/new?id=${id}`); // Redirect to the form page with product ID in query params
  };

  return (
    <div className="p-4">
      <Link href={'/products/new'} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">Add Product</Link>

      {/* Show loader if loading is true */}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Products List</h2>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
                      <button
                          className="flex items-center text-indigo-600 hover:text-indigo-900 font-bold px-3 py-1 rounded-md border border-indigo-600 hover:bg-indigo-100 transition duration-200 mr-2"
                          onClick={() => editProduct(product._id)}
                        >
                          <PencilIcon className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-600 flex hover:text-red-900 font-bold px-3 py-1 rounded-md border border-red-600 hover:bg-red-100 transition duration-200"
                          onClick={() => openModal(product._id)} 
                        >
                         <TrashIcon className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-600">No products available.</p>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-out`}
          style={{ opacity: showModal ? 1 : 0 }} // Smooth fade-in effect
        >
          <div
            className={`bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-500 ease-out`}
            style={{
              transform: showModal ? 'scale(1)' : 'scale(0.95)', // Smooth scaling effect
            }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Confirm Deletion</h2>
            <p className="mb-6 text-center text-gray-500">Are you sure you want to delete this product?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={deleteProduct}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
