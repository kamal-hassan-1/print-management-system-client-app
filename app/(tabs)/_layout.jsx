import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function Layout() {
	const insets = useSafeAreaInsets();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.cardBackground,
					borderTopWidth: 1,
					borderTopColor: colors.borderLight,
					paddingTop: 10,
					paddingBottom: Math.max(insets.bottom, 10),
					height: 80 + Math.max(insets.bottom, 10),
					shadowColor: colors.shadowMedium,
					shadowOffset: { width: 0, height: -4 },
					shadowOpacity: 1,
					shadowRadius: 24,
					elevation: 12,
				},
				tabBarActiveTintColor: colors.navActive,
				tabBarInactiveTintColor: colors.navInactive,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
				tabBarIconStyle: {
					marginBottom: -4,
				},
			}}>

			{/* Home Tab */}

			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>

			{/* Print History Tab */}

			<Tabs.Screen
				name="printHistory"
				options={{
					title: "Print History",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "receipt" : "receipt-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>

			{/* Profile Tab */}

			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={20}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
