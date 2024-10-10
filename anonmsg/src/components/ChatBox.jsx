import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatBox = () => {
    const { publicKey } = useParams();  
    const [username, setUsername] = useState('');  
    const [hasJoinedChat, setHasJoinedChat] = useState(false);  
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);  
    const [filePreview, setFilePreview] = useState(null);  
    const [popupMessage, setPopupMessage] = useState(null);  // Mensaje actual en el popup
    const fileInputRef = useRef(null);  

    useEffect(() => {
        const simulateResponse = () => {
            if (messages.length > 0 && messages[messages.length - 1].sender === username) {
                setTimeout(() => {
                    const newMessage = {
                        sender: 'Bot',
                        text: 'Este es un mensaje de respuesta simulado.',
                    };
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }, 2000);
            }
        };
        simulateResponse();
    }, [messages, username]);

    const handleSendMessage = () => {
        if (message.trim() || file) {
            const newMessage = {
                sender: username,
                text: message,
                file: file ? URL.createObjectURL(file) : null,  
            };
            setMessages([...messages, newMessage]);
            setMessage('');
            setFile(null);  
            setFilePreview(null);  
            if (fileInputRef.current) {
                fileInputRef.current.value = '';  
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleJoinChat = () => {
        if (username.trim()) {
            setHasJoinedChat(true);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));  
    };

    const handleCopyPublicKey = () => {
        navigator.clipboard.writeText(publicKey);
        alert('Public Key Copied!');
    };

    // Función para mostrar el popup con el mensaje y eliminarlo en 5 segundos
    const handleShowPopupMessage = (msg, index) => {
        setPopupMessage(msg);
        setTimeout(() => {
            setPopupMessage(null);
            setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));  // Eliminar el mensaje
        }, 5000);
    };

    return (
        <div className="bg-gray-800 min-h-screen text-gray-200 p-6">
            {!hasJoinedChat ? (
                <div className="text-center mt-20">
                    <h2 className="text-3xl font-bold mb-6">Choose a username</h2>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        className="p-3 bg-gray-700 text-white rounded mb-4 w-full max-w-md mx-auto"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        onClick={handleJoinChat}
                        className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-full font-bold"
                    >
                        Join Chat
                    </button>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Chat's Public Key:</h2>
                            <p className="text-lg text-gray-300">{publicKey}</p>
                        </div>
                        <button
                            onClick={handleCopyPublicKey}
                            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out"
                        >
                            Copy Public Key
                        </button>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-md h-96 overflow-y-scroll mb-4 transition-all duration-300 ease-in-out transform">
                        {messages.length === 0 ? (
                            <p className="text-gray-400 text-center">No messages yet. Send the first one!</p>
                        ) : (
                            <ul>
                                {messages.map((msg, index) => (
                                    <li
                                        key={index}
                                        className="p-3 my-2 rounded-lg shadow-md transition-all duration-300 ease-in-out bg-gray-600 text-gray-300"
                                    >
                                        <strong>{msg.sender}:</strong>
                                        <button
                                            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full transition-transform transform hover:scale-105 duration-300"
                                            onClick={() => handleShowPopupMessage(msg.text, index)}
                                        >
                                            Abrir
                                        </button>
                                        {msg.file && (
                                            <div className="mt-2">
                                                <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                                    See attached file
                                                </a>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {filePreview && (
                        <div className="mb-4">
                            <h4 className="text-lg text-gray-300">Attached File:</h4>
                            <img src={filePreview} alt="Previsualización del archivo" className="rounded-lg max-h-40 mt-2" />
                        </div>
                    )}

                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Text something bro..."
                            className="flex-1 p-3 bg-gray-600 text-white rounded-l-lg"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out mx-2"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Choose File
                        </button>
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-r-lg transition-colors duration-300 ease-in-out"
                        >
                            Send
                        </button>
                    </div>

                    {popupMessage && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                                <p className="text-xl">{popupMessage}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBox;
