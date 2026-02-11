import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

import config from '../config/config'; // Your config file from before

const API_BASE_URL = `${config.apiBaseUrl}/files`;


//----------------------------------- Calculate SHA-256 Hash of a file -----------------------------------// 


export const calculateFileHash = async (fileUri) => {
    try {
        // Read file as base64 to process binary data
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            fileContent
        );

        return hash;
    } catch (error) {
        console.error("Hashing error:", error);
        throw new Error("Failed to process file hash.");
    }
};


//----------------------------------- Check if file exists (HEAD /files/:hash) -----------------------------------//
export const checkFileExists = async (hash) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${hash}`, {
            method: 'HEAD',
        });

        // 200 = Exists (True), 404 = Not Found (False)
        return response.status === 200;
    } catch (error) {
        console.error("Check failed", error);
        return false; // Assume not found on error to be safe
    }
};


//--------------------------------Upload File (POST /files) Only called if checkFileExists returns false -----------------------------------//

export const uploadFile = async (file) => {
    const formData = new FormData();
    const token = await SecureStore.getItemAsync("token");

    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
    });

    const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error('Upload failed');

    // Server returns the hash, but we likely already have it.
    // We can return the JSON if needed.
    return await response.json();
};




//----------------------------------- Submit Job (POST /jobs) Sends only metadata and hashes -----------------------------------//

export const submitPrintJob = async (jobPayload) => {
    const token = await SecureStore.getItemAsync("token");

    const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        body: JSON.stringify(jobPayload),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error('Job submission failed');
    return await response.json();
};