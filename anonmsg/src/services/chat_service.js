import axios from 'axios';

// URL del backend (cambiar por el host del backend una vez levantado)
const API_URL = 'http://localhost:5000/api';

// Generar una nueva llave pública y privada
export const generateKeyPair = async () => {
    try {
        const response = await axios.get(`${API_URL}/generate-keypair`);
        return response.data;  // { publicKey, privateKey }
    } catch (error) {
        console.error("Error generando llaves: ", error);
        throw error;
    }
};

// Enviar un mensaje encriptado
export const sendMessage = async (encryptedMessage, recipientPublicKey) => {
    try {
        const response = await axios.post(`${API_URL}/send-message`, {
            encryptedMessage,
            recipientPublicKey
        });
        return response.data;
    } catch (error) {
        console.error("Error enviando el mensaje: ", error);
        throw error;
    }
};

// Obtener mensajes encriptados (usando la llave pública del usuario)
export const getMessages = async (userPublicKey) => {
    try {
        const response = await axios.get(`${API_URL}/messages/${userPublicKey}`);
        return response.data;  // { messages: [...] }
    } catch (error) {
        console.error("Error obteniendo mensajes: ", error);
        throw error;
    }
};
