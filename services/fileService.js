import * as SecureStore from 'expo-secure-store';
import config from '../config/config';

const API_BASE_URL = `${config.apiBaseUrl}/files`;

const getHeaders = async (isMultipart = false) => {
    const token = await SecureStore.getItemAsync("authToken");
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    const token = await SecureStore.getItemAsync("authToken");

    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    });

    // IMPORTANT: Let fetch handle 'Content-Type' for multipart boundaries
    const response = await fetch(`${API_BASE_URL}`, { 
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.log("Server Error Body:", errBody);
        throw new Error('Upload failed');
    }

    return await response.json();
};