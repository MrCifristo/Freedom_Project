import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatsFeed = () => {
    const [activeChats, setActiveChats] = useState([]);  // Lista de chats activos simulados
    const [publicKey, setPublicKey] = useState('');  // Llave pública para unirse a un chat
    const [generatedKey, setGeneratedKey] = useState('');  // Llave pública generada
    const navigate = useNavigate();

    // Crear un nuevo chat (simulado)
    const handleCreateChat = () => {
        const newChatPublicKey = `chat-${Date.now()}`;  // Crear una llave pública simulada
        setActiveChats([...activeChats, { publicKey: newChatPublicKey }]);
        setGeneratedKey(newChatPublicKey);  // Guardar la llave pública generada

        // Abrir el nuevo chat en una pestaña nueva
        const newChatUrl = `/chat/${newChatPublicKey}`;
        const newWindow = window.open(newChatUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    // Ingresar a un chat existente
    const handleJoinChat = (chatPublicKey) => {
        navigate(`/chat/${chatPublicKey}`);  // Redirigir al chat ingresado
    };

    return (
        <div className="bg-gray-800 min-h-screen text-gray-200 p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Latest Chat</h1>

            {/* Botón para crear un nuevo chat */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleCreateChat}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                >
                    Create a New Chat
                </button>
            </div>

            {/* Mostrar la llave pública generada */}
            {generatedKey && (
                <div className="text-center mb-6">
                    <p className="text-lg">Your Public Key: <span className="font-bold">{generatedKey}</span></p>
                    <button
                        onClick={() => navigator.clipboard.writeText(generatedKey)}
                        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-full mt-4 transition-colors duration-300 ease-in-out"
                    >
                        Copy Public Key
                    </button>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-4">Active Chats:</h2>
            <ul>
                {activeChats.length === 0 ? (
                    <p className="text-gray-400">No Active Chats Yet. Create a New One.</p>
                ) : (
                    activeChats.map((chat, index) => (
                        <li key={index} className="bg-gray-700 text-white p-3 my-2 rounded-lg shadow-lg flex justify-between items-center">
                            <span>Llave Pública: {chat.publicKey}</span>
                            <button
                                onClick={() => handleJoinChat(chat.publicKey)}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out"
                            >
                                Join Chat
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ChatsFeed;
