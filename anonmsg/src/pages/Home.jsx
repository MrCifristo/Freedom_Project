import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();  // Hook para navegación entre rutas

    // Función para navegar a la página de post (Levanta tu Voz)
    const handlePostMessage = () => {
        navigate('/post');
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col justify-center items-center">
            <main className="container mx-auto text-center px-4">
                {/* Título */}
                <h2 className="text-6xl font-extrabold text-gray-100 mb-8 animate-fade-in">
                    Bienvenido a <span className="text-teal-400">AnonMSG</span>
                </h2>

                {/* Frases motivacionales con separadores */}
                <div className="text-2xl text-gray-300 font-light space-y-6 max-w-3xl mx-auto leading-relaxed">
                    <p>Levanta tu voz, eres libre.</p>
                    <hr className="border-gray-700" />
                    <p>La libertad empieza con una palabra.</p>
                    <hr className="border-gray-700" />
                    <p>Tu mensaje es tu poder, úsalo con valentía.</p>
                    <hr className="border-gray-700" />
                    <p>La verdad no se silencia, se comparte.</p>
                </div>

                {/* Botón principal */}
                <div className="mt-12">
                    <button
                        onClick={handlePostMessage}  // Navega a la página de post
                        className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Levanta tu Voz
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
