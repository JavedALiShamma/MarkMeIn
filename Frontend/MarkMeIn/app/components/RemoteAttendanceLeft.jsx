import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function RemoteAttendanceLeft({subscription,remoteAttendance}) {
  // console.log(subscription ,remoteAttendance ,"REMOTE ATTENDANCE COunt" );
  const number = subscription?.maxRemoteDaysPerMonth -remoteAttendance;
  // const router = require("expo-router");
  const {router} = require("expo-router");
  if(number <= 0){
    return(
      <View className="w-100">
    <Text> No Remote attendance is available upgrade your plan to get more remote attendance</Text>
    </View>)
  }
  if(subscription?.hasSubscription===false && remoteAttendance=== 0){
    return(<View className="w-100">
      <Text className="text-red-600 text-center mt-2"> Please select a plan to get remote attendance</Text>
       <Text className="text-muted text-xs text-center mt-3"> Remote attendace allows employee to mark attendace from remote places </Text>
    </View>)
  }
    return (
    <View className ="w-100">
      <TouchableOpacity
        // onPress={()=>router.push("/attendace/remote")}
        onPress={ () => router.push("/attendance/remote")}
          className="flex-row bg-yellow-400 py-4 rounded-xl items-center justify-center"
         
        >
          <Ionicons
            name="finger-print-outline"
            size={22}
            className="text-black"
          />
          <Text className="text-white font-bold ml-2">
           Remote Attendance left : {number} 
          </Text>
          
        </TouchableOpacity>
        <Text className="text-muted text-xs text-center mt-3"> Remote attendace allows employee to mark attendace from remote places </Text>
    </View>
  )
}