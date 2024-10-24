import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-900 p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo que funciona como enlace a la página principal */}
                <Link to="/" className="text-4xl font-extrabold text-teal-400 hover:text-teal-300 transition duration-300 ease-in-out">
                    AnonMSG
                </Link>

                {/* Menú de navegación */}
                <nav>
                    <ul className="flex space-x-8 text-lg font-semibold">
                        <li>
                            <Link 
                                to="/about" 
                                className="text-gray-300 hover:text-white transition duration-300 ease-in-out"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/post" 
                                className="text-gray-300 hover:text-white transition duration-300 ease-in-out"
                            >
                                Post
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;