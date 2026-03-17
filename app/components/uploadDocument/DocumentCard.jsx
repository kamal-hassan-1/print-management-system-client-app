import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";

const DocumentCard = ({ doc, index, onRemove }) => {
	const extension = doc.file.name ? doc.file.name.split(".").pop().toUpperCase() : "FILE";

	return (
		<View style={styles.documentCard}>
			<View style={styles.documentCardHeader}>
				<View style={styles.documentIconContainer}>
					<Feather name="file-text" size={22} color={colors.primary} />
					<Text style={styles.extensionBadge}>{extension}</Text>
				</View>
				<View style={styles.documentInfo}>
					<Text style={styles.documentOriginalName} numberOfLines={1}>
						{doc.file.name.slice(0, 40)}
					</Text>
					<Text style={styles.documentFileSize}>{(doc.file.size / 1024).toFixed(2)} KB</Text>
				</View>
				<TouchableOpacity style={styles.removeCardButton} onPress={() => onRemove(index)}>
					<Feather name="x" size={18} color={colors.printRequest} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default DocumentCard;

const styles = StyleSheet.create({
	documentCard: {
		backgroundColor: colors.background,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.borderLight,
		padding: 14,
		marginBottom: 4,
	},
	documentCardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	documentIconContainer: {
		width: 44,
		height: 44,
		borderRadius: 10,
		backgroundColor: "rgba(0, 217, 163, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	documentsList: {
		gap: 12,
	},
	extensionBadge: {
		fontSize: 8,
		fontWeight: "800",
		color: colors.primary,
		marginTop: 2,
	},
	documentInfo: {
		flex: 1,
	},
	documentOriginalName: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 2,
	},
	documentFileSize: {
		fontSize: 12,
		color: colors.textSecondary,
	},
	removeCardButton: {
		width: 32,
		height: 32,
		borderRadius: 8,
		backgroundColor: "rgba(255, 139, 123, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
});
