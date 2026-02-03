import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import API_URLS from "../config/apiUrl";
import ToastManager, { Toast } from 'toastify-react-native'
import { useNavigation } from "@react-navigation/native";
// const PLANS = [
//   {
//     _id: "6970c0fafad82ab4785e85c6",
//     code: "BASIC",
//     name: "BASIC",
//     pricePerMonth: 199,
//     currency: "INR",
//     durationInDays: 30,
//     description:
//       "This plan is for single employee with geo fencing attendance",
//     features: {
//       allowRemoteAttendance: true,
//       maxRemoteDaysPerMonth: 1,
//       allowOfflineAttendance: false,
//       allowLocationOverride: false,
//     },
//   },
//   {
//     _id: "6970c1dafad82ab4785e85c8",
//     code: "PRO",
//     name: "PRO",
//     pricePerMonth: 599,
//     currency: "INR",
//     durationInDays: 30,
//     description:
//       "Geo fencing attendance with more remote attendance allowed",
//     features: {
//       allowRemoteAttendance: true,
//       maxRemoteDaysPerMonth: 5,
//       allowOfflineAttendance: false,
//       allowLocationOverride: false,
//     },
//   },
//   {
//     _id: "6970c22afad82ab4785e85ca",
//     code: "PREMIUM",
//     name: "PREMIUM",
//     pricePerMonth: 699,
//     currency: "INR",
//     durationInDays: 30,
//     description:
//       "Geo fencing attendance with remote & offline attendance",
//     features: {
//       allowRemoteAttendance: true,
//       maxRemoteDaysPerMonth: 10,
//       allowOfflineAttendance: true,
//       allowLocationOverride: false,
//     },
//   },
// ];

export default function PlanSelectionScreen() {
    const [PLANS ,setPLANS]= useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading , setIsLoading ]= useState(false);
  const navigation = useNavigation();
    // Here we need to call the backend to get all the plans
    useEffect(()=>{
        const getAllPlansFromBackend = async()=>{
            try {
                setIsLoading(true);
                // console.log(API_URLS.PLAN);
                const response = await axios.get(`${API_URLS.PLAN}/getAllPlans`);
                if(response.status === 200){
                    console.log( "PLANS ARE",response.data.plans);
                    setPLANS(response.data.plans);
                }
            } catch (error) {
                 Toast.error("Server down try again");
                 console.log(error);
            }
            finally{
               setIsLoading(false);
            }
        }
        getAllPlansFromBackend();
    },[])
//  Continue 
    const handleContinue = () => {
    navigation.navigate("plan/planDetails", {
    plan: selectedPlan, // full plan object from backend
    });
    };

    if(isLoading){
        return(<ActivityIndicator size={"large"}/>)
    }
    const renderFeature = (label, enabled) => (
    <View className="flex-row items-center mb-1">
      <Ionicons
        name={enabled ? "checkmark-circle" : "close-circle"}
        size={16}
        className={enabled ? "text-primary" : "text-gray-400"}
      />
      <Text className="ml-2 text-gray-700 text-sm">
        {label}
      </Text>
    </View>
  );

  return (
    <>
     <ToastManager />
    <SafeAreaView className="flex-1 bg-background px-4">
      {/* HEADER */}
      <View className="mt-4 mb-6">
        <Text className="text-secondary text-xl font-bold">
          Choose Your Plan
        </Text>
        <Text className="text-muted mt-1">
          Select a plan to enable attendance
        </Text>
      </View>

      {/* PLAN LIST */}
      <FlatList
        data={PLANS}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedPlan?._id === item._id;

          return (
            <TouchableOpacity
              onPress={() => setSelectedPlan(item)}
              activeOpacity={0.85}
              className={`mb-4 rounded-2xl border bg-white p-4 ${
                isSelected ? "border-primary" : "border-gray-200"
              }`}
            >
              {/* HEADER */}
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-secondary text-lg font-bold">
                    {item.name}
                  </Text>
                  <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                   className="text-muted text-sm">
                    {item.description}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-primary text-xl font-bold">
                    ₹{item.pricePerMonth}
                  </Text>
                  <Text className="text-muted text-xs">
                    / {item.durationInDays} days
                  </Text>
                </View>
              </View>

              {/* FEATURES */}
              <View className="mt-3">
                {renderFeature(
                  "Remote Attendance",
                  item.features.allowRemoteAttendance
                )}

                {renderFeature(
                  `${item.features.maxRemoteDaysPerMonth} Remote Days / Month`,
                  item.features.maxRemoteDaysPerMonth > 0
                )}

                {renderFeature(
                  "Offline Attendance",
                  item.features.allowOfflineAttendance
                )}

                {renderFeature(
                  "Location Override",
                  item.features.allowLocationOverride
                )}
              </View>

              {/* SELECTED BADGE */}
              {isSelected && (
                <View className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    SELECTED
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* CONTINUE BUTTON */}
      <View className="pb-4">
        <TouchableOpacity
          disabled={!selectedPlan}
          onPress={handleContinue}
          className={`py-4 rounded-2xl items-center ${
            selectedPlan ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-base">
            Continue
          </Text>
        </TouchableOpacity>

        {!selectedPlan && (
          <Text className="text-muted text-xs text-center mt-2">
            Please select a plan to continue
          </Text>
        )}
      </View>
    </SafeAreaView>
    </>
  );
}
