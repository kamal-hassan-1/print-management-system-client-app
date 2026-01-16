import { Feather, Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LandingPage = () => {
	return (
		<SafeAreaView style={styles.container}>
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
								<View>
									<Text style={styles.balanceLabel}>Current Balance</Text>
									<Text style={styles.balanceAmount}>Rs. 0</Text>
								</View>

								{/* Arrow */}
								<View style={styles.balanceFooter}>
									<View style={styles.arrowButton}>
										<Feather
											name="arrow-right"
											size={24}
											color={colors.cardBackground}
										/>
									</View>
								</View>
							</View>
						</TouchableOpacity>

						{/* Action Cards Column */}
						<View style={styles.actionCardsColumn}>
							{/* Load Money Card */}
							<TouchableOpacity style={[styles.actionCard, styles.creditWalletCard]}>
								<View style={styles.actionCardIcon}>
									<Feather
										name="arrow-down"
										size={18}
										color={colors.cardBackground}
									/>
								</View>
								<Text style={styles.actionCardText}>Credit Wallet</Text>
							</TouchableOpacity>

							{/* Send & Request Card */}
							<TouchableOpacity style={[styles.actionCard, styles.printRequestCard]}>
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

				{/* Transaction History */}
				<View style={styles.transactionsContainer}>
					{/* Jan 15, 2025 Section */}
					<View style={styles.dateSection}>
						<View style={styles.dateHeader}>
							{/* Date header */}
							<Text style={styles.dateText}>Jan 15, 2025</Text>
							{/* date ke sath jo sadapay me uss din ka net hota */}
							<Text style={styles.dateSummary}>- Rs. 1353</Text>
						</View>

						{/* Transaction 1 */}
						<TouchableOpacity style={styles.transactionCard}>
							<View style={styles.transactionLeft}>
								<View style={[styles.transactionIcon, { backgroundColor: colors.expenseBackground }]}>
									<Feather
										name="arrow-up-right"
										size={18}
										color={colors.expense}
									/>
								</View>
								<View>
									<Text style={styles.transactionName}>PSO</Text>
									<Text style={styles.transactionTime}>3:57 PM</Text>
								</View>
							</View>
							<Text style={styles.transactionAmount}>Rs. 1,353</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* Bottom Navigation */}
			<View style={styles.bottomNav}>
				<TouchableOpacity style={styles.navItem}>
					<View style={[styles.navIconContainer, styles.navIconActive]}>
						<Ionicons
							name="home"
							size={20}
							color={colors.cardBackground}
						/>
					</View>
					<Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navItem}>
					<View style={styles.navIconContainer}>
						<Ionicons
							name="receipt-outline"
							size={20}
							color={colors.navInactive}
						/>
					</View>
					<Text style={[styles.navLabel, styles.navLabelInactive]}>Print History</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navItem}>
					<View style={styles.navIconContainer}>
						<Ionicons
							name="person-outline"
							size={20}
							color={colors.navInactive}
						/>
					</View>
					<Text style={[styles.navLabel, styles.navLabelInactive]}>Profile</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 0,
		flexGrow: 1,
	},

	// Top Cards Section
	topCardsContainer: {
		padding: 20,
		maxWidth: 600, // Max width for tablets
		alignSelf: "center",
		width: "100%",
	},
	cardsRow: {
		flexDirection: "row",
		gap: 16,
		height: Math.min(SCREEN_HEIGHT * 0.35, 300), // 35% of screen height, max 300
		minHeight: 240, // Minimum height for small devices
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
		justifyContent: "space-between",
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
		fontSize: Math.min(SCREEN_WIDTH * 0.16, 52), // Scale with screen, max 60
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
	arrowText: {
		fontSize: 24,
		color: colors.cardBackground,
		fontWeight: "600",
	},

	// Action Cards Column
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
	iconText: {
		fontSize: 22,
		color: colors.cardBackground,
		fontWeight: "600",
	},
	actionCardText: {
		fontSize: 18,
		fontWeight: "600",
		color: colors.cardBackground,
		lineHeight: 22,
	},

	// Transactions Section
	transactionsContainer: {
		backgroundColor: colors.cardBackground,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 100, // Space for bottom navigation
		marginTop: 12,
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
	dateSummary: {
		fontSize: 14,
		fontWeight: "400",
		color: colors.textSecondary,
		opacity: 0.6,
	},
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
		gap: 16,
		flex: 1,
	},
	transactionIcon: {
		width: 40,
		height: 40,
		borderRadius: 10,
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
		marginBottom: 2,
	},
	transactionTime: {
		fontSize: 13,
		color: colors.textSecondary,
		opacity: 0.6,
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.textPrimary,
	},

	// Bottom Navigation
	bottomNav: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: colors.cardBackground,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 28,
		shadowColor: colors.shadowMedium,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 1,
		shadowRadius: 24,
		elevation: 8,
	},
	navItem: {
		alignItems: "center",
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	navIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	navIconActive: {
		backgroundColor: colors.navActive,
	},
	navLabel: {
		fontSize: 12,
		fontWeight: "500",
	},
	navLabelActive: {
		color: colors.navActive,
		fontWeight: "600",
	},
	navLabelInactive: {
		color: colors.navInactive,
	},
});
export default LandingPage;
