import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserProvider, Contract, parseUnits, formatUnits } from "ethers";

const BuyerDashboard = () => {
  const [items, setItems] = useState([]); // Items for sale
  const [balance, setBalance] = useState(0); // User's token balance
  const [selectedItem, setSelectedItem] = useState(null); // Item selected for purchase
  const [purchaseHistory, setPurchaseHistory] = useState([]); // Purchase history
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [sellerAddress, setSellerAddress] = useState(""); // Dynamic seller's address

  const contractAddress = "0x992b58ecb6203698e3615e1ad4343a1227e12ea9"; // Replace with your token's address
  const contractABI = [
    "function balanceOf(address) public view returns (uint256)",
    "function transfer(address recipient, uint256 amount) public returns (bool)",
  ];  

  useEffect(() => {
    fetchItems();
    fetchPurchaseHistory();
    fetchBalance();
    fetchSellerAddress(); // Fetch seller address on initial load
  }, []);

  // Fetch items for sale
  const fetchItems = async () => {
    try {
      const response = await axios.get("https://archrunners.onrender.com/api/items");
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items. Please try again later.");
    }
  };

  // Fetch purchase history
  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get("https://archrunners.onrender.com/api/purchases");
      setPurchaseHistory(response.data);
    } catch (err) {
      console.error("Error fetching purchase history:", err);
      setError("Failed to fetch purchase history. Please try again later.");
    }
  };

  // Fetch user's token balance
  const fetchBalance = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      setBalance(parseFloat(formatUnits(balance, 18))); // Assuming token has 18 decimals
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance. Please check your contract address and ABI.");
    }
  };

  // Fetch the seller's address dynamically from MetaMask
  const fetchSellerAddress = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setSellerAddress(accounts[0]); // Use the first MetaMask account as the seller address
    } catch (err) {
      console.error("Error fetching seller address:", err);
      setError("Failed to fetch seller address. Please connect to MetaMask.");
    }
  };

  // Handle purchase of an item
  const handlePurchase = async (item) => {
    if (!window.ethereum) {
      setError("Please connect to MetaMask.");
      return;
    }

    if (balance < item.price) {
      setError("Insufficient balance to complete the purchase.");
      return;
    }

    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const transaction = await contract.transfer(
        sellerAddress, // Use the dynamic seller address
        parseUnits(item.price.toString(), 18)
      );
      await transaction.wait();

      // Record the purchase on the backend
      const response = await axios.post("https://archrunners.onrender.com/api/purchases", {
        itemId: item._id,
        buyer: await signer.getAddress(),
        price: item.price,
      });

      alert("Purchase successful!");
      fetchBalance();
      fetchPurchaseHistory();
      fetchItems();
      setSelectedItem(null);
    } catch (err) {
      console.error("Error processing purchase:", err);
      setError("Failed to process purchase. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-16">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600">View and purchase items with your tokens.</p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 text-red-500 bg-red-50 border border-red-500 rounded">
            {error}
          </div>
        )}

        {/* Token Balance Section */}
        <section className="mb-10 bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold">Your Token Balance</h2>
          <button
            onClick={fetchBalance}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Check Your Balance
          </button>
          <p className="text-lg mt-4">{balance} Tokens</p>
        </section>

        {/* Seller Address Section */}
        <section className="mb-10 bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Seller Address</h2>
          <input
            type="text"
            value={sellerAddress}
            onChange={(e) => setSellerAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <p className="text-sm text-gray-500 mt-2">Tokens will be sent to this address during purchase.</p>
        </section>

        {/* Items for Sale Section */}
        <section className="mb-10 bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold">Items for Sale</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items available for sale.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item._id} className="flex items-center gap-4 p-4 border rounded shadow-sm bg-gray-50">
                  {item.imageUrl && (
                    <img
                      src={`https://archrunners.onrender.com${item.imageUrl}`}
                      alt={item.name}
                      className="h-16 w-16 rounded object-cover border"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <p className="font-bold text-gray-800">{item.price} Tokens</p>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Purchase Confirmation Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>
              <p>
                Are you sure you want to buy <strong>{selectedItem.name}</strong> for{" "}
                <strong>{selectedItem.price} Tokens</strong>?
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchase(selectedItem)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {loading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase History Section */}
        <section className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Purchase History</h2>
          {purchaseHistory.length === 0 ? (
            <p className="text-gray-500">No purchase history available.</p>
          ) : (
            <ul className="space-y-4">
              {purchaseHistory.map((purchase) => (
                <li key={purchase._id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <p className="font-medium text-gray-900">{purchase.itemId.name}</p>
                  <p className="text-gray-600">{purchase.itemId.description}</p>
                  <p className="text-gray-800 font-bold">
                    {purchase.price} Tokens - Purchased by {purchase.buyer}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(purchase.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default BuyerDashboard;