import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false, // 🔑 important

  login: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.clear();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      
    });
  },

  restoreSession: async () => {
    const token = await AsyncStorage.getItem("token");
    const userData = await AsyncStorage.getItem("user");

    if (token && userData) {
      set({
        token,
        user: JSON.parse(userData),
        isAuthenticated: true,
        hydrated: true,
      });
    } else {
      set({hydrated : true})
    }
  },
}));
