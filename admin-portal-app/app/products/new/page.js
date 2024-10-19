'use client'
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

export default function NewProductsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [category, setCategory] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [properties, setProperties] = useState({}); 


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategoriesOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
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
          setProperties(product.properties || {}); // Load saved properties for editing
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

    const data = { title, description, price, category,properties};

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
  console.log("categoriesOptions", categoriesOptions);


  const handlePropertyChange = (propName, value) => {
    setProperties(prev => ({
      ...prev,
      [propName]: value,
    }));
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
        {/* properties select */}
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
