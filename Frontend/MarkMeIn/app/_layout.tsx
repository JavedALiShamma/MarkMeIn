import { Stack } from "expo-router";
import "../global.css";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
export default function RootLayout() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);
   
  // Set the animation options. This is optional.
 SplashScreen.preventAutoHideAsync();

  // Check whetehr user is authenticated on app load 
  useEffect(() => {
    const prepare =async()=>{
    await restoreSession();
    await SplashScreen.hideAsync();
    }
    prepare();
  }, []);
   // ⛔ DO NOT render navigation until hydration completes
  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  // console.log("Is Authenticated:", isAuthenticated);
  return (<Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>);
}
