import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const UploadDocument = () => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [document, setDocument] = useState(null);
	const [documentName, setDocumentName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const shopId = params.shopId;
	useEffect(() => {
		if (!shopId) {
			Alert.alert("Error", "Shop ID not found. Please go back and select a shop.");
			router.back();
		}
	}, [router, shopId]);

	const handleDocumentPick = async () => {
		try {
			setError(null);
			setLoading(true);

			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "image/jpeg", "image/png", "image/jpg"],
				copyToCacheDirectory: true,
			});

			if (!result.canceled) {
				const file = result.assets[0];

				// Extract filename without extension for display
				const fileName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "Document";

				setDocument(file);
				setDocumentName(fileName);
				setError(null);
			}
		} catch (err) {
			console.error("Error picking document:", err);
			setError("Failed to pick document. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveDocument = () => {
		setDocument(null);
		setDocumentName("");
		setError(null);
	};

	const handleContinue = () => {
		if (!document) {
			Alert.alert("No Document", "Please upload a document to continue.");
			return;
		}
		if (!documentName.trim()) {
			Alert.alert("Invalid Name", "Please provide a document name.");
			return;
		}
		router.push({
			pathname: "/print-settings",
			params: {
				shopId: shopId,
				documentName: documentName.trim(),
				documentUri: document.uri,
				documentSize: document.size,
				documentMimeType: document.mimeType,
			},
		});
	};
	const isDocumentUploaded = !!document;

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
				<Text style={styles.headerTitle}>Upload Document</Text>
				<View style={styles.placeholder} />
			</View>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Document Upload</Text>
					<TouchableOpacity
						style={[styles.uploadArea, isDocumentUploaded && styles.uploadAreaFilled, error && styles.uploadAreaError]}
						onPress={handleDocumentPick}
						disabled={loading}>
						{loading ? (
							<>
								<ActivityIndicator
									size="large"
									color={colors.primary}
								/>
								<Text style={styles.uploadLoadingText}>Processing...</Text>
							</>
						) : isDocumentUploaded ? (
							<>
								<View style={styles.uploadedIconContainer}>
									<Feather
										name="check-circle"
										size={48}
										color={colors.primary}
									/>
								</View>
								<Text style={styles.uploadedText}>Document Uploaded</Text>
								<Text style={styles.uploadedFileName}>{document.name}</Text>
								<Text style={styles.uploadedFileSize}>({(document.size / 1024).toFixed(2)} KB)</Text>
							</>
						) : (
							<>
								<Feather
									name="upload-cloud"
									size={48}
									color={colors.primary}
								/>
								<Text style={styles.uploadText}>Upload Your Document</Text>
								<Text style={styles.uploadSubtext}>Tap to select PDF, Word, Excel, or Image files</Text>
							</>
						)}
					</TouchableOpacity>
					{isDocumentUploaded && (
						<TouchableOpacity
							style={styles.changeButton}
							onPress={handleDocumentPick}>
							<Feather
								name="refresh-cw"
								size={18}
								color={colors.textPrimary}
							/>
							<Text style={styles.changeButtonText}>Change Document</Text>
						</TouchableOpacity>
					)}
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
				</View>
				{isDocumentUploaded && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Document Name</Text>
						<Text style={styles.sectionDescription}>You can edit the document name, but it cannot be empty</Text>
						<View style={styles.nameInputContainer}>
							<TextInput
								style={styles.nameInput}
								placeholder="Enter document name"
								placeholderTextColor={colors.textSecondary}
								value={documentName}
								onChangeText={setDocumentName}
								editable={true}
							/>
							{documentName.trim() && (
								<TouchableOpacity
									onPress={() => setDocumentName("")}
									style={styles.clearButton}>
									<Feather
										name="x"
										size={20}
										color={colors.textSecondary}
									/>
								</TouchableOpacity>
							)}
						</View>
						{!documentName.trim() && (
							<Text style={styles.warningText}>
								<Feather
									name="info"
									size={14}
									color={colors.printRequest}
								/>{" "}
								Document name cannot be empty
							</Text>
						)}
					</View>
				)}
				{isDocumentUploaded && (
					<View style={styles.summaryCard}>
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Shop ID</Text>
							<Text style={styles.summaryValue}>{shopId}</Text>
						</View>
						<View style={styles.summaryDivider} />
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>Document Name</Text>
							<Text style={styles.summaryValue}>{documentName || "Not provided"}</Text>
						</View>
						<View style={styles.summaryDivider} />
						<View style={styles.summaryItem}>
							<Text style={styles.summaryLabel}>File</Text>
							<Text style={styles.summaryValue}>{document.name}</Text>
						</View>
					</View>
				)}
			</ScrollView>
			<View style={styles.footer}>
				<TouchableOpacity
					style={[styles.continueButton, (!isDocumentUploaded || !documentName.trim()) && styles.continueButtonDisabled]}
					onPress={handleContinue}
					disabled={!isDocumentUploaded || !documentName.trim()}>
					<Text style={styles.continueButtonText}>Continue</Text>
					<Feather
						name="arrow-right"
						size={20}
						color={colors.cardBackground}
					/>
				</TouchableOpacity>

				{isDocumentUploaded && documentName.trim() && (
					<TouchableOpacity
						style={styles.removeButton}
						onPress={handleRemoveDocument}>
						<Text style={styles.removeButtonText}>Remove Document</Text>
					</TouchableOpacity>
				)}
			</View>
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
	scrollView: {
		flex: 1,
		backgroundColor: colors.cardBackground,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 160,
	},
	section: {
		marginBottom: 28,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.textPrimary,
		marginBottom: 8,
	},
	sectionDescription: {
		fontSize: 13,
		color: colors.textSecondary,
		marginBottom: 16,
		lineHeight: 18,
	},
	uploadArea: {
		borderWidth: 2,
		borderColor: colors.borderLight,
		borderStyle: "dashed",
		borderRadius: 16,
		padding: 32,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background,
		minHeight: 200,
	},
	uploadAreaFilled: {
		borderColor: colors.primary,
		backgroundColor: "rgba(0, 217, 163, 0.05)",
	},
	uploadAreaError: {
		borderColor: colors.printRequest,
		backgroundColor: "rgba(255, 139, 123, 0.05)",
	},
	uploadText: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.textPrimary,
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	uploadSubtext: {
		fontSize: 14,
		color: colors.textSecondary,
		textAlign: "center",
		lineHeight: 20,
	},
	uploadLoadingText: {
		fontSize: 16,
		color: colors.textSecondary,
		marginTop: 16,
	},
	uploadedIconContainer: {
		marginBottom: 12,
	},
	uploadedText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.primary,
		marginBottom: 8,
		textAlign: "center",
	},
	uploadedFileName: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textPrimary,
		textAlign: "center",
		marginBottom: 4,
	},
	uploadedFileSize: {
		fontSize: 12,
		color: colors.textSecondary,
		textAlign: "center",
	},
	changeButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 16,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: colors.borderLight,
		borderRadius: 12,
		backgroundColor: colors.cardBackground,
		gap: 8,
	},
	changeButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textPrimary,
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
	nameInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.borderLight,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: colors.background,
		marginBottom: 12,
	},
	nameInput: {
		flex: 1,
		paddingVertical: 14,
		fontSize: 16,
		color: colors.textPrimary,
	},
	clearButton: {
		padding: 8,
		marginLeft: 8,
	},
	warningText: {
		fontSize: 12,
		color: colors.printRequest,
		lineHeight: 16,
	},
	summaryCard: {
		backgroundColor: colors.background,
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.borderLight,
		marginBottom: 20,
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
		gap: 12,
	},
	continueButton: {
		backgroundColor: colors.printRequest,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderRadius: 12,
		gap: 8,
	},
	continueButtonDisabled: {
		backgroundColor: colors.borderLight,
		opacity: 0.6,
	},
	continueButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.cardBackground,
	},
	removeButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: colors.printRequest,
		borderRadius: 12,
		alignItems: "center",
	},
	removeButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.printRequest,
	},
});
export default UploadDocument;
