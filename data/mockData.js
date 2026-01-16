// Mock data

export const mockTransactions = [
	{
		id: "1",
		name: "Document 1", // Document name
		amount: 1353,
		date: "2025-01-15",
		time: "3:57 PM",
		printSize: "A4",
		pages: 5,
	},
	{
		id: "4",
		name: "Assignment Print",
		amount: 607,
		date: "2025-01-16",
		time: "3:43 PM",
		printSize: "Letter",
		pages: 8,
	},
	{
		id: "5",
		name: "Office Prints",
		amount: 850,
		date: "2025-01-15",
		time: "10:30 AM",
		printSize: "A4",
		pages: 15,
	},
	{
		id: "6",
		name: "Ali Ahmad",
		amount: 1200,
		date: "2025-01-13",
		time: "4:15 PM",
		printSize: "A4",
		pages: 20,
	},
	{
		id: "7",
		name: "University Prints",
		amount: 450,
		date: "2025-01-12",
		time: "9:00 AM",
		printSize: "A4",
		pages: 25,
	},
	{
		id: "8",
		name: "Color Prints",
		amount: 1500,
		date: "2025-01-12",
		time: "2:20 PM",
		printSize: "A3",
		pages: 12,
	},
	{
		id: "9",
		name: "Sara Khan",
		amount: 750,
		date: "2025-01-11",
		time: "11:45 AM",
		printSize: "A4",
		pages: 10,
	},
	{
		id: "10",
		name: "Photo Prints",
		amount: 2000,
		date: "2025-01-11",
		time: "5:30 PM",
		printSize: "4x6",
		pages: 50,
	},
];

// Helper function to group transactions by date
export const groupTransactionsByDate = (transactions) => {
	const grouped = {};

	transactions.forEach((transaction) => {
		if (!grouped[transaction.date]) {
			grouped[transaction.date] = {
				transactions: [],
				total: 0,
			};
		}
		grouped[transaction.date].transactions.push(transaction);
		grouped[transaction.date].total += transaction.amount;
	});

	return grouped;
};

// Helper function to format date nicely
export const formatDate = (dateString) => {
	const date = new Date(dateString);
	const options = { month: "short", day: "numeric", year: "numeric" };
	return date.toLocaleDateString("en-US", options);
};

// Helper function to calculate total for a period
export const calculateTotal = (transactions) => {
	return transactions.reduce((total, transaction) => {
		return total + transaction.amount;
	}, 0);
};
