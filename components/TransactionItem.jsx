import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

const TransactionItem = ({ transaction, onPress }) => {
	return (
		<TouchableOpacity
			style={styles.transactionCard}
			onPress={onPress}>
			<View style={styles.transactionLeft}>
				{/*----------------- Print Icon -------------------- */}
				<View style={styles.transactionIcon}>
					<Feather
						name="file-text"
						size={18}
						color={colors.textSecondary}
					/>
				</View>

				{/*----------------- Transaction Info (Name, Time, Pages, Print Size) -------------------- */}
				<View style={styles.transactionInfo}>
					<Text style={styles.transactionName}>{transaction.name}</Text>
					<View style={styles.transactionDetails}>
						<Text style={styles.transactionTime}>{transaction.time}</Text>
						<Text style={styles.transactionDot}> • </Text>
						<Text style={styles.transactionPages}>{transaction.pages} pages</Text>
						<Text style={styles.transactionDot}> • </Text>
						<Text style={styles.transactionSize}>{transaction.printSize}</Text>
					</View>
				</View>
			</View>

			{/*----------------- Amount -------------------- */}
			<View style={styles.transactionRight}>
				<Text style={styles.transactionAmount}>Rs. {transaction.amount.toLocaleString()}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	transactionCard: {
		backgroundColor: "transparent",
		borderRadius: 0,
		padding: 16,
		paddingVertical: 12,
		marginBottom: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	transactionLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flex: 1,
	},
	transactionIcon: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: colors.background,
		justifyContent: "center",
		alignItems: "center",
	},
	transactionInfo: {
		flex: 1,
	},
	transactionName: {
		fontSize: 15,
		fontWeight: "500",
		color: colors.textPrimary,
		marginBottom: 4,
	},
	transactionDetails: {
		flexDirection: "row",
		alignItems: "center",
	},
	transactionTime: {
		fontSize: 13,
		color: colors.textSecondary,
		opacity: 0.7,
	},
	transactionDot: {
		fontSize: 13,
		color: colors.textSecondary,
		opacity: 0.5,
	},
	transactionPages: {
		fontSize: 13,
		color: colors.textSecondary,
		opacity: 0.7,
	},
	transactionSize: {
		fontSize: 13,
		color: colors.textSecondary,
		opacity: 0.7,
	},
	transactionRight: {
		alignItems: "flex-end",
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
});
export default TransactionItem;
