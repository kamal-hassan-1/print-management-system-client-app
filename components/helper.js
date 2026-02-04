export const formatDate = (dateString) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return dateString; // Return as-is if invalid
	}
	const options = { month: "short", day: "numeric", year: "numeric" };
	return date.toLocaleDateString("en-US", options);
};

export const groupTransactionsByDate = (transactions) => {
	const grouped = {};
	transactions.forEach((transaction) => {
		const dateKey = transaction.timestamp 
			? new Date(transaction.timestamp).toISOString().split('T')[0]
			: transaction.date;
		
		if (!grouped[dateKey]) {
			grouped[dateKey] = {
				transactions: [],
			};
		}
		grouped[dateKey].transactions.push(transaction);
	});
	return grouped;
};
