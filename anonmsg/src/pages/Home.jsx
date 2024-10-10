import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();  // Hook para navegar entre rutas

    const handleStartChat = () => {
        navigate('/chats');  // Navegar a la página del chat
    };

    return (
        <div className="bg-gray-800 min-h-screen text-gray-200">
            <main className="container mx-auto mt-0 text-center px-4">  {/* Ajustar el margen superior */}
                <h2 className="text-5xl font-extrabold text-gray-100 animate-fade-in">
                    Welcome To <span className="text-gray-400">AnonMSG</span>
                </h2>
                <p className="mt-6 text-lg text-gray-300">
                    Chat Anonymously with anyone around the world. Chat Safe, Be Safe.
                </p>

                <div className="mt-12">
                    <button
                        onClick={handleStartChat}  // Maneja el clic para navegar
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Let's Chat
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
