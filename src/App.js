// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TokenFaucet from './components/TokenFaucet';
import Navbar from './components/Navbar';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 text-white min-h-screen">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<TokenFaucet />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/buyer" element={<BuyerDashboard />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
