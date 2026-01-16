import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { formatDate, groupTransactionsByDate } from "../data/mockData";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, limit = null, onTransactionPress }) => {
	// Limit transactions if specified
	const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

	// Group transactions by date
	const groupedTransactions = groupTransactionsByDate(displayTransactions);

	// Get sorted date keys (most recent first)
	const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

	return (
		<View style={styles.container}>
			{sortedDates.map((date, index) => {
				const { transactions: dailyTransactions } = groupedTransactions[date];
				const isFirstDate = index === 0;

				return (
					<View
						key={date}
						style={styles.dateSection}>
						<View style={styles.dateHeader}>
							<Text style={isFirstDate ? styles.dateText : styles.dateTextSecondary}>{formatDate(date)}</Text>
						</View>

						{dailyTransactions.map((transaction) => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								onPress={() => onTransactionPress && onTransactionPress(transaction)}
							/>
						))}
					</View>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	dateSection: {
		marginBottom: 24,
	},
	dateHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	dateText: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.textPrimary,
		letterSpacing: -0.5,
	},
	dateTextSecondary: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		letterSpacing: -0.3,
	},
	dateSummary: {
		fontSize: 14,
		fontWeight: "400",
		color: colors.textSecondary,
		opacity: 0.6,
	},
});

export default TransactionList;
