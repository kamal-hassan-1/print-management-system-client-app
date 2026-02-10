// to do in this services

import config from "../config/config";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = config.apiBaseUrl;	

const api = async (url, options = {}) => {
	const token = await SecureStore.getItemAsync("token");
	const finalOptions = {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			...(options.headers || {}),
		},
	};
	const response = await fetch(API_BASE_URL + url, finalOptions);
	if (!response.ok) {
		const error = await response.text();
		throw new Error(error || "Network response was not ok");
	}
	return response.json();
};

// Fetch all transactions
export const fetchTransactions = async () => {
	try {
		const data = await api("/history");
		return data.data;
	} catch (error) {
		console.log("Error fetching transactions:", error);
		//--------------------------------------------------------delete line 26 add line 28 and 29
		//console.error("Error fetching transactions:", error);
		// throw error;
	}
};
export default api;