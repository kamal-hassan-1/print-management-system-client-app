import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

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
					{/* Current Balance Card */}
					<View style={styles.balanceCard}>
						<View style={styles.balanceContent}>
							<View>
								<Text style={styles.balanceLabel}>Current Balance</Text>
								<Text style={styles.balanceAmount}>Rs. 0</Text>
							</View>

							{/* Mastercard Logo and Arrow */}
							<View style={styles.balanceFooter}>
								<View style={styles.mastercardLogo}>
									<View style={[styles.mastercardCircle, { backgroundColor: colors.mastercardRed, zIndex: 2 }]} />
									<View style={[styles.mastercardCircle, { backgroundColor: colors.mastercardOrange, marginLeft: -18, zIndex: 1 }]} />
								</View>

								<TouchableOpacity style={styles.arrowButton}>
									<Text style={styles.arrowText}>→</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Action Cards Row */}
					<View style={styles.actionCardsRow}>
						{/* Credit Wallet Card */}
						<TouchableOpacity style={[styles.actionCard, styles.creditWalletCard]}>
							<View style={styles.actionCardIcon}>
								<Text style={styles.iconText}>↓</Text>
							</View>
							<Text style={styles.actionCardText}>Credit{"\n"}Wallet</Text>
						</TouchableOpacity>

						{/* New Print Request Card */}
						<TouchableOpacity style={[styles.actionCard, styles.printRequestCard]}>
							<View style={styles.actionCardIcon}>
								<Text style={styles.iconText}>↗</Text>
							</View>
							<Text style={styles.actionCardText}>New Print{"\n"}Request</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Transaction History */}
				<View style={styles.transactionsContainer}>
					{/* Dec 31, 2025 Section */}
					<View style={styles.dateSection}>
						<View style={styles.dateHeader}>
							<Text style={styles.dateText}>Dec 31, 2025</Text>
							<Text style={[styles.dateSummary, { color: colors.primary }]}>- Rs. 1,043</Text>
						</View>

						{/* Transaction 1 */}
						<TouchableOpacity style={styles.transactionCard}>
							<View style={styles.transactionLeft}>
								<View style={[styles.transactionIcon, { backgroundColor: colors.expenseBackground }]}>
									<Text style={{ color: colors.expense, fontSize: 20 }}>↗</Text>
								</View>
								<View>
									<Text style={styles.transactionName}>KAMAL HASSAN</Text>
									<Text style={styles.transactionTime}>3:57 PM</Text>
								</View>
							</View>
							<Text style={styles.transactionAmount}>Rs. 1,353</Text>
						</TouchableOpacity>

						{/* Transaction 2 */}
						<TouchableOpacity style={styles.transactionCard}>
							<View style={styles.transactionLeft}>
								<View style={[styles.transactionIcon, { backgroundColor: colors.incomeBackground }]}>
									<Text style={{ color: colors.income, fontSize: 20 }}>↙</Text>
								</View>
								<View>
									<Text style={styles.transactionName}>HAMZA</Text>
									<Text style={styles.transactionTime}>8:12 AM</Text>
								</View>
							</View>
							<Text style={[styles.transactionAmount, { color: colors.income }]}>+ Rs. 310</Text>
						</TouchableOpacity>
					</View>

					{/* Dec 26, 2025 Section */}
					<View style={styles.dateSection}>
						<View style={styles.dateHeader}>
							<Text style={styles.dateText}>Dec 26, 2025</Text>
							<Text style={[styles.dateSummary, { color: colors.income }]}>+ Rs. 1,043</Text>
						</View>

						{/* Transaction 3 */}
						<TouchableOpacity style={styles.transactionCard}>
							<View style={styles.transactionLeft}>
								<View style={[styles.transactionIcon, { backgroundColor: colors.merchantBackground }]}>
									<Text style={{ color: colors.merchantIcon, fontSize: 20 }}>🏪</Text>
								</View>
								<View style={styles.transactionInfo}>
									<Text style={styles.transactionName}>N And H Petroleum Pv</Text>
									<Text style={styles.transactionTime}>Islamabad Pak</Text>
									<Text style={styles.transactionTime}>2:50 PM</Text>
								</View>
							</View>
							<Text style={styles.transactionAmount}>Rs. 350</Text>
						</TouchableOpacity>

						{/* Transaction 4 */}
						<TouchableOpacity style={styles.transactionCard}>
							<View style={styles.transactionLeft}>
								<View style={[styles.transactionIcon, { backgroundColor: colors.merchantBackground }]}>
									<Text style={{ color: colors.merchantIcon, fontSize: 20 }}>🛒</Text>
								</View>
								<View>
									<Text style={styles.transactionName}>Mine Save Mart Islamabad Pak</Text>
									<Text style={styles.transactionTime}>3:43 PM</Text>
								</View>
							</View>
							<Text style={styles.transactionAmount}>Rs. 607</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* Bottom Navigation */}
			<View style={styles.bottomNav}>
				<TouchableOpacity style={styles.navItem}>
					<View style={[styles.navIconContainer, styles.navIconActive]}>
						<Text style={{ fontSize: 20 }}>🏠</Text>
					</View>
					<Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navItem}>
					<View style={styles.navIconContainer}>
						<Text style={{ fontSize: 20 }}>💳</Text>
					</View>
					<Text style={[styles.navLabel, styles.navLabelInactive]}>Payments</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navItem}>
					<View style={styles.navIconContainer}>
						<Text style={{ fontSize: 20 }}>⊞</Text>
					</View>
					<Text style={[styles.navLabel, styles.navLabelInactive]}>Scan QR</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.navItem}>
					<View style={styles.navIconContainer}>
						<Text style={{ fontSize: 20 }}>👤</Text>
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
		paddingBottom: 100,
	},

	// Top Cards Section
	topCardsContainer: {
		padding: 20,
	},
	balanceCard: {
		backgroundColor: colors.primary,
		borderRadius: 24,
		padding: 32,
		minHeight: 280,
		marginBottom: 16,
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
		fontSize: 64,
		fontWeight: "700",
		color: colors.cardBackground,
		letterSpacing: -2,
	},
	balanceFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	mastercardLogo: {
		flexDirection: "row",
		alignItems: "center",
	},
	mastercardCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
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

	// Action Cards
	actionCardsRow: {
		flexDirection: "row",
		gap: 16,
	},
	actionCard: {
		flex: 1,
		borderRadius: 24,
		padding: 28,
		minHeight: 180,
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
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: colors.cardOverlay,
		justifyContent: "center",
		alignItems: "center",
	},
	iconText: {
		fontSize: 24,
		color: colors.cardBackground,
		fontWeight: "600",
	},
	actionCardText: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.cardBackground,
		lineHeight: 28,
	},

	// Transactions Section
	transactionsContainer: {
		paddingHorizontal: 20,
		marginTop: 12,
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
		fontSize: 32,
		fontWeight: "700",
		color: colors.textPrimary,
		letterSpacing: -0.5,
	},
	dateSummary: {
		fontSize: 16,
		fontWeight: "500",
	},
	transactionCard: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 20,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: colors.shadowLight,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 2,
	},
	transactionLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		flex: 1,
	},
	transactionIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	transactionInfo: {
		flex: 1,
	},
	transactionName: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 4,
	},
	transactionTime: {
		fontSize: 14,
		color: colors.textSecondary,
		opacity: 0.7,
	},
	transactionAmount: {
		fontSize: 18,
		fontWeight: "600",
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
		paddingTop: 12,
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
