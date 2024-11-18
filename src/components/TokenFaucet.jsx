// src/components/TokenFaucet.jsx
import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

const contractAddress = "0x992b58ecb6203698e3615e1ad4343a1227e12ea9";
const contractABI = [
    "function faucet() public",
    "function faucetAmount() public view returns (uint256)",
    "function cooldownTime() public view returns (uint256)",
    "function lastClaimed(address) public view returns (uint256)"
];

const TokenFaucet = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Conecta tu billetera para reclamar tokens.");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const tempProvider = new Web3Provider(window.ethereum);
                await tempProvider.send("eth_requestAccounts", []);
                const tempSigner = tempProvider.getSigner();
                const tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);

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

    const checkCooldown = async () => {
        if (!contract || !signer) return true;
        try {
            const address = await signer.getAddress();
            const lastClaimed = await contract.lastClaimed(address);
            const cooldownTime = await contract.cooldownTime();
            const currentTime = BigInt(Math.floor(Date.now() / 1000)); // Convertir el tiempo actual a BigInt
            const timeElapsed = currentTime - BigInt(lastClaimed.toString()); // Convertir lastClaimed a BigInt y calcular tiempo transcurrido
            const timeLeft = BigInt(cooldownTime.toString()) - timeElapsed; // Convertir cooldownTime a BigInt y calcular tiempo restante

            if (timeLeft > 0) { // Si el tiempo restante es mayor que 0, el usuario debe esperar
                setStatusMessage(`Debes esperar ${timeLeft.toString()} segundos antes de reclamar de nuevo.`);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error al verificar el tiempo de espera:", error);
            setStatusMessage("Error al verificar el tiempo de espera.");
            return false;
        }
    };

    const claimTokens = async () => {
        if (!contract) return;
        const canClaim = await checkCooldown();
        if (!canClaim) return;

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

    return (
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-center space-y-6">
            <h2 className="text-3xl font-semibold text-indigo-400 mb-2">Faucet de ArchToken</h2>
            <p className="text-gray-300">{statusMessage}</p>
            <button
                onClick={connectWallet}
                disabled={isConnected}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ${isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isConnected ? "Conectado" : "Conectar MetaMask"}
            </button>
            <button
                onClick={claimTokens}
                disabled={!isConnected}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Reclamar Tokens
            </button>
        </div>
    );
};

export default TokenFaucet;
