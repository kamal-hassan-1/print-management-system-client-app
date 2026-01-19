import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Login = () => {

	const router = useRouter();
	const [countryCode, setCountryCode] = useState("+92");
	const [phone, setPhone] = useState("");
	const [showPicker, setShowPicker] = useState(false);

	const countryCodes = [
		{ label: "🇵🇰 Pakistan +92", value: "+92" },
		{ label: "🇺🇸 USA +1", value: "+1" },
		{ label: "🇮🇳 India +91", value: "+91" },
	];

	const handleContinue = () => {

		if (phone.length === 0) {
			Alert.alert("Please enter a valid phone number.");
			return;
		}

		// TODO: Implement actual authentication API call here
		console.log("Continue with phone number:", countryCode + phone);

		// Navigate to the main app (tabs)
		router.replace("/otp");
	}

	const selectCountryCode = (code) => {
		setCountryCode(code);
		setShowPicker(false);
	}

	// Get the selected country display text with flag
	const getSelectedCountryDisplay = () => {
		const selected = countryCodes.find(c => c.value === countryCode);
		if (selected) {
			// Extract flag and code (e.g., "🇵🇰 +92" from "🇵🇰 Pakistan +92")
			const parts = selected.label.split(' ');
			if (parts.length >= 3) {
				return `${parts[0]} ${parts[parts.length - 1]}`; // Flag + Code
			}
			return selected.label;
		}
		return countryCode;
	}


	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
					setShowPicker(false);
				}}
				accessible={false}
			>
				<SafeAreaView style={styles.container}>

					<Text style={styles.heading}>Let's get started!</Text>
					<Text style={styles.subHeading}>Please enter your mobile number</Text>

					<View style={styles.phoneRow}>

						{/* Country Code */}
						<View style={styles.countryCodeWrapper}>
							<TouchableOpacity
								style={styles.countryBox}
								onPress={() => setShowPicker(!showPicker)}
							>
								<Text style={styles.countryCodeText}>
									{getSelectedCountryDisplay()}
								</Text>
								<Ionicons 
									name={showPicker ? "chevron-up" : "chevron-down"} 
									size={18} 
									color="#000" 
								/>
							</TouchableOpacity>

							{/* Dropdown */}
							{showPicker && (
								<View style={styles.dropdown}>
									{countryCodes.map((item) => (
										<TouchableOpacity
											key={item.value}
											style={[
												styles.dropdownOption,
												countryCode === item.value && styles.dropdownOptionSelected
											]}
											onPress={() => selectCountryCode(item.value)}
										>
											<Text style={[
												styles.dropdownOptionText,
												countryCode === item.value && styles.dropdownOptionTextSelected
											]}>
												{item.label}
											</Text>
											{countryCode === item.value && (
												<Ionicons name="checkmark" size={18} color="#FF4F00" />
											)}
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Phone Input */}
						<View style={styles.phoneBox}>
							<TextInput
								style={styles.input}
								placeholder="3012345678"
								placeholderTextColor="#999"
								keyboardType="number-pad"
								value={phone}
								onChangeText={setPhone}
								maxLength={15}
							/>
						</View>

					</View>


					<TouchableOpacity
						style={[styles.button, phone.length === 0 && styles.buttonDisabled]}
						disabled={phone.length === 0}
						onPress={handleContinue}
					>
						<Text style={styles.buttonText}>Continue</Text>
						<Ionicons name="arrow-forward" size={20} color="#fff" />
					</TouchableOpacity>

				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)

};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FF7F66", // similar to screenshot
		paddingHorizontal: 20,
		justifyContent: "center",
		
	},
	heading: {
		fontSize: 28,
		color: "#fff",
		fontWeight: "bold",
		marginBottom: 10,
		marginTop: 100,
		marginLeft: 5,
	},
	subHeading: {
		fontSize: 16,
		color: "#fff",
		marginBottom: 40,
		marginTop: 5,
		marginLeft: 5,
	},
	phoneRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 30,
		position: "relative",
		zIndex: 1,
	},

	countryCodeWrapper: {
		position: "relative",
		zIndex: 10,
		marginRight: 10,
	},

	countryBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		paddingHorizontal: 14,
		height: 40,
		borderRadius: 25,
		gap: 6,
	},

	phoneBox: {
		flex: 1,
		backgroundColor: "#fff",
		height: 40,
		borderRadius: 25,
		paddingHorizontal: 10,
		justifyContent: "center",
	},

	input: {
		fontSize: 16,
		color: "#000",
	},

	countryCodeText: {
		color: "#000",
		fontSize: 14,
		fontWeight: "500",
	},
	dropdown: {
		position: "absolute",
		top: 55,
		left: 0,
		right: 0,
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingVertical: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 5,
		minWidth: 180,
		zIndex: 1000,
	},
	dropdownOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginHorizontal: 8,
		marginVertical: 2,
	},
	dropdownOptionSelected: {
		backgroundColor: "#fff3f0",
	},
	dropdownOptionText: {
		fontSize: 15,
		color: "#000",
		flex: 1,
	},
	dropdownOptionTextSelected: {
		color: "#FF4F00",
		fontWeight: "600",
	},
	input: {
		flex: 1,
		height: 50,
		fontSize: 16,
		marginLeft: 10,
		color: "#000",
	},
	button: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#FF4F00",
		paddingVertical: 15,
		borderRadius: 10,
		marginTop: "auto",
		marginBottom: 40,
	},

	buttonDisabled: {
		backgroundColor: "#FF7F66",
		opacity: 0.6,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		marginRight: 10,
		fontWeight: "bold",
	}
});

export default Login;
