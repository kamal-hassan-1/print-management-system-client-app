import Constants from "expo-constants";

const config = {
	apiBaseUrl: Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:3000",
};

export default config;
