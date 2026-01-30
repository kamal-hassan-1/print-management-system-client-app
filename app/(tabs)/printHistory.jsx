import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionList from "../../components/TransactionList";
import { colors } from "../../constants/colors";
import { mockTransactions } from "../../data/mockData";

const PrintHistory = () => {
	// Filter states
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [sortModalVisible, setSortModalVisible] = useState(false);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [sortBy, setSortBy] = useState("date"); // 'date', 'price', 'printSize'
	const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'

	// Filter and sort transactions
	const filteredAndSortedTransactions = useMemo(() => {
		let filtered = [...mockTransactions];

		// Filter by date range
		if (dateFrom) {
			filtered = filtered.filter((t) => new Date(t.date) >= new Date(dateFrom));
		}
		if (dateTo) {
			filtered = filtered.filter((t) => new Date(t.date) <= new Date(dateTo));
		}

		// Sort
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "date":
					comparison = new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
					break;
				case "price":
					comparison = a.amount - b.amount;
					break;
				case "printSize":
					comparison = a.printSize.localeCompare(b.printSize);
					break;
				default:
					comparison = 0;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return filtered;
	}, [dateFrom, dateTo, sortBy, sortOrder]);

	const handleTransactionPress = (transaction) => {
		console.log("Transaction pressed:", transaction);
		// Navigate to transaction details if needed
	};

	const clearFilters = () => {
		setDateFrom("");
		setDateTo("");
		setSortBy("date");
		setSortOrder("desc");
	};

	const activeFiltersCount = () => {
		let count = 0;
		if (dateFrom || dateTo) count++;
		return count;
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={["top"]}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.background}
			/>

			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Print History</Text>
			</View>

			{/* Filter and Sort Bar */}
			<View style={styles.filterBar}>
				<TouchableOpacity
					style={styles.filterButton}
					onPress={() => setFilterModalVisible(true)}>
					<Feather
						name="filter"
						size={18}
						color={colors.textPrimary}
					/>
					<Text style={styles.filterButtonText}>Filter</Text>
					{activeFiltersCount() > 0 && (
						<View style={styles.filterBadge}>
							<Text style={styles.filterBadgeText}>{activeFiltersCount()}</Text>
						</View>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.filterButton}
					onPress={() => setSortModalVisible(true)}>
					<Feather
						name="arrow-up-right"
						size={18}
						color={colors.textPrimary}
					/>
					<Text style={styles.filterButtonText}>Sort</Text>
				</TouchableOpacity>

				{activeFiltersCount() > 0 && (
					<TouchableOpacity
						style={styles.clearButton}
						onPress={clearFilters}>
						<Text style={styles.clearButtonText}>Clear</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Transaction List */}
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				<TransactionList
					transactions={filteredAndSortedTransactions}
					onTransactionPress={handleTransactionPress}
				/>
			</ScrollView>

			{/* Filter Modal */}
			<Modal
				visible={filterModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setFilterModalVisible(false)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Filter Transactions</Text>
							<TouchableOpacity onPress={() => setFilterModalVisible(false)}>
								<Feather
									name="x"
									size={24}
									color={colors.textPrimary}
								/>
							</TouchableOpacity>
						</View>

						{/* Date Range Filter */}
						<View style={styles.filterSection}>
							<Text style={styles.filterLabel}>Date Range</Text>
							<View style={styles.dateInputs}>
								<View style={styles.dateInputWrapper}>
									<Text style={styles.dateInputLabel}>From</Text>
									<TextInput
										style={styles.dateInput}
										placeholder="YYYY-MM-DD"
										value={dateFrom}
										onChangeText={setDateFrom}
										placeholderTextColor={colors.textSecondary}
									/>
								</View>
								<View style={styles.dateInputWrapper}>
									<Text style={styles.dateInputLabel}>To</Text>
									<TextInput
										style={styles.dateInput}
										placeholder="YYYY-MM-DD"
										value={dateTo}
										onChangeText={setDateTo}
										placeholderTextColor={colors.textSecondary}
									/>
								</View>
							</View>
						</View>

						{/* Apply Button */}
						<TouchableOpacity
							style={styles.applyButton}
							onPress={() => setFilterModalVisible(false)}>
							<Text style={styles.applyButtonText}>Apply Filters</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Sort Modal */}
			<Modal
				visible={sortModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setSortModalVisible(false)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Sort By</Text>
							<TouchableOpacity onPress={() => setSortModalVisible(false)}>
								<Feather
									name="x"
									size={24}
									color={colors.textPrimary}
								/>
							</TouchableOpacity>
						</View>

						{/* Sort Options */}
						<TouchableOpacity
							style={styles.sortOption}
							onPress={() => {
								setSortBy("date");
								setSortOrder(sortBy === "date" && sortOrder === "desc" ? "asc" : "desc");
							}}>
							<View style={styles.sortOptionLeft}>
								<Feather
									name="calendar"
									size={20}
									color={colors.textPrimary}
								/>
								<Text style={styles.sortOptionText}>Date & Time</Text>
							</View>
							{sortBy === "date" && (
								<Feather
									name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
									size={20}
									color={colors.primary}
								/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.sortOption}
							onPress={() => {
								setSortBy("price");
								setSortOrder(sortBy === "price" && sortOrder === "desc" ? "asc" : "desc");
							}}>
							<View style={styles.sortOptionLeft}>
								<Feather
									name="dollar-sign"
									size={20}
									color={colors.textPrimary}
								/>
								<Text style={styles.sortOptionText}>Price</Text>
							</View>
							{sortBy === "price" && (
								<Feather
									name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
									size={20}
									color={colors.primary}
								/>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.sortOption}
							onPress={() => {
								setSortBy("printSize");
								setSortOrder(sortBy === "printSize" && sortOrder === "desc" ? "asc" : "desc");
							}}>
							<View style={styles.sortOptionLeft}>
								<Feather
									name="file"
									size={20}
									color={colors.textPrimary}
								/>
								<Text style={styles.sortOptionText}>Print Size</Text>
							</View>
							{sortBy === "printSize" && (
								<Feather
									name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
									size={20}
									color={colors.primary}
								/>
							)}
						</TouchableOpacity>

						{/* Apply Button */}
						<TouchableOpacity
							style={styles.applyButton}
							onPress={() => setSortModalVisible(false)}>
							<Text style={styles.applyButtonText}>Apply</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.cardBackground,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	filterBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: colors.cardBackground,
		gap: 12,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: colors.background,
		borderRadius: 20,
		gap: 6,
	},
	filterButtonText: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.textPrimary,
	},
	filterBadge: {
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 4,
	},
	filterBadgeText: {
		fontSize: 10,
		fontWeight: "700",
		color: colors.cardBackground,
	},
	clearButton: {
		marginLeft: "auto",
	},
	clearButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.expense,
	},
	scrollView: {
		flex: 1,
		backgroundColor: colors.cardBackground,
	},
	scrollContent: {
		padding: 20,
	},

	// Modal Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: colors.cardBackground,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		maxHeight: "80%",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	filterSection: {
		marginBottom: 24,
	},
	filterLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 12,
	},
	dateInputs: {
		gap: 12,
	},
	dateInputWrapper: {
		gap: 8,
	},
	dateInputLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.textSecondary,
	},
	dateInput: {
		borderWidth: 1,
		borderColor: colors.borderLight,
		borderRadius: 12,
		padding: 12,
		fontSize: 14,
		color: colors.textPrimary,
	},
	applyButton: {
		backgroundColor: colors.primary,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 12,
	},
	applyButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.cardBackground,
	},
	sortOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	sortOptionLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	sortOptionText: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.textPrimary,
	},
});

export default PrintHistory;
