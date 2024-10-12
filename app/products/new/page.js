'use client'
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter and useSearchParams for edit functionality
import { Toaster, toast } from 'react-hot-toast'; // Import React Hot Toast

export default function NewProductsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode
  const router = useRouter(); 
  const searchParams = useSearchParams(); // Get the query parameters
  const productId = searchParams.get('id'); // Get product ID from query string if present

  // Fetch product data if in edit mode
  useEffect(() => {
    if (productId) {
      setIsEditing(true); // We're in edit mode if productId exists
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/${productId}`);
          const product = response.data;

          // Populate the form fields with the existing product data
          setTitle(product.title); 
          setDescription(product.description);
          setPrice(product.price);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          toast.error('Failed to fetch product details.');
        }
      };

      fetchProduct();
    }
  }, [productId]); // Runs when productId changes (i.e., on edit mode)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: Check if all fields are filled
    if (!title || !description || !price) {
      toast.error("All fields are required");
      return;
    }

    const data = { title, description, price };

    try {
      if (isEditing) {
        // If in edit mode, send a PATCH request to update the product
        await axios.patch(`/api/products/${productId}`, data);
        toast.success("Product updated successfully!");
      } else {
        // If in create mode, send a POST request to create a new product
        await axios.post('/api/products', data);
        toast.success("Product created successfully!");
      }

      // Redirect to /products page after success
      setTimeout(() => {
        router.push('/products');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit the product');
    }
  };

  return (
    <div className="p-4">
      <h1>{isEditing ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Product Name</label>
        <input
          type="text"
          placeholder="Product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        />
        <label className="block mb-2">Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        ></textarea>
        <label className="block mb-2">Price (in USD)</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        ></input>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          type="submit"
        >
          {isEditing ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
