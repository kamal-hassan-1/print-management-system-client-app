import config from "../config/config";
const API_BASE_URL = config.apiBaseUrl;

const api = async (url, options = {}) => {
	const finalOptions = {
		...options,
		headers: {
			"Content-Type": "application/json",
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
		const data = await api("/transactions");
		return data.data;
	} catch (error) {
		console.error("Error fetching transactions:", error);
		throw error;
	}
};

// Fetch transactions with filters
export const fetchFilteredTransactions = async (filters = {}) => {
	try {
		const queryString = new URLSearchParams(filters).toString();
		const data = await api(`/transactions?${queryString}`);
		return data.data;
	} catch (error) {
		console.error("Error fetching filtered transactions:", error);
		throw error;
	}
};
export default api;