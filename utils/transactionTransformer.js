// -------------------------- Transform single backend transaction --------------------------

const transformTransaction = (backendTransaction) => {
	const rawTimestamp = backendTransaction.timestamp?.$date || backendTransaction.timestamp;
	const timestamp = new Date(rawTimestamp);

	// Extract date in YYYY-MM-DD format
	const date = timestamp.toLocaleDateString();

	// Extract time in HH:MM AM/PM format
	const time = timestamp.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return {
		id: backendTransaction._id,
		name: backendTransaction.name,
		amount: backendTransaction.amount,
		date: date,
		time: time,
		timestamp: backendTransaction.timestamp, // Keep original for sorting
		pages: backendTransaction.pages,
		printSize: backendTransaction.printSize,
	};
};

// -------------------------- Transform array of backend transactions --------------------------

const transformTransactions = (backendTransactions) => {
	if (!Array.isArray(backendTransactions)) {
		return [];
	}
	return backendTransactions.map(transformTransaction);
};

export { transformTransaction, transformTransactions };
