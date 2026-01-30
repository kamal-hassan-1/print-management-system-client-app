import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/config";
import { colors } from "../constants/colors";

const API_BASE_URL = config.apiBaseUrl;

const PrintSettings = () => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// State for print settings
	const [colorMode, setColorMode] = useState(null);
	const [orientation, setOrientation] = useState(null);
	const [pageRange, setPageRange] = useState("all");
	const [numberOfCopies, setNumberOfCopies] = useState("1");
	const [sidedness, setSidedness] = useState(null);
	const [startPage, setStartPage] = useState("");
	const [endPage, setEndPage] = useState("");

	const { shopId, documentName, documentUri, documentSize, documentMimeType } = params;

	useEffect(() => {
		if (!shopId || !documentName || !documentUri) {
			Alert.alert("Error", "Missing required document information.");
			router.back();
		}
	}, [router, shopId, documentName, documentUri]);

	const handlePageRangeChange = (value) => {
		setPageRange(value);
		if (value === "custom") {
			Alert.alert("Dear User, Ensure Valid Range", "Otherwise the printer would proceed with printing the entire document.");
			return;
		}
		setStartPage("");
		setEndPage("");
	};

	const validatePageRange = () => {
		if (pageRange === "custom") {
			const start = parseInt(startPage);
			const end = parseInt(endPage);

			if (!startPage || !endPage) {
				Alert.alert("Invalid Range", "Please enter both start and end page numbers.");
				return false;
			}

			if (isNaN(start) || isNaN(end)) {
				Alert.alert("Invalid Range", "Please enter valid page numbers.");
				return false;
			}

			if (start < 1) {
				Alert.alert("Invalid Range", "Start page must be at least 1.");
				return false;
			}
			if (start > end) {
				Alert.alert("Invalid Range", "Start page cannot be greater than end page.");
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!colorMode || !orientation || !sidedness || !pageRange || !numberOfCopies) {
			Alert.alert("Incomplete Settings", "Please select all print settings.");
			return;
		}
		if (!validatePageRange()) {
			return;
		}

		// Bug fix: Validate numberOfCopies
		const copies = parseInt(numberOfCopies);
		if (isNaN(copies) || copies < 1) {
			Alert.alert("Invalid Copies", "Number of copies must be at least 1.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const form = new FormData();
			form.append("document", {
				uri: documentUri,
				name: documentName || "document.pdf",
				type: documentMimeType || "application/octet-stream",
			});
			form.append("shopId", shopId);
			form.append("colorMode", colorMode);
			form.append("orientation", orientation);
			form.append("pageRange", pageRange);

			if (pageRange === "custom") {
				form.append("startPage", parseInt(startPage));
				form.append("endPage", parseInt(endPage));
			}

			form.append("numberOfCopies", copies);
			form.append("sidedness", sidedness);

			console.log("Submitting print job");

			const response = await fetch(`${API_BASE_URL}/newJob`, {
				method: "POST",
				headers: {},
				body: form,
			});

			let data;
			try {
				data = await response.json();
			} catch (jsonError) {
				console.log(jsonError);
				throw new Error(`Server returned invalid response: ${response.status}`);
			}

			// Bug fix: Check response status
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

	const SettingRow = ({ label, options, selectedValue, onSelect }) => (
		<View style={styles.settingRow}>
			<Text style={styles.settingLabel}>{label}</Text>
			<View style={styles.buttonsContainer}>
				{options.map((option) => (
					<TouchableOpacity
						key={option.value}
						style={[styles.optionButton, selectedValue === option.value && styles.optionButtonActive]}
						onPress={() => onSelect(option.value)}>
						<Text style={[styles.optionButtonText, selectedValue === option.value && styles.optionButtonTextActive]}>{option.label}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

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
							<Text style={styles.summaryLabel}>Document</Text>
							<Text style={styles.summaryValue}>{documentName}</Text>
						</View>
						<View style={styles.summaryDivider} />
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>File Size</Text>
							<Text style={styles.summaryValue}>{((documentSize || 0) / 1024).toFixed(2)} KB</Text>
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
								{ label: "Single Sided", value: "single" },
								{ label: "Double Sided", value: "double" },
							]}
							selectedValue={sidedness}
							onSelect={setSidedness}
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

						{/* Custom Page Range Inputs */}
						{pageRange === "custom" && (
							<View style={styles.customRangeContainer}>
								<View style={styles.pageInputRow}>
									<View style={styles.pageInputGroup}>
										<Text style={styles.pageInputLabel}>Start Page</Text>
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
										<Text style={styles.pageInputLabel}>End Page</Text>
										<TextInput
											style={styles.pageInput}
											keyboardType="number-pad"
											placeholder="10"
											placeholderTextColor={colors.textSecondary}
											value={endPage}
											onChangeText={setEndPage}
											maxLength={4}
											returnKeyType="done"
										/>
									</View>
								</View>
							</View>
						)}

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
						style={[styles.submitButton, loading && styles.submitButtonDisabled]}
						onPress={handleSubmit}>
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
		justifyContent: "flex-end",
	},
	optionButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: colors.navInactive,
		backgroundColor: colors.cardBackground,
	},
	optionButtonActive: {
		backgroundColor: colors.printRequest,
		borderColor: colors.printRequest,
	},
	optionButtonText: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.navInactive,
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
