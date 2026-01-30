import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/config";
import { colors } from "../constants/colors";

const API_BASE_URL = config.apiBaseUrl;

//isse hatana he, yeh ahad or sohail ko preview dene keliye likha tha
const hardCodedShops = [
	{
		id: "shop1",
		name: "Print Shop A",
		address: "123 Main St, Cityville",
		capabilities: ["Black & White Printing", "Color Printing", "Binding Services"],
	},
];

const NewPrint = () => {
	const router = useRouter();
	const [shops, setShops] = useState([]);
	const [selectedShop, setSelectedShop] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchShops();
	}, []);

	const fetchShops = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_BASE_URL}/getShops`);

			if (!response.ok) {
				// ye wapas lagana he
				// throw new Error(`HTTP error! status: ${response.status}`);
				setShops(hardCodedShops);
				setLoading(false);
				return;
			}

			const data = await response.json();
			setShops(data.shops);
		} catch (err) {
			console.error("Error fetching shops:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleShopSelect = (shop) => {
		setSelectedShop(shop.id);
		console.log("Selected shop:", shop);
	};

	const handleContinue = () => {
		if (!selectedShop) {
			Alert.alert("No Shop Selected", "Please select a print shop to continue.");
			return;
		}

		const shop = shops.find((s) => s.id === selectedShop);
		console.log("Continuing with shop:", shop);
		router.push({ pathname: "/upload-document", params: { shopId: selectedShop } });
	};

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
				<Text style={styles.headerTitle}>Select Print Shop</Text>
				<View style={styles.placeholder} />
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator
						size="large"
						color={colors.primary}
					/>
					<Text style={styles.loadingText}>Loading shops...</Text>
				</View>
			) : error ? (
				<View style={styles.errorContainer}>
					<Feather
						name="alert-circle"
						size={48}
						color={colors.expense}
					/>
					<Text style={styles.errorText}>Failed to load shops</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={fetchShops}>
						<Text style={styles.retryButtonText}>Retry</Text>
					</TouchableOpacity>
				</View>
			) : (
				<>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContent}>
						{shops.map((shop) => (
							<ShopCard
								key={shop.id}
								shop={shop}
								isSelected={selectedShop === shop.id}
								onSelect={() => handleShopSelect(shop)}
							/>
						))}
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity
							style={[styles.continueButton, !selectedShop && styles.continueButtonDisabled]}
							onPress={handleContinue}
							disabled={!selectedShop}>
							<Text style={styles.continueButtonText}>Continue</Text>
							<Feather
								name="arrow-right"
								size={20}
								color={colors.cardBackground}
							/>
						</TouchableOpacity>
					</View>
				</>
			)}
		</SafeAreaView>
	);
};

const ShopCard = ({ shop, isSelected, onSelect }) => {
	return (
		<TouchableOpacity
			style={[styles.shopCard, isSelected && styles.shopCardSelected]}
			onPress={onSelect}
			activeOpacity={0.7}>
			<View style={[styles.shopIcon, isSelected && styles.shopIconSelected]}>
				<Feather
					name="shopping-bag"
					size={24}
					color={isSelected ? colors.printRequest : colors.textSecondary}
				/>
			</View>

			<View style={styles.shopInfo}>
				<Text style={[styles.shopName, isSelected && styles.shopNameSelected]}>{shop.name}</Text>
				<Text style={styles.shopAddress}>{shop.address}</Text>
				<View style={styles.capabilities}>
					{shop.capabilities.map((capability, index) => (
						<View
							key={index}
							style={styles.capabilityItem}>
							<Text style={styles.capabilityBullet}>•</Text>
							<Text style={styles.capabilityText}>{capability}</Text>
						</View>
					))}
				</View>
			</View>
			{isSelected && (
				<View style={styles.selectionIndicator}>
					<Feather
						name="check-circle"
						size={24}
						color={colors.printRequest}
					/>
				</View>
			)}
		</TouchableOpacity>
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.cardBackground,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: colors.textSecondary,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.cardBackground,
		padding: 20,
	},
	errorText: {
		marginTop: 16,
		fontSize: 18,
		fontWeight: "600",
		color: colors.textPrimary,
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: colors.primary,
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 12,
	},
	retryButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.cardBackground,
	},
	scrollView: {
		flex: 1,
		backgroundColor: colors.cardBackground,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 120,
	},
	shopCard: {
		flexDirection: "row",
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: 2,
		borderColor: colors.borderLight,
		shadowColor: colors.shadowLight,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 2,
	},
	shopCardSelected: {
		borderColor: colors.printRequest,
		backgroundColor: colors.cardBackground,
	},
	shopIcon: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: colors.background,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	shopIconSelected: {
		backgroundColor: "#FFE8E5",
	},
	shopInfo: {
		flex: 1,
	},
	shopName: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.textPrimary,
		marginBottom: 6,
	},
	shopNameSelected: {
		color: colors.printRequest,
	},
	shopAddress: {
		fontSize: 14,
		fontWeight: "400",
		color: colors.textSecondary,
		marginBottom: 12,
		lineHeight: 20,
	},
	capabilities: {
		gap: 4,
	},
	capabilityItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 8,
	},
	capabilityBullet: {
		fontSize: 14,
		color: colors.textSecondary,
		marginTop: 2,
	},
	capabilityText: {
		fontSize: 13,
		color: colors.textSecondary,
		flex: 1,
	},
	selectionIndicator: {
		marginLeft: 8,
		justifyContent: "center",
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
	},
	continueButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.cardBackground,
	},
});
export default NewPrint;
