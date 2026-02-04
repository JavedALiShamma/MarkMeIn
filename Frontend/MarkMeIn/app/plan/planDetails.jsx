import { View, Text, TouchableOpacity, ScrollView, TouchableHighlight, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RazorpayCheckout from 'react-native-razorpay';
import { useState } from "react";
import { startRazorpayPayment } from "../services/razorpayService";
import { useAuthStore } from "../store/useAuthStore";

export default function PlanDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading , setIsLoading] = useState(false);
  const { plan } = route.params; // 🔑 plan data passed from selection screen
  const {user ,token }= useAuthStore();
  const {
    name,
    pricePerMonth,
    currency,
    durationInDays,
    description,
    features,
  } = plan;
  // Handle Payment 
  const handlePayment =async()=>{
    setIsLoading(true);
    const result = await startRazorpayPayment({
        planId: plan._id,
      user,
      token
    })
    console.log(result , "Result in frontend is");
    if(result.success){
      Alert.alert("Success", "Payment is done")
    }
    else if (result.cancelled) {
      Alert.alert("Cancelled", "Payment cancelled");
    } else {
      Alert.alert("Failed", "Payment failed, try again");
    }
    setIsLoading(false);
  }
  if(isLoading){
    return(<ActivityIndicator size={"large"}/>)
  }
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="mt-4 mb-6">
          <Text className="text-secondary text-2xl font-bold">
            {name} Plan
          </Text>
          <Text className="text-muted mt-2">
            {description}
          </Text>
        </View>

        {/* PRICE CARD */}
        <View className="bg-white rounded-2xl p-4 shadow mb-6">
          <Text className="text-muted text-sm">
            Price
          </Text>
          <Text className="text-primary text-3xl font-bold">
            ₹{pricePerMonth}
          </Text>
          <Text className="text-muted text-sm">
            for {durationInDays} days
          </Text>
        </View>

        {/* FEATURES */}
        <View className="bg-white rounded-2xl p-4 shadow">
          <Text className="text-secondary text-lg font-bold mb-4">
            What’s included
          </Text>

          <Feature
            label="Remote Attendance"
            enabled={features.allowRemoteAttendance}
          />

          <Feature
            label={`Remote Days / Month: ${features.maxRemoteDaysPerMonth}`}
            enabled={features.maxRemoteDaysPerMonth > 0}
          />

          <Feature
            label="Offline Attendance"
            enabled={features.allowOfflineAttendance}
          />

          <Feature
            label="Location Override"
            enabled={features.allowLocationOverride}
          />
        </View>
      </ScrollView>
      {/* RazorPay Screen  */}
      
      {/* PAY BUTTON */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-primary py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-lg">
            Pay ₹{pricePerMonth}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-3 items-center"
        >
          <Text className="text-muted text-sm">
            Change Plan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- FEATURE ROW ---------------- */

function Feature({ label, enabled }) {
  return (
    <View className="flex-row items-center mb-3">
      <Ionicons
        name={enabled ? "checkmark-circle" : "close-circle"}
        size={20}
        className={enabled ? "text-primary" : "text-gray-400"}
      />
      <Text className="ml-3 text-gray-700">
        {label}
      </Text>
    </View>
  );
}
