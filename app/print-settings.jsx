//----------------------------------- IMPORTS -----------------------------------//

import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/config";
import { colors } from "../constants/colors";
import SettingRow from "./components/printSettings/SettingRow";

//----------------------------------- CONSTANTS -----------------------------------//

const API_BASE_URL = config.apiBaseUrl;
const hardCodedHash = "sakjdsajdhashjsfkdjfjskahfjas";

const PAGE_RANGE_REGEX = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;

const isValidAdvancedRange = (value) => {
	if (!value || !PAGE_RANGE_REGEX.test(value.trim())) return false;
	const segments = value.trim().split(/,\s*/);
	for (const seg of segments) {
		if (seg.includes("-")) {
			const [a, b] = seg.split("-").map(Number);
			if (a < 1 || b < a) return false;
		} else {
			if (Number(seg) < 1) return false;
		}
	}
	return true;
};

//----------------------------------- COMPONENTS -----------------------------------//

const PrintSettings = () => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// State for print settings
	const [colorMode, setColorMode] = useState(null);
	const [orientation, setOrientation] = useState(null);
	const [sidedness, setSidedness] = useState(null);
	const [pageSize, setPageSize] = useState(null);
	//state for range
	const [pageRange, setPageRange] = useState("all");
	const [startPage, setStartPage] = useState("");
	const [endPage, setEndPage] = useState("");
	const [advancedMode, setAdvancedMode] = useState(false);
	const [advancedRange, setAdvancedRange] = useState("");
	const [isAdvancedRangeValid, setIsAdvancedRangeValid] = useState(false);

	const [pagesPerSheet, setPagesPerSheet] = useState(1);
	const [showPagesPerSheetDropdown, setShowPagesPerSheetDropdown] = useState(false);
	const [numberOfCopies, setNumberOfCopies] = useState("1");

	const { shopId, documents: documentsParam, numberOfDocuments: numberOfDocumentsParam } = params;

	let parsedDocuments = [];
	try {
		parsedDocuments = JSON.parse(documentsParam || "[]");
	} catch (e) {
		console.error("Failed to parse documents param:", e);
	}

	useEffect(() => {
		if (!shopId) {
			// if (!shopId || parsedDocuments.length === 0) {
			Alert.alert("Error", "Missing required document information.");
			router.back();
		}
	}, [router, shopId, parsedDocuments.length]);

	const handlePageRangeChange = (value) => {
		setPageRange(value);
		if (value === "custom") {
			Alert.alert("Dear User, Ensure Valid Range", "Otherwise the printer would proceed with printing the entire document.");
			return;
		}
		setStartPage("");
		setEndPage("");
		setAdvancedMode(false);
		setAdvancedRange("");
		setIsAdvancedRangeValid(false);
	};

	const handleAdvancedRangeChange = (value) => {
		setAdvancedRange(value);
		setIsAdvancedRangeValid(isValidAdvancedRange(value));
	};

	const toggleAdvancedMode = () => {
		setAdvancedMode((prev) => !prev);
		setAdvancedRange("");
		setIsAdvancedRangeValid(false);
		setStartPage("");
		setEndPage("");
	};

	// Determine if submit should be disabled
	const isSubmitDisabled = () => {
		if (loading) return true;
		if (pageRange === "custom") {
			if (advancedMode) return !isAdvancedRangeValid;
			return !startPage || startPage.trim() === "";
		}
		return false;
	};

	// Build pageSelection string from current state
	const getPageSelection = () => {
		if (pageRange === "all") return "";
		if (advancedMode) return advancedRange.trim();
		// Simple mode: start page required, end page optional
		const start = startPage.trim();
		const end = endPage.trim();
		if (end) return `${start}-${end}`;
		return `${start}-`;
	};

	const validatePageRange = () => {
		if (pageRange === "custom") {
			if (advancedMode) {
				if (!isAdvancedRangeValid) {
					Alert.alert("Invalid Range", "Please enter a valid page range (e.g. 1,3,16-20,25).");
					return false;
				}
				return true;
			}

			const start = parseInt(startPage);

			if (!startPage) {
				Alert.alert("Invalid Range", "Please enter a start page number.");
				return false;
			}

			if (isNaN(start) || start < 1) {
				Alert.alert("Invalid Range", "Start page must be at least 1.");
				return false;
			}

			if (endPage) {
				const end = parseInt(endPage);
				if (isNaN(end)) {
					Alert.alert("Invalid Range", "Please enter a valid end page number.");
					return false;
				}
				if (start > end) {
					Alert.alert("Invalid Range", "Start page cannot be greater than end page.");
					return false;
				}
			}
		}
		return true;
	};

	const handleSubmit = async () => {
		Alert.alert("Submit", "Ready to proceed?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Yes",
				onPress: async () => {
					createPrintJob();
				},
			},
		]);
	};

	const createPrintJob = async () => {
		const token = await SecureStore.getItemAsync("authToken");
		if (!colorMode || !orientation || !sidedness || !pageRange || !numberOfCopies || !pageSize) {
			Alert.alert("Incomplete Settings", "Please select all print settings.");
			return;
		}
		if (!validatePageRange()) {
			return;
		}

		const copies = parseInt(numberOfCopies);
		if (isNaN(copies) || copies < 1) {
			Alert.alert("Invalid Copies", "Number of copies must be at least 1.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const pageSelection = getPageSelection();
			const numDocs = parseInt(numberOfDocumentsParam) || parsedDocuments.length || 1;

			// Build files array with hardcoded hash for each document
			const files = Array.from({ length: numDocs }, () => ({
				hash: hardCodedHash,
				settings: {
					pageType: pageSize.toUpperCase(),
					color: colorMode === "color",
					pageSelection: pageSelection,
					orientation: orientation,
					sidedness: sidedness,
					pagesPerSheet: pagesPerSheet,
					numberOfCopies: copies,
				},
			}));

			const body = {
				forShop: shopId,
				files: files,
			};

			// LOG
			console.log("Submitting print job with the following data:", JSON.stringify(body, null, 2));

			const response = await fetch(`${API_BASE_URL}/newJob`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			let data;
			try {
				data = await response.json();
			} catch (jsonError) {
				console.log(jsonError);
				throw new Error(`Server returned invalid response: ${response.status}`);
			}
			if (!response.ok) {
				throw new Error(data.message || `Server error: ${response.status}`);
			}

			console.log("Job created successfully:", data);

			Alert.alert("Success", "Print job created successfully!", [
				{
					text: "OK",
					onPress: () => router.push("/"),
				},
			]);
		} catch (err) {
			console.error("Error submitting print settings:", err);
			setError(err.message);
			Alert.alert("Error", "Failed to create print job. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const handleCopiesChange = (delta) => {
		const currentCopies = parseInt(numberOfCopies) || 1;
		const newCopies = Math.max(1, currentCopies + delta);
		setNumberOfCopies(newCopies.toString());
	};

	//----------------------------------- RENDER -----------------------------------//

	return (
		<SafeAreaView
			style={styles.container}
			edges={["top"]}>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.background}
			/>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}>
					<Feather
						name="arrow-left"
						size={24}
						color={colors.textPrimary}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Print Settings</Text>
				<View style={styles.placeholder} />
			</View>

			<KeyboardAvoidingView
				style={styles.keyboardAvoidingView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled">
					<View style={styles.summaryCard}>
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Documents ({numberOfDocumentsParam})</Text>
							{parsedDocuments.map((doc, i) => (
								<Text
									key={i}
									style={styles.summaryValue}>
									{doc.name}
								</Text>
							))}
						</View>
						<View style={styles.summaryDivider} />
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Total Size</Text>
							<Text style={styles.summaryValue}>{(parsedDocuments.reduce((sum, d) => sum + (d.size || 0), 0) / 1024).toFixed(2)} KB</Text>
						</View>
					</View>

					<View style={styles.settingsSection}>
						<Text style={styles.sectionTitle}>Print Settings</Text>

						{/* Color Mode */}
						<SettingRow
							label="Color Mode"
							options={[
								{ label: "Color", value: "color" },
								{ label: "B&W", value: "bw" },
							]}
							selectedValue={colorMode}
							onSelect={setColorMode}
						/>

						{/* Orientation */}
						<SettingRow
							label="Orientation"
							options={[
								{ label: "Portrait", value: "portrait" },
								{ label: "Landscape", value: "landscape" },
							]}
							selectedValue={orientation}
							onSelect={setOrientation}
						/>

						{/* Sidedness */}
						<SettingRow
							label="Sidedness"
							options={[
								{ label: "Single", value: "single" },
								{ label: "Double", value: "double" },
							]}
							selectedValue={sidedness}
							onSelect={setSidedness}
						/>

						{/* Page Size */}
						<SettingRow
							label="Page Size"
							options={[
								{ label: "A4", value: "a4" },
								{ label: "Letter", value: "letter" },
							]}
							selectedValue={pageSize}
							onSelect={setPageSize}
						/>

						{/* Page Range */}
						<View style={styles.settingRow}>
							<Text style={styles.settingLabel}>Page Range</Text>
							<View style={styles.buttonsContainer}>
								<TouchableOpacity
									style={[styles.optionButton, pageRange === "all" && styles.optionButtonActive]}
									onPress={() => handlePageRangeChange("all")}>
									<Text style={[styles.optionButtonText, pageRange === "all" && styles.optionButtonTextActive]}>All</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.optionButton, pageRange === "custom" && styles.optionButtonActive]}
									onPress={() => handlePageRangeChange("custom")}>
									<Text style={[styles.optionButtonText, pageRange === "custom" && styles.optionButtonTextActive]}>Custom</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Advanced Range Toggle + Custom Inputs */}
						{pageRange === "custom" && (
							<View style={styles.customRangeContainer}>
								{/* Advanced Range Toggle Button */}
								<TouchableOpacity
									style={[styles.advancedToggleButton, advancedMode && styles.advancedToggleButtonActive]}
									onPress={toggleAdvancedMode}>
									<Feather
										name={advancedMode ? "list" : "edit-3"}
										size={16}
										color={advancedMode ? colors.cardBackground : colors.printRequest}
									/>
									<Text style={[styles.advancedToggleText, advancedMode && styles.advancedToggleTextActive]}>{advancedMode ? "Simple Range" : "Advanced Range"}</Text>
								</TouchableOpacity>

								{advancedMode ? (
									/* Advanced Range Text Input */
									<View>
										<Text style={styles.pageInputLabel}>Page Range</Text>
										<TextInput
											style={[styles.advancedRangeInput, advancedRange.length > 0 && (isAdvancedRangeValid ? styles.advancedRangeInputValid : styles.advancedRangeInputInvalid)]}
											placeholder="e.g. 1,3,16-20,25"
											placeholderTextColor={colors.textSecondary}
											value={advancedRange}
											onChangeText={handleAdvancedRangeChange}
											autoCapitalize="none"
											returnKeyType="done"
										/>
										{advancedRange.length > 0 && !isAdvancedRangeValid && <Text style={styles.advancedRangeHint}>Use commas and dashes, e.g. 1,3,16-20,25</Text>}
									</View>
								) : (
									/* Simple Start/End Page Inputs */
									<View style={styles.pageInputRow}>
										<View style={styles.pageInputGroup}>
											<Text style={styles.pageInputLabel}>Start Page *</Text>
											<TextInput
												style={styles.pageInput}
												keyboardType="number-pad"
												placeholder="1"
												placeholderTextColor={colors.textSecondary}
												value={startPage}
												onChangeText={setStartPage}
												maxLength={4}
												returnKeyType="next"
											/>
										</View>

										<Text style={styles.pageRangeSeparator}>to</Text>

										<View style={styles.pageInputGroup}>
											<Text style={styles.pageInputLabel}>End Page (optional)</Text>
											<TextInput
												style={styles.pageInput}
												keyboardType="number-pad"
												placeholder="End"
												placeholderTextColor={colors.textSecondary}
												value={endPage}
												onChangeText={setEndPage}
												maxLength={4}
												returnKeyType="done"
											/>
										</View>
									</View>
								)}
							</View>
						)}

						{/* Pages Per Sheet */}
						<View style={styles.settingRow}>
							<Text style={styles.settingLabel}>Pages per Sheet</Text>
							<TouchableOpacity
								style={styles.dropdownButton}
								onPress={() => setShowPagesPerSheetDropdown(true)}>
								<Text style={styles.dropdownButtonText}>{pagesPerSheet}</Text>
								<Feather
									name="chevron-down"
									size={18}
									color={colors.textPrimary}
								/>
							</TouchableOpacity>
						</View>

						{/* Pages Per Sheet Dropdown Modal */}
						<Modal
							visible={showPagesPerSheetDropdown}
							transparent
							animationType="fade"
							onRequestClose={() => setShowPagesPerSheetDropdown(false)}>
							<TouchableOpacity
								style={styles.modalOverlay}
								activeOpacity={1}
								onPress={() => setShowPagesPerSheetDropdown(false)}>
								<View style={styles.dropdownModal}>
									<Text style={styles.dropdownModalTitle}>Pages per Sheet</Text>
									{[1, 2, 4, 6, 9, 16].map((num) => (
										<TouchableOpacity
											key={num}
											style={[styles.dropdownOption, pagesPerSheet === num && styles.dropdownOptionActive]}
											onPress={() => {
												setPagesPerSheet(num);
												setShowPagesPerSheetDropdown(false);
											}}>
											<Text style={[styles.dropdownOptionText, pagesPerSheet === num && styles.dropdownOptionTextActive]}>{num}</Text>
											{pagesPerSheet === num && (
												<Feather
													name="check"
													size={18}
													color={colors.printRequest}
												/>
											)}
										</TouchableOpacity>
									))}
								</View>
							</TouchableOpacity>
						</Modal>

						{/* Number of Copies */}
						<View style={styles.settingRow}>
							<Text style={styles.settingLabel}>Number of Copies</Text>
							<View style={styles.copiesContainer}>
								<TouchableOpacity
									style={styles.copiesButton}
									onPress={() => handleCopiesChange(-1)}>
									<Feather
										name="minus"
										size={20}
										color={colors.textPrimary}
									/>
								</TouchableOpacity>
								<Text style={styles.copiesValue}>{numberOfCopies}</Text>
								<TouchableOpacity
									style={styles.copiesButton}
									onPress={() => handleCopiesChange(1)}>
									<Feather
										name="plus"
										size={20}
										color={colors.textPrimary}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{error && (
						<View style={styles.errorBox}>
							<Feather
								name="alert-circle"
								size={18}
								color={colors.printRequest}
							/>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}
				</ScrollView>

				<View style={styles.footer}>
					<TouchableOpacity
						style={[styles.submitButton, isSubmitDisabled() && styles.submitButtonDisabled]}
						onPress={handleSubmit}
						disabled={isSubmitDisabled()}>
						{loading ? (
							<ActivityIndicator
								size="small"
								color={colors.cardBackground}
							/>
						) : (
							<>
								<Text style={styles.submitButtonText}>Create Print Job</Text>
								<Feather
									name="arrow-right"
									size={20}
									color={colors.cardBackground}
								/>
							</>
						)}
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

//----------------------------------- STYLES -----------------------------------//

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: colors.cardBackground,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	placeholder: {
		width: 40,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		backgroundColor: colors.cardBackground,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 140,
	},
	summaryCard: {
		backgroundColor: colors.background,
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.borderLight,
		marginBottom: 28,
	},
	summaryItem: {
		paddingVertical: 8,
	},
	summaryLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.textSecondary,
		marginBottom: 4,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	summaryDivider: {
		height: 1,
		backgroundColor: colors.borderLight,
		marginVertical: 12,
	},
	settingsSection: {
		marginBottom: 28,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.textPrimary,
		marginBottom: 20,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	settingLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: colors.textPrimary,
		flex: 0.4,
	},
	buttonsContainer: {
		flexDirection: "row",
		gap: 12,
		flex: 0.6,
		justifyContent: "flex-start",
	},
	optionButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: colors.navInactive,
		backgroundColor: colors.cardBackground,
		flex: 1,
	},
	optionButtonActive: {
		backgroundColor: colors.printRequest,
		borderColor: colors.printRequest,
	},
	optionButtonText: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.navInactive,
		textAlign: "center",
	},
	optionButtonTextActive: {
		color: colors.cardBackground,
	},
	customRangeContainer: {
		backgroundColor: colors.background,
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: colors.borderLight,
	},
	advancedToggleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: colors.printRequest,
		backgroundColor: colors.cardBackground,
		marginBottom: 16,
		gap: 8,
	},
	advancedToggleButtonActive: {
		backgroundColor: colors.printRequest,
		borderColor: colors.printRequest,
	},
	advancedToggleText: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.printRequest,
	},
	advancedToggleTextActive: {
		color: colors.cardBackground,
	},
	advancedRangeInput: {
		borderWidth: 2,
		borderColor: colors.borderLight,
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
		backgroundColor: colors.cardBackground,
	},
	advancedRangeInputValid: {
		borderColor: "#2ECC71",
	},
	advancedRangeInputInvalid: {
		borderColor: "#E74C3C",
	},
	advancedRangeHint: {
		fontSize: 11,
		color: "#E74C3C",
		marginTop: 6,
		fontWeight: "500",
	},
	pageInputRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	pageInputGroup: {
		flex: 1,
	},
	pageInputLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.textSecondary,
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	pageInput: {
		borderWidth: 1.5,
		borderColor: colors.borderLight,
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
		backgroundColor: colors.cardBackground,
	},
	pageRangeSeparator: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textSecondary,
		paddingHorizontal: 12,
		marginTop: 20,
	},
	dropdownButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: colors.borderLight,
		backgroundColor: colors.background,
		minWidth: 100,
		gap: 8,
	},
	dropdownButtonText: {
		fontSize: 15,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	dropdownModal: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		paddingVertical: 8,
		width: "75%",
		maxWidth: 300,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 24,
		elevation: 12,
	},
	dropdownModalTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.textPrimary,
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	dropdownOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 14,
		paddingHorizontal: 20,
	},
	dropdownOptionActive: {
		backgroundColor: "rgba(255, 139, 123, 0.08)",
	},
	dropdownOptionText: {
		fontSize: 15,
		fontWeight: "500",
		color: colors.textPrimary,
	},
	dropdownOptionTextActive: {
		fontWeight: "700",
		color: colors.printRequest,
	},
	copiesContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flex: 0.6,
		justifyContent: "flex-end",
	},
	copiesButton: {
		width: 40,
		height: 40,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: colors.borderLight,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background,
	},
	copiesValue: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.textPrimary,
		minWidth: 30,
		textAlign: "center",
	},
	errorBox: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: "rgba(255, 139, 123, 0.1)",
		borderRadius: 12,
		padding: 12,
		marginTop: 16,
		gap: 12,
	},
	errorText: {
		fontSize: 13,
		color: colors.printRequest,
		flex: 1,
		lineHeight: 18,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: colors.cardBackground,
		padding: 20,
		paddingBottom: 28,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
		shadowColor: colors.shadowMedium,
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 8,
	},
	submitButton: {
		backgroundColor: colors.printRequest,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
		gap: 8,
	},
	submitButtonDisabled: {
		backgroundColor: colors.navInactive,
		opacity: 0.6,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.cardBackground,
	},
});
export default PrintSettings;
