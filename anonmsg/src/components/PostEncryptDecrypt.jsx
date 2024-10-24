import React, { useState, useEffect } from 'react';
import forge from 'node-forge';  // Importa forge para encriptación y desencriptación

const PostEncryptDecrypt = () => {
    const [post, setPost] = useState('');  // El post a encriptar
    const [publicKey, setPublicKey] = useState('');  // Llave pública del destinatario
    const [privateKey, setPrivateKey] = useState('');  // Llave privada para desencriptar
    const [myPublicKey, setMyPublicKey] = useState('');  // Llave pública generada
    const [myPrivateKey, setMyPrivateKey] = useState('');  // Llave privada generada
    const [encryptedPost, setEncryptedPost] = useState('');  // Post encriptado
    const [decryptedPost, setDecryptedPost] = useState('');  // Post desencriptado

    const [manualEncryptedPost, setManualEncryptedPost] = useState('');  // Post encriptado ingresado manualmente

    useEffect(() => {
        // Generar las llaves RSA al montar el componente
        try {
            const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);
            const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
            const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            setMyPublicKey(publicKeyPem);
            setMyPrivateKey(privateKeyPem);
        } catch (error) {
            console.error("Error al generar las llaves RSA:", error);
        }
    }, []);

    // Función para encriptar el post usando la llave pública del destinatario
    const encryptPost = () => {
        if (!publicKey) {
            alert("Por favor, introduce la llave pública del destinatario.");
            return;
        }

        try {
            // Usar la llave pública proporcionada (Josue) para encriptar el mensaje
            const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
            const encrypted = publicKeyObj.encrypt(forge.util.encodeUtf8(post), 'RSA-OAEP');
            const encryptedPostBase64 = forge.util.encode64(encrypted);
            setEncryptedPost(encryptedPostBase64);  // Guardar el post encriptado
        } catch (error) {
            alert("Error encriptando el post. Asegúrate de que la llave pública sea correcta.");
        }
    };

    // Función para desencriptar el post usando la llave privada del receptor
    const decryptPost = (message) => {
        if (!privateKey) {
            alert("Por favor, introduce tu llave privada para desencriptar el mensaje.");
            return;
        }

        try {
            // Usar la llave privada del receptor (Josue) para desencriptar el mensaje
            const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
            const encryptedBytes = forge.util.decode64(message);
            const decrypted = privateKeyObj.decrypt(encryptedBytes, 'RSA-OAEP');
            setDecryptedPost(forge.util.decodeUtf8(decrypted));
        } catch (error) {
            alert("Error desencriptando el post. Asegúrate de que la llave privada sea correcta.");
        }
    };

    const copyPublicKey = () => {
        navigator.clipboard.writeText(myPublicKey);
        alert("¡Llave pública copiada al portapapeles!");
    };

    const copyPrivateKey = () => {
        navigator.clipboard.writeText(myPrivateKey);
        alert("¡Llave privada copiada al portapapeles!");
    };

    const copyEncryptedPost = () => {
        navigator.clipboard.writeText(encryptedPost);
        alert("¡Mensaje encriptado copiado al portapapeles!");
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 p-6">
            <h1 className="text-5xl font-bold text-center mb-10">Protege tu Mensaje</h1>

            {/* Llaves generadas por Keneth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-semibold mb-4">Mi Llave Pública</h2>
                    <button
                        onClick={copyPublicKey}
                        className="bg-teal-500 hover:bg-teal-400 text-white py-2 px-6 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Copiar Llave Pública
                    </button>
                </div>
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-semibold mb-4">Mi Llave Privada</h2>
                    <button
                        onClick={copyPrivateKey}
                        className="bg-yellow-500 hover:bg-yellow-400 text-white py-2 px-6 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Copiar Llave Privada
                    </button>
                </div>
            </div>

            {/* Llave pública del destinatario (Josue) */}
            <textarea
                placeholder="Introduce la llave pública del destinatario"
                className="w-full p-4 bg-gray-800 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
            />

            {/* Área de post (Keneth) */}
            <textarea
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-4 bg-gray-800 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                value={post}
                onChange={(e) => setPost(e.target.value)}
            />

            {/* Botón de encriptar */}
            <div className="text-center">
                <button
                    onClick={encryptPost}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-full font-bold mb-6 transition-transform transform hover:scale-105 duration-300 ease-in-out"
                >
                    Encriptar & Compartir
                </button>
            </div>

            {/* Mostrar mensaje encriptado */}
            {encryptedPost && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Mensaje Encriptado</h2>
                    <p className="bg-gray-700 p-4 rounded-lg">{encryptedPost}</p>
                    <button
                        onClick={copyEncryptedPost}
                        className="bg-teal-500 hover:bg-teal-400 text-white py-2 px-6 mt-4 rounded-full font-bold transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Copiar Mensaje Encriptado
                    </button>
                </div>
            )}

            {/* Área para que Josue introduzca el mensaje encriptado */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Introduce un Mensaje Encriptado para Desencriptar</h2>
                <textarea
                    placeholder="Pega aquí el mensaje encriptado"
                    className="w-full p-4 bg-gray-800 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                    value={manualEncryptedPost}
                    onChange={(e) => setManualEncryptedPost(e.target.value)}
                />

                {/* Llave privada de Josue */}
                <textarea
                    placeholder="Introduce tu llave privada para desencriptar"
                    className="w-full p-4 bg-gray-800 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                />

                {/* Botón de desencriptar */}
                <div className="text-center">
                    <button
                        onClick={() => decryptPost(manualEncryptedPost)}
                        className="bg-red-600 hover:bg-red-500 text-white py-3 px-8 rounded-full font-bold mb-6 transition-transform transform hover:scale-105 duration-300 ease-in-out"
                    >
                        Desencriptar Mensaje
                    </button>
                </div>

                {/* Mostrar mensaje desencriptado */}
                {decryptedPost && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
                        <h2 className="text-2xl font-semibold mb-4">Mensaje Desencriptado</h2>
                        <p className="bg-gray-700 p-4 rounded-lg">{decryptedPost}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostEncryptDecrypt;