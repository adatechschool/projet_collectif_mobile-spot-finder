export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    scheme: "exp://192.168.1.28:19000",
    android: {
      package: "com.adatechschool.spotfinder",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    ios: {
      bundleIdentifier: "com.adatechschool.spotfinder", // Ajoutez cette ligne
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      googleApiKey: "AIzaSyCRYEssMuNLmqhUWyH4qZdFoK7KuWVRCrQ",
      eas: {
        projectId: "f541ebda-5cfd-4472-8767-21ad48452e7c",
      },
    },
  },
};
