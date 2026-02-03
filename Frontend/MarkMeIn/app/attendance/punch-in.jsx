import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import ToastManager, { Toast } from 'toastify-react-native'

import { useAuthStore } from "../store/useAuthStore";
import { API_URLS } from "../config/apiUrl";

export default function PunchInScreen() {
  const router = useRouter();
  const cameraRef = useRef(null);

  const token = useAuthStore((s) => s.token);

  const [permission, requestPermission] = useCameraPermissions();
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // 📷 Camera
    if (!permission?.granted) {
      await requestPermission();
    }

    // 📍 Location
    const locationPermission =
      await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(locationPermission.status === "granted");

    if (!permission?.granted || locationPermission.status !== "granted") {
      Alert.alert(
        "Permissions required",
        "Camera and location permissions are required to mark attendance"
      );
    }
  };

  const handlePunchIn = async () => {
    try {
      setLoading(true);

      // 1️⃣ Take selfie
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
      });

      // 2️⃣ Get location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      /// This needs to be changed in future 
      // Data shoulde be sent through multipart 
      if(!latitude || !longitude){
        Alert.alert("Error", "Location Permission is required");
        return;
      }
      // 3️⃣ Prepare form data
      const formData = new FormData();
      formData.append("attendanceType", "OFFICE");
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

    //   formData.append("selfieUrl", {
    //     uri: photo.uri,
    // //     name: "selfieUrl.jpg",
    // //     type: "image/jpeg",
    // //   });
    //     formData.append("selfieUrl" , "http://www.ddcrfx.com??4ddsdc")
   
      // 4️⃣ API call
      const res=await axios.post(API_URLS.PUNCH_IN, {
          attendanceType: "OFFICE",
          latitude,
          longitude,
          selfieUrl: "http://example.com/selfie.jpg",
         }, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
      });
      if(res.status === 200){
        Toast.success("Attendance Successfully Uploaded");
      }

     setTimeout(()=>{
       router.replace("/(tabs)");
     }, 2000)
     
    } catch (error) {
      console.log("PunchIn error:", error);
      Alert.alert(
        "Punch In Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Permission loading
  if (!permission || hasLocationPermission === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // ❌ Permission denied
  if (!permission.granted || !hasLocationPermission) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-4">
        <Text className="text-red-600 text-center font-semibold">
          Camera & Location permissions are required to mark attendance.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
    <ToastManager />
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"  
      />
        <View style={{position:"absolute", bottom : 70 , width:"100%"}}
         className="flex-1 justify-end p-6 bg-black/30">
          <TouchableOpacity
            onPress={handlePunchIn}
            disabled={loading}
            className={`py-4 rounded-full items-center ${
              loading ? "bg-gray-400" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Take Selfie & Punch In
              </Text>
            )}
          </TouchableOpacity>
        </View>
     
    </SafeAreaView>
  );
}
