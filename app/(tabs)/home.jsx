import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionList from "../../components/TransactionList";
import { colors } from "../../constants/colors";
import { mockTransactions } from "../../data/mockData";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomePage = () => {
	const router = useRouter();
	return (
		<SafeAreaView
			style={styles.container}
			edges={["top"]}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.background}
			/>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Top Cards Section */}

				<View style={styles.topCardsContainer}>
					<View style={styles.cardsRow}>
						{/* Current Balance Card */}

						<TouchableOpacity style={styles.balanceCard}>
							<View style={styles.balanceContent}>
								<Text style={styles.balanceLabel}>Current Balance</Text>
								<Text style={styles.balanceAmount}>Rs. 0</Text>
							</View>
						</TouchableOpacity>

						{/* Action Cards Column */}

						<View style={styles.actionCardsColumn}>
							{/* Credit Wallet Card */}

							<TouchableOpacity
								style={[styles.actionCard, styles.creditWalletCard]}
								onPress={() => {
									Alert.alert("Payment funtionality to be added soon!");
								}}>
								<View style={styles.actionCardIcon}>
									<Feather
										name="arrow-down"
										size={18}
										color={colors.cardBackground}
									/>
								</View>
								<Text style={styles.actionCardText}>Credit Wallet</Text>
							</TouchableOpacity>

							{/* New Print Card */}

							<TouchableOpacity
								style={[styles.actionCard, styles.printRequestCard]}
								onPress={() => {
									router.push("/new-print");
								}}>
								<Text style={styles.actionCardText}>New Print</Text>
								<View style={styles.actionCardIconRight}>
									<Feather
										name="arrow-up-right"
										size={18}
										color={colors.cardBackground}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{/* Transaction History - Latest 3 */}

				<View style={styles.transactionsContainer}>
					<View style={styles.historyHeader}>
						<Text style={styles.historyTitle}>Recent Transactions</Text>
						<TouchableOpacity onPress={() => router.push("/printHistory")}>
							<Text style={styles.seeAllText}>See All</Text>
						</TouchableOpacity>
					</View>

					<TransactionList
						transactions={mockTransactions}
						limit={3}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

//----------------------------------- Styles -----------------------------------//

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 20,
		flexGrow: 1,
	},
	topCardsContainer: {
		padding: 20,
		maxWidth: 600,
		alignSelf: "center",
		width: "100%",
	},
	cardsRow: {
		flexDirection: "row",
		gap: 16,
		height: Math.min(SCREEN_HEIGHT * 0.35, 300),
		minHeight: 240,
	},
	balanceCard: {
		flex: 1,
		backgroundColor: colors.primary,
		borderRadius: 24,
		padding: 22,
		shadowColor: colors.shadowPrimary,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 32,
		elevation: 8,
	},
	balanceContent: {
		flex: 1,
		justifyContent: "flex-start",
	},
	balanceLabel: {
		fontSize: 18,
		fontWeight: "500",
		color: colors.cardBackground,
		opacity: 0.9,
		marginBottom: 8,
		letterSpacing: 0.3,
	},
	balanceAmount: {
		fontSize: Math.min(SCREEN_WIDTH * 0.16, 52),
		fontWeight: "700",
		color: colors.cardBackground,
		letterSpacing: -2,
	},
	balanceFooter: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	arrowButton: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: colors.cardOverlay,
		justifyContent: "center",
		alignItems: "center",
	},
	actionCardsColumn: {
		flex: 1,
		gap: 16,
	},
	actionCard: {
		flex: 1,
		borderRadius: 24,
		padding: 20,
		justifyContent: "space-between",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 24,
		elevation: 6,
	},
	creditWalletCard: {
		backgroundColor: colors.creditWallet,
		shadowColor: colors.shadowCreditWallet,
	},
	printRequestCard: {
		backgroundColor: colors.printRequest,
		shadowColor: colors.shadowPrintRequest,
	},
	actionCardIcon: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: colors.cardOverlay,
		justifyContent: "center",
		alignItems: "center",
	},
	actionCardIconRight: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: colors.cardOverlay,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-end",
	},
	actionCardText: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.cardBackground,
		lineHeight: 22,
	},
	transactionsContainer: {
		backgroundColor: colors.cardBackground,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 20,
		marginTop: 12,
		flex: 1,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	historyTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	seeAllText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.primary,
	},
});
export default HomePage;
