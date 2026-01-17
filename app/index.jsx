import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import Router
import { useEffect, useState } from "react";
import { Alert, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const PIN_LENGTH = 5;
const CORRECT_PIN = "12345"; // Hardcoded for demo

const Login = () => {
	const router = useRouter(); // Initialize router
	const [pin, setPin] = useState("");

	const handlePress = (num) => {
		if (pin.length < PIN_LENGTH) {
			setPin((prev) => prev + num);
		}
	};

	const handleDelete = () => {
		setPin(pin.slice(0, -1));
	};

	// Automatically check PIN when it reaches length
	useEffect(() => {
		if (pin.length === PIN_LENGTH) {
			if (pin === CORRECT_PIN) {
				// .replace() prevents the user from going 'back' to login
				router.replace("/(tabs)/home");
			} else {
				Alert.alert("Error", "Incorrect PIN");
				setPin("");
			}
		}
	}, [pin, router]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />

			<View style={styles.logoContainer}>
				<View style={styles.logo}>
					<Image
						source={require("../assets/images/icon.png")}
						style={styles.logoImage}
						resizeMode="contain"
					/>
				</View>
			</View>

			<Text style={styles.title}>Enter your login PIN</Text>

			{/* PIN Dots */}
			<View style={styles.pinContainer}>
				{[...Array(PIN_LENGTH)].map((_, index) => (
					<View
						key={index}
						style={[styles.pinDot, pin.length > index && styles.pinDotFilled]}
					/>
				))}
			</View>

			<TouchableOpacity>
				<Text style={styles.forgot}>Forgot PIN?</Text>
			</TouchableOpacity>

			<View style={styles.keypad}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
					<TouchableOpacity
						key={num}
						style={styles.key}
						onPress={() => handlePress(num.toString())}>
						<Text style={styles.keyText}>{num}</Text>
					</TouchableOpacity>
				))}

				{/* Fingerprint */}
				<TouchableOpacity style={styles.key}>
					<Ionicons
						name="finger-print-sharp"
						size={28}
						color={colors.printRequest}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.key}
					onPress={() => handlePress("0")}>
					<Text style={styles.keyText}>0</Text>
				</TouchableOpacity>

				{/* Backspace */}
				<TouchableOpacity
					style={styles.key}
					onPress={handleDelete}>
					<Feather
						name="delete"
						size={26}
						color={colors.printRequest}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: "center",
		paddingHorizontal: 24,
	},
	logoContainer: {
		marginTop: 40,
		marginBottom: 40,
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 3,
		borderColor: colors.borderLight,
		justifyContent: "center",
		alignItems: "center",
	},
	logoImage: {
		width: 60,
		height: 60,
	},
	title: {
		fontSize: 22,
		color: colors.textPrimary,
		fontWeight: "600",
		marginBottom: 30,
	},
	pinContainer: {
		flexDirection: "row",
		gap: 14,
		marginBottom: 40,
	},
	pinDot: {
		width: 28,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.printRequest, // Default empty color
	},
	pinDotFilled: {
		backgroundColor: colors.navInactive, // Filled color
	},
	forgot: {
		color: colors.primary,
		fontSize: 16,
		marginBottom: 30,
	},
	keypad: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	key: {
		width: "30%",
		height: 70,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
	},
	keyText: {
		fontSize: 28,
		color: colors.printRequest,
		fontWeight: "500",
	},
});

export default Login;
