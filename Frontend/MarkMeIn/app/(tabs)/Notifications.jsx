import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LinearGradientColor from "../components/LinearGradient";

export default function Notifications() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
      <LinearGradientColor height={100}/>
      {/* Icon */}
      <View className="bg-gray-100 p-6 rounded-full mb-4">
        
        <Ionicons
          name="notifications-off-outline"
          size={48}
          color="#9CA3AF"
        />
      </View>

      {/* Title */}
      <Text className="text-lg font-semibold text-gray-800">
        No Notifications
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-500 text-center mt-2">
        You don’t have any notifications right now.
        We’ll notify you here when something important happens.
      </Text>
    </SafeAreaView>
  );
}
