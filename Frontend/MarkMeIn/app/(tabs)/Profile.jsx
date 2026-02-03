import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuthStore } from "../store/useAuthStore";
import { useMyMunicipalities } from "../hooks/useMyMunicipalities";
import SubscriptionStatusCard from "../components/SubscriptionStatusCard";
import MunicipalityInfoCard from "../components/MunicipalityInfoCard";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import LinearGradientColor from "../components/LinearGradient";


export default function Profile() {
  const router = useRouter();

  const {user} = useAuthStore();
  const logout = useAuthStore((s) => s.logout);

  const { municipalities, munciplaityLoading } = useMyMunicipalities();
  const { subscription, loading } = useSubscriptionStatus();
  const handleLogoutDetails =()=>{
    // Here we logout and redirect to login page
    logout();
    router.replace("/(auth)");


  }
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogoutDetails,
        },
      ]
    );
  };
   if(loading  || munciplaityLoading ){
      return(<ActivityIndicator size={"large"}/>)
    }
  return (
    <SafeAreaView className="flex-1 bg-background">
      <LinearGradientColor height ={25}/>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Header */}
        <Text className="text-2xl font-bold text-white mt-4 mb-4">
          My Profile
        </Text>

        {/* Employee Card */}
        <View className="bg-white rounded-2xl p-4 shadow mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            {user?.name}
          </Text>

          <Text className="text-sm text-gray-600 mt-1">
            Mobile: {user?.mobile}
          </Text>

          {user?.email && (
            <Text className="text-sm text-gray-600">
              Email: {user.email}
            </Text>
          )}

          <View className="mt-2 self-start px-3 py-1 rounded-full bg-blue-100">
            <Text className="text-xs text-blue-700 font-semibold">
              {user?.role?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Subscription */}
        <SubscriptionStatusCard subscription={subscription} />

        {/* Municipality Info */}
        <MunicipalityInfoCard
          municipalities={municipalities}
          loading={munciplaityLoading}
        />

        {/* Actions */}
        <View className="bg-white rounded-2xl p-4 shadow mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Account
          </Text>

          {/* Change Plan */}
          <TouchableOpacity
            onPress={() => router.push("/plan")}
            className="py-3 border-b border-gray-200"
          >
            <Text className="text-gray-800 font-medium">
              Manage Subscription
            </Text>
          </TouchableOpacity>

          {/* Attendance History */}
          <TouchableOpacity
            onPress={() => router.push("(tabs)/Dashboard")}
            className="py-3 border-b border-gray-200"
          >
            <Text className="text-gray-800 font-medium">
              Attendance History
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="py-3"
          >
            <Text className="text-red-600 font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
