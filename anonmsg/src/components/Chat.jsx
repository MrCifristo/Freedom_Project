import React, { useState, useEffect } from 'react';
import { generateKeyPair, sendMessage, getMessages } from '../services/chatService';

const Chat = () => {
    const [userPublicKey, setUserPublicKey] = useState('');
    const [userPrivateKey, setUserPrivateKey] = useState('');
    const [recipientPublicKey, setRecipientPublicKey] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Generar llaves públicas y privadas cuando se monte el componente
    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const { publicKey, privateKey } = await generateKeyPair();
                setUserPublicKey(publicKey);
                setUserPrivateKey(privateKey);
            } catch (error) {
                console.error("Error obteniendo llaves", error);
            }
        };

        fetchKeys();
    }, []);

    // Enviar un mensaje
    const handleSendMessage = async () => {
        if (message && recipientPublicKey) {
            try {
                // Aquí es donde encriptarías el mensaje usando las llaves
                // Solo como ejemplo básico:
                const encryptedMessage = `${message}-encrypted`;

                await sendMessage(encryptedMessage, recipientPublicKey);
                setMessage('');  // Limpiar el mensaje

                // Actualizar la lista de mensajes (supone que el backend devuelve el nuevo mensaje)
                const updatedMessages = await getMessages(userPublicKey);
                setMessages(updatedMessages.messages);
            } catch (error) {
                console.error("Error enviando el mensaje", error);
            }
        }
    };

    // Obtener mensajes para el usuario
    const fetchMessages = async () => {
        try {
            const { messages } = await getMessages(userPublicKey);
            setMessages(messages);
        } catch (error) {
            console.error("Error obteniendo mensajes", error);
        }
    };

    return (
        <div className="chat-container p-4 bg-gray-800 text-gray-200">
            <h2 className="text-xl font-bold mb-4">Chat Anónimo</h2>

            <div className="mb-4">
                <strong>Tu llave pública:</strong>
                <p className="break-words text-gray-400">{userPublicKey}</p>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Llave pública del destinatario"
                    className="p-2 bg-gray-700 text-white rounded w-full"
                    value={recipientPublicKey}
                    onChange={(e) => setRecipientPublicKey(e.target.value)}
                />
            </div>

            <div className="mb-4">
        <textarea
            placeholder="Escribe tu mensaje"
            className="p-2 bg-gray-700 text-white rounded w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />
            </div>

            <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
            >
                Enviar Mensaje
            </button>

            <div className="mt-6">
                <button onClick={fetchMessages} className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded">
                    Obtener Mensajes
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold">Mensajes:</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index} className="bg-gray-700 p-2 my-2 rounded">
                            {msg}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;
