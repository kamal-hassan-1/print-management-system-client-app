import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync("authToken");

                if (token) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isChecking) return;

        const inAuthGroup = segments[0] === "(tabs)";

        if (isAuthenticated && !inAuthGroup) {
            router.replace("/(tabs)/home");
        } else if (!isAuthenticated && inAuthGroup) {
            router.replace("/");
        }
    }, [isAuthenticated, isChecking]);

    
    if (isChecking) {
        return (
            <View style={styles.splashContainer}>
                <Image 
                    source={require("../assets/images/icon.png")} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <ActivityIndicator 
                    size="small" 
                    color="#FF7F66" 
                    style={{ marginTop: 20 }} 
                />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 150,
        height: 150,
    },
});
