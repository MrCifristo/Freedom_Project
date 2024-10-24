import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const messages = [
  "En el silencio, nuestras voces se alzan.",
  "Por cada voz silenciada, nos levantamos mil más.",
  "Tu libertad está a un mensaje de distancia.",
  "Habla la verdad, incluso cuando el mundo no te escuche.",
  "Tus palabras importan más de lo que crees."
];

const AboutCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Cambiar mensaje automáticamente cada 4 segundos, con opción de pausa
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((currentIndex - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((currentIndex + 1) % messages.length);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold mb-4 text-teal-400 tracking-wide">AnonMSG</h1>
        <p className="text-xl max-w-lg mx-auto text-gray-300">
          Bienvenido a <span className="font-semibold text-teal-400">AnonMSG</span>, la plataforma de comunicación anónima y encriptada. En momentos de represión, tu voz sigue resonando en la oscuridad.
        </p>
      </div>

      {/* Carrusel de mensajes */}
      <div className="relative bg-teal-800 text-white rounded-lg p-8 shadow-2xl max-w-lg w-full text-center transition-transform duration-500">
        <h2 className="text-3xl font-semibold transition-transform duration-1000 ease-in-out transform">
          {messages[currentIndex]}
        </h2>

        {/* Controles de navegación */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button 
            onClick={handlePrev} 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Mensaje anterior"
            className="text-white opacity-80 hover:opacity-100 hover:scale-110 transform transition duration-200">
            &#10094;
          </button>
          <button 
            onClick={handleNext} 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Siguiente mensaje"
            className="text-white opacity-80 hover:opacity-100 hover:scale-110 transform transition duration-200">
            &#10095;
          </button>
        </div>

        {/* Indicadores de carrusel */}
        <div className="mt-4 flex justify-center space-x-3">
          {messages.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white' : 'bg-gray-500'}`}
            ></span>
          ))}
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-12">
        <p className="text-gray-500 text-sm">© 2024 AnonMSG. Donde tu voz crea impacto.</p>
      </div>
    </div>
  );
};

export default AboutCarousel;