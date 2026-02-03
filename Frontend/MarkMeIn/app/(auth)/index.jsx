import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ToastManager, { Toast } from 'toastify-react-native'
import {API_URLS} from "../config/apiUrl"
import axios from 'axios'
import { useNavigation } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  
  const handleLogin = () => {
    if (mobile.length !== 10) {
       Toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
     Toast.error("Password cannot be empty");
      return;
    }
    const loginData = { mobile, password };
    // console.log("Logging in with data:", loginData);
    // Proceed with login logic (e.g., API call)
    const backendCallForLogin = async()=>{
      setIsLoading(true);
      try{
        const response = await axios.post(`${API_URLS.EMPLOYEE_LOGIN}` , loginData);
        if(response.status === 200){
          console.log("Login successful:", response.data.employee);
          login(response.data.employee , response.data.token);
          navigation.replace("(tabs)");  
          // Toast.success("Login successful!");
        }
      }
      catch(error){
        
        Toast.error("Login failed. Please try again.");
      }
      finally{
        setIsLoading(false);
      }
    }
    backendCallForLogin();
  };

  return (
    // <KeyboardAvoidingView
    //   className="flex-1"
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    // >
      <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardOpeningTime={0}
      contentContainerStyle={{ flexGrow: 1 }}
    >
    <ToastManager />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white flex-1"
      >
        <View className="justify-center px-6 pt-10 mt-10">
          {/* Logo / Title */}
          <View className="w-full mb-4">
            {/* Here we will logo and business name */}
            <Image
            source={require("../../assets/images/logo.png")}
            className="w-32 h-32 self-center"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-primary text-center">
            Mark Me In
          </Text>
          </View>
          
          <Text className="text-center text-gray-600 mt-1 mb-10">
            Employee Attendance
          </Text>
          <View className="flex row items-cneter">
            <Image
              source={require("../../assets/images/Company.gif")}
              className="w-100 h-80 self-center mb-6"
              resizeMode="contain"
            />
          </View>

          {/* Mobile Number */}
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />

          {/* Password */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 mb-6">
            <TextInput
              className="flex-1 py-4 text-base"
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-xl"
            onPress={handleLogin}
          >
            <Text className="text-white text-center text-base font-semibold">
              {isLoading ? <ActivityIndicator color ="white" /> : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}
