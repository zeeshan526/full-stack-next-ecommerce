'use client'
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Toaster, toast } from 'react-hot-toast';

export default function NewProductsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [category, setCategory] = useState('');
  const [properties, setProperties] = useState({});
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]); // Stores uploaded image URLs for backend

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategoriesOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productId) {
      setIsEditing(true);
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/${productId}`);
          const product = response.data;
          setTitle(product.title);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.categoryId);
          setProperties(product.properties || {});
          setImageUrls(product.images || []); // Load existing images
          setPreviewUrls(product.images || []); 
        } catch (error) {
          console.error('Failed to fetch product:', error);
          toast.error('Failed to fetch product details.');
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !category) {
      toast.error("All fields are required");
      return;
    }
    debugger
    const data = { title, description, price, category, properties ,images: imageUrls, };
    try {
      if (isEditing) {
        await axios.patch(`/api/products/${productId}`, data);
        toast.success("Product updated successfully!");
      } else {
        await axios.post('/api/products', data);
        toast.success("Product created successfully!");
      }
      setTimeout(() => {
        router.push('/products');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit the product');
    }
  };

  const handlePropertyChange = (propName, value) => {
    setProperties(prev => ({
      ...prev,
      [propName]: value,
    }));
  };

  const uploadImages = async (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    if (selectedFiles.length + files.length > 7) {
      alert("You can only upload up to 7 files.");
      return;
    }
  
    // Generate preview URLs and update files state
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFiles(prev => [...prev, ...selectedFiles]);
  
    const data = new FormData();
    selectedFiles.forEach((file) => data.append('file', file));
  
    try {
      const res = await axios.post('/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrls = res.data.files.map(filePath => `${process.env.NEXT_PUBLIC_PORTAL_URL}${filePath}`); // Assuming absolute URLs
  
      setImageUrls(prev => [...prev, ...uploadedUrls]); // Store image URLs
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  

  // Remove image from preview and image URLs
  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index)); // Remove the corresponding URL
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
        <label className="block mb-2">Category</label>
        <select
          className="border rounded-md p-2 w-full mb-4"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>Select Category</option>
          {categoriesOptions?.length && categoriesOptions?.map(c => (
            <option key={c._id} value={c._id}>
              {c.categoryName}
            </option>
          ))}
        </select>
        
        {categoriesOptions?.map(categoryOption => (
          categoryOption._id === category && categoryOption.properties?.length > 0 && (
            <div key={categoryOption._id}>
              <h3 className="text-lg font-semibold mb-2">Category Properties:</h3>
              {categoryOption.properties.map((prop, index) => (
                <div key={index}>
                  <label className="block mb-2">{prop.name}</label>
                  <select
                    className="border rounded-md p-2 w-full mb-4"
                    value={properties[prop.name] || ""}
                    onChange={e => handlePropertyChange(prop.name, e.target.value)}
                  >
                    <option value="">Select {prop.name} Value</option>
                    {prop.value.split(',').map((val, i) => (
                      <option key={i} value={val.trim()}>
                        {val.trim()}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )
        ))}

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
        />

        <label className="block mb-2">Upload Images</label>
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={uploadImages}
            accept="image/*"
            style={{ display: 'none' }}
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            style={{ width: '200px',height:'80px' }}
            className="flex max-w-96 items-center justify-center bg-gray-100 text-black border-2 border-dotted border-gray-400 py-2 px-4 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            Upload Images
          </label>
        </div>


        {/* Display image previews */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
              <img
                src={url}
                alt={`Preview ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
              <button
              type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
          type="submit"
        >
          {isEditing ? 'Update Product' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
