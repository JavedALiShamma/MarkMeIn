import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

import { useAuthStore } from "../store/useAuthStore";
import { API_URLS } from "../config/apiUrl";

export default function PunchOutScreen() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(null);
  const [workSummary, setWorkSummary] = useState("");

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get(API_URLS.TODAY_ATTENDANCE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToday(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch today attendance");
    }
  };

  const handlePunchOut = async () => {
    if (!workSummary.trim()) {
      Alert.alert("Required", "Please enter work summary");
      return;
    }

    try {
      setLoading(true);
        // const workSummary =remarks
      await axios.post(
        API_URLS.PUNCH_OUT,
        { workSummary },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Punch out successful");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Punch Out Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading today data
  if (!today) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <Text className="text-xl font-bold text-primary text-center mb-6">
        Punch Out
      </Text>

      {/* Punch-in info */}
      <View className="bg-gray-100 rounded-xl p-4 mb-4">
        <Text className="text-sm text-gray-600">Punch In Time</Text>
        <Text className="text-lg font-semibold text-gray-800">
          {new Date(today.punchInTime).toLocaleTimeString()}
        </Text>
      </View>

      {/* Work summary */}
      <Text className="text-sm text-gray-700 mb-2">
        Work done today
      </Text>
      <TextInput
        value={workSummary}
        onChangeText={setWorkSummary}
        placeholder="Describe your work..."
        multiline
        numberOfLines={5}
        className="bg-white rounded-xl p-4 text-sm text-gray-800 border border-gray-300 mb-6"
        textAlignVertical="top"
      />

      {/* Punch out button */}
      <TouchableOpacity
        onPress={handlePunchOut}
        disabled={loading}
        className={`py-4 rounded-xl items-center ${
          loading ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">
            Punch Out
          </Text>
        )}
      </TouchableOpacity>
      <View className='w-100 mt-4 p-2'>
        <Text className='text-muted text-s'>Work done details will be used to make monthly timesheet Report</Text>
      </View>
    </SafeAreaView>
  );
}
