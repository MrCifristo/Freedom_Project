import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-900 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-200">
                    AnonMSG
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/" className="text-gray-300 text-lg font-semibold hover:text-white transition duration-300 ease-in-out">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="text-gray-300 text-lg font-semibold hover:text-white transition duration-300 ease-in-out">
                                About
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
