import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SubscriptionStatusCard({ subscription }) {
  const router = useRouter();
  
  // 🟥 No subscription
  if (!subscription?.hasSubscription) {
    return (
      <View className="bg-red-100 border border-red-300 rounded-xl p-4 mb-4">
        <Text className="text-red-700 font-semibold">
          No active subscription
        </Text>

        <Text className="text-xs text-red-600 mt-1">
          Please select a plan to continue using attendance features.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/plan")}
          className="mt-3 bg-red-500 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Choose a Plan
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🟡 Inactive subscription
  if (subscription.status !== "ACTIVE") {
    return (
      <View className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-4">
        <Text className="text-yellow-800 font-semibold">
          Subscription {String(subscription.status)}
        </Text>

        <Text className="text-xs text-yellow-700 mt-1">
          Renew your plan to continue attendance.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/plan")}
          className="mt-3 bg-yellow-500 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Renew Plan
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🟢 Active subscription
  return (
    <View className="flex-row items-center justify-between bg-green-100 border border-green-300 rounded-xl p-4 mb-4">
      
      <View>
        <Text className="text-green-800 font-semibold">
          {String(subscription.planName)} Plan Active
        </Text>

        <Text className="text-xs text-green-700 mt-1">
          Valid till{" "}
          {new Date(subscription.endDate).toLocaleDateString()}{" "}
          ({subscription.daysRemaining} days left)
        </Text>
      </View>

      <View className="bg-green-600 px-3 py-2 rounded-lg">
        <Text className="text-xs text-white font-semibold">
          Remote Days: {subscription.maxRemoteDaysPerMonth}
        </Text>
      </View>

    </View>
  );
}
