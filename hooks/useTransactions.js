import { useCallback, useEffect, useState } from "react";
import { fetchTransactions } from "../services/fetchTransactions";
import { transformTransactions } from "../utils/transactionTransformer";

export const useTransactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadTransactions = useCallback(async () => {
		try {
			setError(null);
			const data = await fetchTransactions();
			const transformed = transformTransactions(data);
			setTransactions(transformed);
		} catch (err) {
			setError(err.message || "Failed to fetch transactions");
			console.error("Error loading transactions:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		loadTransactions();
	}, [loadTransactions]);

	const refresh = useCallback(async () => {
		setRefreshing(true);
		await loadTransactions();
	}, [loadTransactions]);

	return {
		transactions,
		loading,
		error,
		refreshing,
		refresh,
	};
};
