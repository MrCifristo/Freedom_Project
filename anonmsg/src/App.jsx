import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ChatBox from './components/ChatBox';
import ChatsFeed from './pages/ChatsFeed';
import * as jwtDecode from 'jwt-decode';  // Importación corregida

const App = () => {
    const [userToken, setUserToken] = useState(null);
    const [username, setUsername] = useState('');

    // Leer el token desde sessionStorage al cargar la app
    useEffect(() => {
        const storedToken = sessionStorage.getItem('userToken');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);  // Usar jwtDecode correctamente
                setUsername(decoded.username);
                setUserToken(storedToken);
            } catch (err) {
                console.error('Error al decodificar el token:', err);
                sessionStorage.removeItem('userToken');
            }
        }
    }, []);

    return (
        <Router>
            <Header /> {/* El header visible en todas las páginas */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chats" element={<ChatsFeed />} />
                <Route path="/chat/:publicKey" element={<ChatBox username={username} />} /> {/* Pasar username al chat */}
            </Routes>
        </Router>
    );
};

export default App;
