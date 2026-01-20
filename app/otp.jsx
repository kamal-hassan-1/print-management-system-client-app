import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyCode = () => {
	const router = useRouter();
	const params = useLocalSearchParams();
	const phoneNumber = params.phone || "+92-327-5555555";
	
	const [codes, setCodes] = useState(["", "", "", "", ""]);
	const [timer, setTimer] = useState(30); // 30 seconds
	const [showErrorModal, setShowErrorModal] = useState(false);
	const inputRefs = useRef([]);

	// Format phone number for display
	const formatPhoneNumber = (phone) => {
		if (!phone) return "";
		// If already formatted, return as is
		if (phone.includes("-")) return phone;
		// Format: +92-XXX-XXXXXXX
		if (phone.startsWith("+92")) {
			const cleaned = phone.replace("+92", "").replace(/\D/g, "");
			if (cleaned.length >= 10) {
				return `+92-${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
			}
		}
		return phone;
	};

	// Timer countdown
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const handleCodeChange = (value, index) => {
		// Only allow single digit
		if (value.length > 1) return;

		const newCodes = [...codes];
		newCodes[index] = value;
		setCodes(newCodes);

		// Auto-focus next input
		if (value && index < 4) {
			inputRefs.current[index + 1]?.focus();
		}

		// Auto-verify when all 5 digits are entered
		if (newCodes.every((code) => code !== "") && index === 4) {
			handleVerify(newCodes.join(""));
		}
	};

	const handleKeyPress = (e, index) => {
		// Handle backspace to go to previous input
		if (e.nativeEvent.key === "Backspace" && !codes[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = (code) => {
		// TODO: Implement actual verification API call
		console.log("Verifying code:", code);

		// Simulate verification failure for demo
		if (code === "12345") {
			// Success - navigate to home
			router.replace("/(tabs)/home");
		} else {
			// Show error modal
			setShowErrorModal(true);
			// Clear codes
			setCodes(["", "", "", "", ""]);
			inputRefs.current[0]?.focus();
		}
	};

	const handleResendCode = () => {
		if (timer > 0) return;
		// TODO: Implement resend code API call
		console.log("Resending code to:", phoneNumber);
		setTimer(30);
		setCodes(["", "", "", "", ""]);
		inputRefs.current[0]?.focus();
	};

	const handleCall = () => {
		if (timer > 0) return;
		// TODO: Implement call API
		console.log("Calling:", phoneNumber);
		Alert.alert("Call", `Calling ${phoneNumber}...`);
	};

	const formatTimer = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Back Button */}
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => router.back()}
			>
				<Ionicons name="arrow-back" size={24} color="#fff" />
			</TouchableOpacity>

			{/* Title */}
			<Text style={styles.title}>Enter verification code</Text>

			{/* Instruction with WhatsApp */}
			<View style={styles.instructionContainer}>
				<Text style={styles.instructionText}>
					We&apos;ve sent it to {formatPhoneNumber(phoneNumber)} via
				</Text>
				<View style={styles.whatsappContainer}>
					<Ionicons name="logo-whatsapp" size={18} color="#25D366" />
					<Text style={styles.whatsappText}>Whatsapp</Text>
				</View>
			</View>

			{/* Code Input Fields */}
			<View style={styles.codeContainer}>
				{codes.map((code, index) => (
					<TextInput
						key={index}
						ref={(ref) => (inputRefs.current[index] = ref)}
						style={styles.codeInput}
						value={code}
						onChangeText={(value) => handleCodeChange(value, index)}
						onKeyPress={(e) => handleKeyPress(e, index)}
						keyboardType="number-pad"
						maxLength={1}
						selectTextOnFocus
						autoFocus={index === 0}
					/>
				))}
			</View>

			{/* Timer and Call/Resend Option */}
			<View style={styles.timerContainer}>
				{timer > 0 ? (
					<Text style={styles.timerText}>
						Call available in {formatTimer(timer)}
					</Text>
				) : (
					<View style={styles.actionContainer}>
						<TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
							<Text style={styles.resendText}>Resend code</Text>
						</TouchableOpacity>
						<Text style={styles.separator}>•</Text>
						<TouchableOpacity onPress={handleCall}>
							<Text style={styles.callText}>Call me instead</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>

			{/* Error Modal */}
			<Modal
				visible={showErrorModal}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowErrorModal(false)}
			>
				<View style={styles.errorModalOverlay}>
					<View style={styles.errorModalContent}>
						<Text style={styles.errorModalTitle}>Oops</Text>
						<Text style={styles.errorModalMessage}>
							Something went wrong. Please try again.
						</Text>

						<TouchableOpacity
							style={styles.errorCancelButton}
							onPress={() => setShowErrorModal(false)}
						>
							<Text style={styles.errorCancelText}>Cancel</Text>
							<Ionicons name="close" size={20} color="#FF4F00" />
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.errorTryAgainButton}
							onPress={() => {
								setShowErrorModal(false);
								handleResendCode();
							}}
						>
							<Text style={styles.errorTryAgainText}>Try again</Text>
							<Ionicons name="arrow-forward" size={20} color="#fff" />
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
		backgroundColor: "#FF7F66",
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	backButton: {
		marginBottom: 30,
		marginTop: 10,
	},
	title: {
		fontSize: 32,
		color: "#fff",
		fontWeight: "bold",
		marginBottom: 15,
	},
	instructionContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		marginBottom: 50,
	},
	instructionText: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.9)",
		marginRight: 5,
	},
	whatsappContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	whatsappText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "600",
	},
	codeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 40,
		gap: 15,
	},
	codeInput: {
		flex: 1,
		height: 60,
		borderBottomWidth: 2,
		borderBottomColor: "#fff",
		textAlign: "center",
		fontSize: 32,
		color: "#fff",
		fontWeight: "600",
		paddingVertical: 10,
	},
	timerContainer: {
		marginTop: "auto",
		marginBottom: 30,
	},
	timerText: {
		fontSize: 16,
		color: "#fff",
	},
	actionContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	resendButton: {
		paddingVertical: 5,
	},
	resendText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "600",
		textDecorationLine: "underline",
	},
	separator: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.6)",
		marginHorizontal: 5,
	},
	callText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "600",
		textDecorationLine: "underline",
	},
	errorModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	errorModalContent: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingTop: 30,
		paddingBottom: 50,
		paddingHorizontal: 25,
	},
	errorModalTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 15,
		textAlign: "center",
	},
	errorModalMessage: {
		fontSize: 16,
		color: "#666",
		marginBottom: 30,
		textAlign: "center",
	},
	errorCancelButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#FF7F66",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	errorCancelText: {
		fontSize: 16,
		color: "#FF4F00",
		fontWeight: "600",
	},
	errorTryAgainButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FF7F66",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	errorTryAgainText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "600",
	},
});

export default VerifyCode;