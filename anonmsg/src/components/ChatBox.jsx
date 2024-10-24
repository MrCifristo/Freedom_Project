import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import forge from 'node-forge';  // Importa forge para manejar encriptación

const ChatBox = () => {
    const { publicKey } = useParams();  // Obtener la llave pública de la URL (llave del destinatario)
    const [username, setUsername] = useState('');  // Guardar el nombre del usuario
    const [hasJoinedChat, setHasJoinedChat] = useState(false);  // Verificar si se ha unido al chat
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);  // Para almacenar el archivo seleccionado
    const [filePreview, setFilePreview] = useState(null);  // Para previsualizar el archivo
    const fileInputRef = useRef(null);  // Para resetear el input de archivo
    const [privateKey, setPrivateKey] = useState('');  // Para almacenar la llave privada
    const [encryptedMessage, setEncryptedMessage] = useState('');  // Almacena el mensaje encriptado
    const [decryptedMessage, setDecryptedMessage] = useState('');  // Almacena el mensaje desencriptado

    useEffect(() => {
        const simulateResponse = () => {
            if (messages.length > 0 && messages[messages.length - 1].sender === username) {
                // Simula una respuesta después de 2 segundos
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

    // Función para encriptar el mensaje usando la llave pública del destinatario
    function encryptMessage(publicKeyPem, message) {
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const encrypted = publicKey.encrypt(forge.util.encodeUtf8(message), 'RSA-OAEP');
        return forge.util.encode64(encrypted);
    }

    // Función para desencriptar el mensaje usando la llave privada
    function decryptMessage(privateKeyPem, encryptedMessage) {
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        const encryptedBytes = forge.util.decode64(encryptedMessage);
        const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP');
        return forge.util.decodeUtf8(decrypted);
    }

    // Función para enviar un mensaje o archivo
    const handleSendMessage = () => {
        if (message.trim() || file) {
            let encrypted = message;

            // Encriptar el mensaje solo si hay una llave pública
            if (publicKey) {
                encrypted = encryptMessage(publicKey, message);  // Encripta el mensaje con la llave pública
                setEncryptedMessage(encrypted);  // Almacena el mensaje encriptado
            }

            const newMessage = {
                sender: username,
                text: encrypted,  // El mensaje se enviará encriptado
                file: file ? URL.createObjectURL(file) : null,  // Crear una URL para el archivo
            };

            setMessages([...messages, newMessage]);
            setMessage('');
            setFile(null);  // Limpiar el archivo después de enviar
            setFilePreview(null);  // Limpiar la previsualización
            if (fileInputRef.current) {
                fileInputRef.current.value = '';  // Limpiar el input de archivo
            }
        }
    };

    // Función para desencriptar el mensaje con la llave privada ingresada
    const handleDecrypt = () => {
        const decrypted = decryptMessage(privateKey, encryptedMessage);
        setDecryptedMessage(decrypted);
    };

    // Manejar el envío de mensajes al presionar "Enter"
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Función para unirse al chat con el nombre de usuario
    const handleJoinChat = () => {
        if (username.trim()) {
            setHasJoinedChat(true);
        }
    };

    // Manejar selección de archivo y previsualización
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));  // Crear una URL para previsualizar el archivo
    };

    // Función para copiar la llave pública
    const handleCopyPublicKey = () => {
        navigator.clipboard.writeText(publicKey);
        alert('Public Key Copied!');
    };

    return (
        <div className="bg-gray-800 min-h-screen text-gray-200 p-6">
            {!hasJoinedChat ? (
                // Formulario para elegir el nombre de usuario antes de ingresar al chat
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
                                        className={`p-3 my-2 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                                            msg.sender === username ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                                        }`}
                                    >
                                        <strong>{msg.sender}:</strong> {msg.text}
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

                    {/* Previsualización de archivo */}
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
                            onKeyPress={handleKeyPress}  // Escuchar la tecla "Enter"
                        />
                        <input
                            type="file"
                            className="hidden"  // Ocultar input de archivo original
                            ref={fileInputRef}  // Referencia para limpiar el input
                            onChange={handleFileChange}
                        />
                        <button
                            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out mx-2"
                            onClick={() => fileInputRef.current.click()}  // Simular clic en el input de archivo
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

                    {/* Nueva sección para ingresar la llave privada y desencriptar */}
                    <div className="mt-6">
                        <textarea
                            placeholder="Enter your private key here..."
                            className="w-full p-3 bg-gray-600 text-white rounded-lg mb-4"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                        />
                        <button
                            onClick={handleDecrypt}
                            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-bold transition-colors duration-300 ease-in-out"
                        >
                            Decrypt Message
                        </button>

                        {decryptedMessage && (
                            <div className="mt-4">
                                <h4 className="text-lg text-white">Decrypted Message:</h4>
                                <p className="bg-gray-700 p-3 rounded-lg">{decryptedMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;