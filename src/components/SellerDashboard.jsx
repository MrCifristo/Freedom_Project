import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [items, setItems] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(""); // Error message

  useEffect(() => {
    fetchItems();
    fetchTotalSales();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("https://archrunners.onrender.com/api/items");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items. Please try again later.");
    }
  };

  const fetchTotalSales = async () => {
    try {
      const response = await axios.get("https://archrunners.onrender.com/api/sales");
      setTotalSales(response.data.totalSales || 0);
    } catch (err) {
      console.error("Error fetching total sales:", err);
      setError("Failed to fetch total sales. Please try again later.");
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /jpeg|jpg|png/;
    const ext = file ? file.name.split('.').pop().toLowerCase() : "";
  
    if (file && allowedExtensions.test(ext)) {
      setNewItem((prev) => ({
        ...prev,
        image: file,
      }));
    } else {
      alert("Only JPEG, JPG, and PNG files are allowed");
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    if (newItem.image) {
      formData.append("image", newItem.image);
    }

    try {
      setLoading(true);
      const response = await axios.post("https://archrunners.onrender.com/api/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchItems();
      setNewItem({ name: "", description: "", price: "", image: null }); // Reset form
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    console.log("Attempting to delete item with ID:", id);
  
    if (!id) {
      console.error("Invalid ID received.");
      alert("Invalid item selected.");
      return;
    }
  
    try {
      const response = await axios.delete(`https://archrunners.onrender.com/api/items/${id}`);
      console.log("Item deleted successfully:", response.data);
      fetchItems(); // Refresh the item list
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(`Failed to delete item: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async () => {
    if (!editingItem.name || !editingItem.description || editingItem.price === undefined) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`https://archrunners.onrender.com/api/items/${editingItem._id}`, {
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
      });
      fetchItems();
      setEditingItem(null);
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-16">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your items and track sales effortlessly.</p>
        </header>

        {/* Error Message */}
        {error && <div className="mb-6 p-4 text-red-500 bg-red-50 border border-red-500 rounded">{error}</div>}

        {/* Add New Item Section */}
        <section className="mb-10 bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={newItem.name}
                onChange={handleNewItemChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newItem.description}
                onChange={handleNewItemChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 resize-none"
              />
              <input
                type="number"
                name="price"
                placeholder="Price (tokens)"
                value={newItem.price}
                onChange={handleNewItemChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          <button
            onClick={handleAddItem}
            disabled={loading}
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </section>

        {/* Items for Sale Section */}
        <section className="mb-10 bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Items for Sale</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items listed yet.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item._id} className="flex items-center gap-4 p-4 border rounded shadow-sm bg-gray-50">
                  {item.imageUrl && (
                    <img src={`https://archrunners.onrender.com${item.imageUrl}`} alt={item.name} className="h-16 w-16 rounded object-cover border" />  
                  )}
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <p className="font-bold text-gray-800">{item.price} tokens</p>
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    disabled={loading}
                    className="text-red-500 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Edit Item Section (Modal) */}
        {editingItem && (
          <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Item</h2>
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleEditChange}
                className="w-full p-3 border mb-4"
              />
              <textarea
                name="description"
                value={editingItem.description}
                onChange={handleEditChange}
                className="w-full p-3 border mb-4"
              />
              <input
                type="number"
                name="price"
                value={editingItem.price}
                onChange={handleEditChange}
                className="w-full p-3 border mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateItem}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Total Sales Section */}
        <section className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Total Sales</h2>
          <p className="text-4xl font-bold text-gray-900">{totalSales} tokens</p>
        </section>
      </div>
    </div>
  );
};

export default SellerDashboard;