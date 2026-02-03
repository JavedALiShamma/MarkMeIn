import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

import { useAuthStore } from "../store/useAuthStore";
import { API_URLS } from "../config/apiUrl";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

export default function RemoteAttendanceScreen() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const {subscription} = useSubscriptionStatus();

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
    console.log(subscription , " SUBSCRIPTION IN REMOTE ATTENDANCE PAGE");
  // ❌ Block access if no active subscription
  if (!subscription || subscription.status !== "ACTIVE") {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-background">
        <Text className="text-lg font-semibold text-red-600 text-center">
          Remote Attendance Not Available
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-2">
          You need an active subscription to use remote attendance.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/plan")}
          className="mt-5 bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">
            View Plans
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleRemotePunchIn = async () => {
    try {
      setLoading(true);

      await axios.post(
        API_URLS.PUNCH_IN,
        {
          attendanceType: "REMOTE",
          selfieUrl :"https://example.com/selfie.jpg"

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Remote attendance marked successfully");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message ||
          "Unable to mark remote attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      
      {/* Header */}
      <Text className="text-xl font-bold text-primary text-center mt-4">
        Remote Attendance
      </Text>

      {/* Info Card */}
      <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
        <Text className="font-semibold text-blue-800">
          What is Remote Attendance?
        </Text>

        <Text className="text-sm text-blue-700 mt-2">
          Remote attendance allows you to mark your presence when you are
          working outside your assigned office location.
        </Text>

        <Text className="text-sm text-blue-700 mt-2">
          • Location is NOT captured{"\n"}
          • Limited per month based on your plan{"\n"}
          • Excess usage may lead to restrictions
        </Text>
      </View>

      {/* Confirmation */}
      {!confirming ? (
        <TouchableOpacity
          onPress={() => setConfirming(true)}
          className="bg-primary py-4 rounded-xl items-center mt-8"
        >
          <Text className="text-white font-bold text-lg">
            Proceed with Remote Attendance
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="mt-8 bg-yellow-100 border border-yellow-300 rounded-xl p-4">
          <Text className="text-yellow-800 font-semibold text-center">
            Are you sure?
          </Text>

          <Text className="text-sm text-yellow-700 text-center mt-2">
            This attendance will be counted as REMOTE and deducted from your
            monthly remote attendance limit.
          </Text>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => setConfirming(false)}
              className="bg-gray-300 px-5 py-3 rounded-lg"
            >
              <Text className="text-gray-800 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRemotePunchIn}
              disabled={loading}
              className={`px-5 py-3 rounded-lg ${
                loading ? "bg-gray-400" : "bg-green-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Yes, Mark Attendance
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
