import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

/**
 * Props:
 * - subscription : object from /subscription/status
 * - today        : object from /attendance/today
 */
export default function AttendanceActionCard({ subscription, today }) {
  const router = useRouter();

  // 🟡 Data still loading
  if (!subscription || !today) {
    return null;
  }

  // ❌ Subscription not active
  if (subscription.status !== "ACTIVE") {
    return (
      <View className="bg-red-100 border border-red-300 rounded-xl p-4 mt-4">
        <Text className="text-red-700 font-semibold text-center">
          Attendance Locked
        </Text>
        <Text className="text-xs text-red-600 text-center mt-1">
          Please buy or renew a subscription to mark attendance.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/plan")}
          className="mt-3 bg-red-500 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            View Plans
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ℹ️ Weekend / Holiday
  if (today.status === "OFF" || today.status === "HOLIDAY") {
    return (
      <View className="bg-gray-100 border border-gray-300 rounded-xl p-4 mt-4">
        <Text className="text-gray-700 font-semibold text-center">
          {today.status === "OFF"
            ? "Today is a Weekly Off"
            : "Today is a Government Holiday"}
        </Text>
      </View>
    );
  }

  // 🟢 Not punched in yet
  if (today.status === "NOT_MARKED") {
    return (
      <TouchableOpacity
        onPress={() => router.push("/attendance/punch-in")}
        className="bg-primary py-4 rounded-xl items-center mt-4"
      >
        <Text className="text-white font-bold text-lg">
          Make Attendance
        </Text>
        <Text className="text-white text-xs mt-1">
          Punch in before 11:00 AM
        </Text>
      </TouchableOpacity>
    );
  }

  // 🟡 Punched in → Punch Out allowed
  if (today.status === "PRESENT" && today.canPunchOut) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/attendance/punch-out")}
        className="bg-yellow-500 py-4 rounded-xl items-center mt-4"
      >
        <Text className="text-white font-bold text-lg">
          Punch Out
        </Text>
      </TouchableOpacity>
    );
  }

  // ✅ Attendance completed
  if (today.status === "PRESENT" && !today.canPunchOut) {
    return (
      <View className="bg-green-100 border border-green-300 rounded-xl p-4 mt-4">
        <Text className="text-green-700 font-semibold text-center">
          Attendance completed for today ✅
        </Text>
      </View>
    );
  }

  return null;
}
