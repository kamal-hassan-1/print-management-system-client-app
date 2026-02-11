import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import config from '../config/config';

// Removed the trailing slash from the base URL logic
const API_BASE_URL = `${config.apiBaseUrl}/files`;
const AUTH_TOKEN_KEY = 'authToken';

/**
 * Helper to get headers with token
 */
const getHeaders = async (isMultipart = false) => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

// 1. Calculate Hash
export const calculateFileHash = async (fileUri) => {
    try {
        // 1. Read the file using the legacy import
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // 2. Hash it
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            fileContent
        );

        return hash;
    } catch (error) {
        // This will now catch any remaining native issues
        console.error("Final Hashing Attempt Error:", error);
        throw new Error("Hash generation failed. Check native module linking.");
    }
};

// 2. Check if file exists (HEAD)
export const checkFileExists = async (hash) => {
    try {
        const headers = await getHeaders();
        // Removed the extra slash: now becomes /files/:hash
        const response = await fetch(`${API_BASE_URL}/${hash}`, {
            method: 'HEAD',
            headers: headers // Added headers for auth
        });

        return response.status === 200;
    } catch (error) {
        console.error("Check failed", error);
        return false;
    }
};

// 3. Upload File (POST)
export const uploadFile = async (file) => {
    const formData = new FormData();
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

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
            // DO NOT set Content-Type here
        },
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.log("Server Error Body:", errBody);
        throw new Error('Upload failed');
    }

    return await response.json();
};