"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]); 
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState(''); 
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openModalForAdd = () => {
    setCategoryName(''); 
    setParentCategory('');
    setIsEditing(false);
    setShowModal(true);
  };

  const openModalForEdit = (id, name, parentCategoryName) => {
    setCategoryName(name);
    // Find the parent category by its name (if editing)
    const parentCategoryId = categories.find(cat => cat.categoryName === parentCategoryName)?._id || '';
    setParentCategory(parentCategoryId); // Set parent category ID if available
    setSelectedCategoryId(id); // Set selected category ID
    setIsEditing(true); 
    setShowModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
  
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }
  
    const data = { categoryName, parentCategory: parentCategory || null };
  
    try {
      setUpdating(true);
  
      if (isEditing) {
        const response = await axios.patch(`/api/categories/${selectedCategoryId}`, data);
        toast.success("Category updated successfully!");
  
        // Update the existing category in the state
        setCategories(categories.map(cat =>
          cat._id === selectedCategoryId
            ? { ...cat, categoryName, parentCategoryName: response.data.category.parentCategoryName }
            : cat
        ));
      } else {
        // Create new category
        const response = await axios.post("/api/categories", data);
        toast.success("Category created successfully!");
  
        setCategories(prevCategories => [
          ...prevCategories,
          {
            _id: response.data.category.id, 
            categoryName: response.data.category.categoryName,
            parentCategoryName: response.data.category.parentCategoryName || "None"
          }
        ]);
      }
  
      setShowModal(false); 
    } catch (error) {
      toast.error("Failed to save category. Please try again.");
    } finally {
      setUpdating(false);
    }
  };
  

  const handleDeleteCategory = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/categories/${categoryToDelete}`);
      setCategories(categories.filter(cat => cat._id !== categoryToDelete)); 
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false); 
    }
  };

  const openDeleteModal = (id) => {
    setCategoryToDelete(id); 
    setShowDeleteModal(true); 
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategoryId(null);
    setCategoryName('');
    setParentCategory('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <button
        className="bg-green-500 text-white py-2 px-4 mb-4 rounded-md hover:bg-green-600"
        onClick={openModalForAdd}
      >
        Add Category
      </button>

      {updating && (
        <div className="flex justify-center items-center mt-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          <span className="ml-4 text-gray-500">Updating...</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="mt-6">
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.categoryName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.parentCategoryName || "None"} 
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex">
                        <button
                          className="flex items-center text-indigo-600 hover:text-indigo-900 font-bold px-3 py-1 rounded-md border border-indigo-600 hover:bg-indigo-100 transition duration-200 mr-2"
                          onClick={() => openModalForEdit(category._id, category.categoryName, category.parentCategoryName)}
                        >
                          <PencilIcon className="h-4 w-4 mr-1" /> Edit
                        </button>
                        <button
                          className="text-red-600 flex hover:text-red-900 font-bold px-3 py-1 rounded-md border border-red-600 hover:bg-red-100 transition duration-200"
                          onClick={() => openDeleteModal(category._id)}
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
            <p className="mt-4 text-center text-gray-600">No categories available.</p>
          )}
        </div>
      )}

      {showModal && (
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-500 ease-out`}
        >
          <div
            className={`bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-500 ease-out`}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isEditing ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSaveCategory}>
              <label className="block mb-2 text-gray-700">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border rounded-md p-2 w-full mb-4"
              />
              <label className="block mb-2 text-gray-700">Parent Category</label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="border rounded-md p-2 w-full mb-4"
              >
                <option value="">Select category</option> 
                {categories
                  .filter((cat) => cat._id !== selectedCategoryId) 
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this category?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteCategory}
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
