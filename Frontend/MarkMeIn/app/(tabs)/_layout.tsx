import { Redirect, Tabs, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import  colors  from "../../styles/baseColors";
import { useAuthStore } from "../store/useAuthStore";

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);
  const navigation = useNavigation();
   // Wait for auth restore
  if (!hydrated) return null;

  // 🔒 Block access if not logged in
  // if (!isAuthenticated) {
  //    navigation.replace("(tabs)"); 
  // }
  return (
    <Tabs
      
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
       
        tabBarStyle: {
          position: "absolute",
          bottom: 40,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#fff",
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          paddingTop: 10,
        },
        
        
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="home-outline"
            />
          ),
        }}
      />

      {/* DASHBOARD / CALENDAR */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="calendar-outline"
            />
          ),
        }}
      />


      {/* PROFILE / SETTINGS */}
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="settings-outline"
            />
          ),
        }}
      />
      
      {/* NOTIFICATIONS */}
      <Tabs.Screen
        name="Notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="notifications-outline"
            />
          ),
        }}
      />
    </Tabs>
    
  );
}

/* ---------------- TAB ICON COMPONENT ---------------- */

function TabIcon({
  focused,
  icon,
}: {
  focused: boolean;
  icon: any;
}) {
  return (
    <View
      style={{
        width: 50,
        height: 44,
        borderRadius: 10,
        backgroundColor: focused ? colors.primary : "transparent",
        alignItems: "center",
        justifyContent: "center",
        
      }}
    >
      <Ionicons
        name={icon}
        size={25}
        color={focused ? "#fff" : colors.primary}
      />
    </View>
  );
}
