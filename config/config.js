import Constants from "expo-constants";
const config = {
	apiBaseUrl: Constants.expoConfig?.extra?.apiBaseUrl || "https://clickprintbackend.wckd.pk/api",
};
export default config;
