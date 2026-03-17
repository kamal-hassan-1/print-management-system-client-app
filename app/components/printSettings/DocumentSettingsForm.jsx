//----------------------------------- IMPORTS -----------------------------------//

import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import SettingRow from "./SettingRow";

//----------------------------------- CONSTANTS -----------------------------------//

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

//----------------------------------- COMPONENT -----------------------------------//

const DocumentSettingsForm = ({ documentName, documentNumber, totalDocuments, settings, onSettingsChange, onSubmitAll, onMoveNext, onCreateJob, loading, error }) => {
	const [pageRange, setPageRange] = useState(settings.pageSelection ? "custom" : "all");
	const [startPage, setStartPage] = useState("");
	const [endPage, setEndPage] = useState("");
	const [advancedMode, setAdvancedMode] = useState(false);
	const [advancedRange, setAdvancedRange] = useState("");
	const [isAdvancedRangeValid, setIsAdvancedRangeValid] = useState(false);
	const [showPagesPerSheetDropdown, setShowPagesPerSheetDropdown] = useState(false);

	const colorMode = settings.color;
	const orientation = settings.orientation;
	const sidedness = settings.sidedness;
	const pageSize = settings.pageType;
	const pagesPerSheet = settings.pagesPerSheet;
	const numberOfCopies = settings.numberOfCopies;

	//----------------------------------- HANDLERS -----------------------------------//

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
		onSettingsChange("pageSelection", "");
	};

	const handleAdvancedRangeChange = (value) => {
		setAdvancedRange(value);
		const valid = isValidAdvancedRange(value);
		setIsAdvancedRangeValid(valid);
		if (valid) {
			onSettingsChange("pageSelection", value.trim());
		}
	};

	const toggleAdvancedMode = () => {
		setAdvancedMode((prev) => !prev);
		setAdvancedRange("");
		setIsAdvancedRangeValid(false);
		setStartPage("");
		setEndPage("");
		onSettingsChange("pageSelection", "");
	};

	const handleStartPageChange = (value) => {
		setStartPage(value);
		updateSimplePageSelection(value, endPage);
	};

	const handleEndPageChange = (value) => {
		setEndPage(value);
		updateSimplePageSelection(startPage, value);
	};

	const updateSimplePageSelection = (start, end) => {
		const s = start.trim();
		const e = end.trim();
		if (!s) {
			onSettingsChange("pageSelection", "");
			return;
		}
		if (e) {
			onSettingsChange("pageSelection", `${s}-${e}`);
		} else {
			onSettingsChange("pageSelection", `${s}-`);
		}
	};

	const handleCopiesChange = (delta) => {
		const currentCopies = parseInt(numberOfCopies) || 1;
		const newCopies = Math.max(1, currentCopies + delta);
		onSettingsChange("numberOfCopies", newCopies.toString());
	};

	const isActionDisabled = () => {
		if (loading) return true;
		if (pageRange === "custom") {
			if (advancedMode) return !isAdvancedRangeValid;
			return !startPage || startPage.trim() === "";
		}
		if (!colorMode || !orientation || !sidedness || !pageRange || !numberOfCopies || !pageSize) {
			return true;
		}
		return false;
	};

	//----------------------------------- BUTTON LOGIC -----------------------------------//

	const isFirstDoc = documentNumber === 1;
	const isLastDoc = documentNumber === totalDocuments;
	const isSingleDoc = totalDocuments === 1;

	//----------------------------------- RENDER -----------------------------------//

	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingView}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				{/* Summary Card */}
				<View style={styles.summaryCard}>
					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>Document: </Text>
						<Text style={styles.summaryValue}>[ {documentName.split(" ").slice(0, 2).join(" ").slice(0, 20)} ... ]</Text>
					</View>
					<View style={styles.summaryDivider} />
					<View style={styles.summaryItem}>
						<Text style={styles.summaryLabel}>No. of Document: </Text>
						<Text style={styles.summaryValue}>
							{documentNumber}/{totalDocuments}
						</Text>
					</View>
				</View>

				<View style={styles.settingsSection}>
					{/* Color Mode */}
					<SettingRow
						label="Color Mode"
						options={[
							{ label: "Color", value: "color" },
							{ label: "B&W", value: "bw" },
						]}
						selectedValue={colorMode}
						onSelect={(val) => onSettingsChange("color", val)}
					/>

					{/* Orientation */}
					<SettingRow
						label="Orientation"
						options={[
							{ label: "Portrait", value: "portrait" },
							{ label: "Landscape", value: "landscape" },
						]}
						selectedValue={orientation}
						onSelect={(val) => onSettingsChange("orientation", val)}
					/>

					{/* Sidedness */}
					<SettingRow
						label="Sidedness"
						options={[
							{ label: "Single", value: "single" },
							{ label: "Double", value: "double" },
						]}
						selectedValue={sidedness}
						onSelect={(val) => onSettingsChange("sidedness", val)}
					/>

					{/* Page Size */}
					<SettingRow
						label="Page Size"
						options={[
							{ label: "A4", value: "a4" },
							{ label: "Letter", value: "letter" },
						]}
						selectedValue={pageSize}
						onSelect={(val) => onSettingsChange("pageType", val)}
					/>

					{/* Page Range */}
					<View style={styles.settingRow}>
						<Text style={styles.settingLabel}>Page Range</Text>
						<View style={styles.buttonsContainer}>
							<TouchableOpacity
								style={[styles.optionButton, pageRange === "all" && styles.optionButtonActive]}
								onPress={() => handlePageRangeChange("all")}
							>
								<Text style={[styles.optionButtonText, pageRange === "all" && styles.optionButtonTextActive]}>All</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.optionButton, pageRange === "custom" && styles.optionButtonActive]}
								onPress={() => handlePageRangeChange("custom")}
							>
								<Text style={[styles.optionButtonText, pageRange === "custom" && styles.optionButtonTextActive]}>Custom</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Adv Range Toggle*/}
					{pageRange === "custom" && (
						<View style={styles.customRangeContainer}>
							{/* Adv Range Toggle Button */}
							<TouchableOpacity
								style={[styles.advancedToggleButton, advancedMode && styles.advancedToggleButtonActive]}
								onPress={toggleAdvancedMode}
							>
								<Feather
									name={advancedMode ? "list" : "edit-3"}
									size={16}
									color={advancedMode ? colors.cardBackground : colors.printRequest}
								/>
								<Text style={[styles.advancedToggleText, advancedMode && styles.advancedToggleTextActive]}>
									{advancedMode ? "Simple Range" : "Advanced Range"}
								</Text>
							</TouchableOpacity>

							{advancedMode ? (
								/* Adv Range Input */
								<View>
									<Text style={styles.pageInputLabel}>Page Range</Text>
									<TextInput
										style={[
											styles.advancedRangeInput,
											advancedRange.length > 0 &&
												(isAdvancedRangeValid
													? styles.advancedRangeInputValid
													: styles.advancedRangeInputInvalid),
										]}
										placeholder="e.g. 1,3,16-20,25"
										placeholderTextColor={colors.textSecondary}
										value={advancedRange}
										onChangeText={handleAdvancedRangeChange}
										autoCapitalize="none"
										returnKeyType="done"
									/>
									{advancedRange.length > 0 && !isAdvancedRangeValid && (
										<Text style={styles.advancedRangeHint}>Use commas and dashes, e.g. 1,3,16-20,25</Text>
									)}
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
											onChangeText={handleStartPageChange}
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
											onChangeText={handleEndPageChange}
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
						<TouchableOpacity style={styles.dropdownButton} onPress={() => setShowPagesPerSheetDropdown(true)}>
							<Text style={styles.dropdownButtonText}>{pagesPerSheet}</Text>
							<Feather name="chevron-down" size={18} color={colors.textPrimary} />
						</TouchableOpacity>
					</View>

					<Modal visible={showPagesPerSheetDropdown} transparent animationType="fade" onRequestClose={() => setShowPagesPerSheetDropdown(false)}>
						<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPagesPerSheetDropdown(false)}>
							<View style={styles.dropdownModal}>
								<Text style={styles.dropdownModalTitle}>Pages per Sheet</Text>
								{[1, 2, 4, 6, 9, 16].map((num) => (
									<TouchableOpacity
										key={num}
										style={[styles.dropdownOption, pagesPerSheet === num && styles.dropdownOptionActive]}
										onPress={() => {
											onSettingsChange("pagesPerSheet", num);
											setShowPagesPerSheetDropdown(false);
										}}
									>
										<Text style={[styles.dropdownOptionText, pagesPerSheet === num && styles.dropdownOptionTextActive]}>
											{num}
										</Text>
										{pagesPerSheet === num && <Feather name="check" size={18} color={colors.printRequest} />}
									</TouchableOpacity>
								))}
							</View>
						</TouchableOpacity>
					</Modal>

					{/* Number of Copies */}
					<View style={styles.settingRow}>
						<Text style={styles.settingLabel}>Number of Copies</Text>
						<View style={styles.copiesContainer}>
							<TouchableOpacity style={styles.copiesButton} onPress={() => handleCopiesChange(-1)}>
								<Feather name="minus" size={20} color={colors.textPrimary} />
							</TouchableOpacity>
							<Text style={styles.copiesValue}>{numberOfCopies}</Text>
							<TouchableOpacity style={styles.copiesButton} onPress={() => handleCopiesChange(1)}>
								<Feather name="plus" size={20} color={colors.textPrimary} />
							</TouchableOpacity>
						</View>
					</View>
				</View>

				{error && (
					<View style={styles.errorBox}>
						<Feather name="alert-circle" size={18} color={colors.printRequest} />
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}
			</ScrollView>

			{/* Footer Buttons */}
			<View style={styles.footer}>
				{/* First doc with multiple docs: "Submit All" + "Move on" */}
				{!isSingleDoc && isFirstDoc && (
					<>
						<TouchableOpacity
							style={[styles.submitButton, styles.submitAllButton, isActionDisabled() && styles.submitButtonDisabled]}
							onPress={onSubmitAll}
							disabled={isActionDisabled()}
						>
							{loading ? (
								<ActivityIndicator size="small" color={colors.cardBackground} />
							) : (
								<>
									<Text style={styles.submitButtonText}>Submit All with These Settings</Text>
									<Feather name="check-circle" size={20} color={colors.cardBackground} />
								</>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.submitButton, isActionDisabled() && styles.submitButtonDisabled]}
							onPress={onMoveNext}
							disabled={isActionDisabled()}
						>
							<Text style={styles.submitButtonText}>Move on to {documentNumber + 1} document</Text>
							<Feather name="arrow-right" size={20} color={colors.cardBackground} />
						</TouchableOpacity>
					</>
				)}

				{/* Middle docs: single "Move on" */}
				{!isSingleDoc && !isFirstDoc && !isLastDoc && (
					<TouchableOpacity
						style={[styles.submitButton, isActionDisabled() && styles.submitButtonDisabled]}
						onPress={onMoveNext}
						disabled={isActionDisabled()}
					>
						<Text style={styles.submitButtonText}>Move on to {documentNumber + 1} document</Text>
						<Feather name="arrow-right" size={20} color={colors.cardBackground} />
					</TouchableOpacity>
				)}

				{/* Last doc or single doc: "Create Print Job" */}
				{(isSingleDoc || isLastDoc) && (
					<TouchableOpacity
						style={[styles.submitButton, isActionDisabled() && styles.submitButtonDisabled]}
						onPress={onCreateJob}
						disabled={isActionDisabled()}
					>
						{loading ? (
							<ActivityIndicator size="small" color={colors.cardBackground} />
						) : (
							<>
								<Text style={styles.submitButtonText}>Create Print Job</Text>
								<Feather name="arrow-right" size={20} color={colors.cardBackground} />
							</>
						)}
					</TouchableOpacity>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};

//----------------------------------- STYLES -----------------------------------//

const styles = StyleSheet.create({
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
		borderRadius: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: colors.borderLight,
		marginBottom: 28,
	},
	summaryItem: {
		paddingVertical: 6,
		display: "flex",
		flexDirection: "row",
		gap: 4,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		fontSize: 12,
	},
	summaryLabel: {
		color: colors.textSecondary,
		fontWeight: "600",
	},
	summaryValue: {
		color: colors.textPrimary,
		fontWeight: "800",
	},
	summaryDivider: {
		height: 1,
		backgroundColor: colors.borderLight,
		marginVertical: 12,
	},
	settingsSection: {
		marginBottom: 28,
		marginTop: 4,
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
		gap: 10,
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
	submitAllButton: {
		backgroundColor: colors.primary,
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
export default DocumentSettingsForm;
