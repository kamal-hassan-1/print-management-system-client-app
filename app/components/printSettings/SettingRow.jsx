import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";

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
export default SettingRow;

const styles = StyleSheet.create({
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
});
