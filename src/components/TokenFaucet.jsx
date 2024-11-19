import React, { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const contractAddress = "0x992b58ecb6203698e3615e1ad4343a1227e12ea9";
const contractABI = [
  "function faucet() public",
  "function faucetAmount() public view returns (uint256)",
  "function cooldownTime() public view returns (uint256)",
  "function lastClaimed(address) public view returns (uint256)",
];

const TokenFaucet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Conecta tu billetera para reclamar tokens."
  );
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [profile, setProfile] = useState("buyer"); // 'buyer' or 'seller'
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const tempProvider = new Web3Provider(window.ethereum);
        await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = tempProvider.getSigner();
        const tempContract = new ethers.Contract(
          contractAddress,
          contractABI,
          tempSigner
        );

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setIsConnected(true);
        setStatusMessage("Conectado con MetaMask. Ahora puedes reclamar tokens.");
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        setStatusMessage("Error al conectar MetaMask.");
      }
    } else {
      setStatusMessage("MetaMask no está instalado. Por favor instala MetaMask.");
    }
  };

  const claimTokens = async () => {
    if (!contract) return;
    try {
      setStatusMessage("Procesando transacción...");
      const transaction = await contract.faucet();
      const receipt = await transaction.wait();
      if (receipt && receipt.status === 1) {
        setStatusMessage("Tokens reclamados exitosamente.");
      } else {
        setStatusMessage("Transacción fallida. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al reclamar tokens:", error);
      setStatusMessage("Error al reclamar tokens.");
    }
  };

  const handleNavigate = () => {
    navigate(`/${profile}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Faucet de ArchToken
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Dirección del contrato: <span className="font-mono">{contractAddress}</span>
        </p>

        {/* Status Message */}
        <div
          className={`p-4 rounded text-sm ${
            statusMessage.includes("éxitosamente")
              ? "bg-green-50 text-green-700"
              : statusMessage.includes("Error")
              ? "bg-red-50 text-red-700"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          {statusMessage}
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={connectWallet}
          disabled={isConnected}
          className={`w-full py-3 text-white rounded-lg transition duration-200 ${
            isConnected
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isConnected ? "Conectado" : "Conectar MetaMask"}
        </button>

        {/* Claim Tokens Button */}
        <button
          onClick={claimTokens}
          disabled={!isConnected}
          className={`w-full py-3 text-white rounded-lg transition duration-200 ${
            !isConnected
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Reclamar Tokens
        </button>

        {/* Profile Selector */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between">
            <button
              className={`w-1/2 py-2 rounded-l-lg border ${
                profile === "buyer"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500 hover:bg-green-50"
              }`}
              onClick={() => setProfile("buyer")}
            >
              Comprador
            </button>
            <button
              className={`w-1/2 py-2 rounded-r-lg border ${
                profile === "seller"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-50"
              }`}
              onClick={() => setProfile("seller")}
            >
              Vendedor
            </button>
          </div>
          <button
            onClick={handleNavigate}
            className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
          >
            Ir a {profile === "buyer" ? "Comprador" : "Vendedor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenFaucet;