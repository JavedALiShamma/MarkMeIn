/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import { StatusBar } from 'expo-status-bar';

import { router } from "expo-router";
import LinearGradientColor from "../components/LinearGradient";

import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import SubscriptionStatusCard from "../components/SubscriptionStatusCard";


import AttendanceActionCard from "../components/AttendanceActionCard";

import { useAttendanceStatus } from "../hooks/useAttendanceStatus";
import { useRemoteAttendanceStatus } from "../hooks/useRemoteAttendancStatus";
import RemoteAttendanceLeft from "../components/RemoteAttendanceLeft";
import { useMyMunicipalities } from "../hooks/useMyMunicipalities";
import MunicipalityInfoCard from "../components/MunicipalityInfoCard";

export default function index() {

  const user = useAuthStore((state) => state.user);

  // Subscrption Status

  const { subscription, loading } = useSubscriptionStatus();
  const {todayAttendance , todayLoading} = useAttendanceStatus();
  const {remoteAttendance , remoteLoading} = useRemoteAttendanceStatus();
  const { municipalities, munciplaityLoading } = useMyMunicipalities();
  // const navigation = useNavigation();
 
 
  if(loading || todayLoading || munciplaityLoading || remoteLoading){
    return(<ActivityIndicator size={"large"}/>)
  }
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <LinearGradientColor height={25}/>
      <ScrollView className="flex-1">
          <StatusBar style="auto" backgroundColor={"#2C9EE8"} />
         
      {/* USER CARD */}
      <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow">
        <View>
          <Text className="text-muted text-sm">Welcome</Text>
          <Text className="text-secondary text-lg font-bold">
            {user?.name}
          </Text>
          <Text className="text-gray-600 text-sm mt-1">
            📱 {user?.mobile}
          </Text>
        </View>
        <View>
        
        </View>
         <Image
            source={require("../../assets/images/logo.png")}
            className="w-20 h-20 self-center"
            resizeMode="contain"
          />
      </View>

      {/* Municipality status */}
     
      <View className="bg-white rounded-2xl p-4 mt-5 shadow">
        <MunicipalityInfoCard
        municipalities={municipalities}
        loading={munciplaityLoading}
        />
      </View>
      {/*  SUBCRPTION DETAILS  */}
      <View className="bg-white rounded-2xl p-4 mt-5 shadow">
        {loading ? (
            <Text className="text-gray-400 text-center">Checking subscription...</Text>
          ) : (
            <SubscriptionStatusCard subscription={subscription} />
        )}
        {todayLoading ? <Text className ="text-gray-400 text-center">
          Attendance is Loading..
        </Text> :(<AttendanceActionCard
        subscription={subscription}
        today={todayAttendance}
        />)}
        
      </View>
      
      
      
      {/*  Remote attendace details */}
      <View className="bg-white rounded-2xl p-4 mt-5 shadow">
        <Text className="text-primary text-bold"> Remote Attendance Details</Text>
        { !loading && !remoteLoading &&
        <RemoteAttendanceLeft
        subscription={subscription}
        remoteAttendance={remoteAttendance}
        
        />}
      </View>
      <View className="h-20"></View>
      <View className="h-20"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
