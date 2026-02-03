import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";

export const useAttendanceStatus =()=>{
   const token = useAuthStore((s) => s.token);
   const [todayAttendance , setTodayAttendance] =useState(null);
   const [todayLoading , setTodayLoading] =useState(true);
   
    useEffect(()=>{
        fetchTodayAttendance();
    },[todayLoading])

   // API Call for today
   const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get(API_URLS.TODAY_ATTENDANCE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTodayAttendance(res.data);
    } catch (err) {
      console.log("Today attendance API error:", err);
    } finally {
      setTodayLoading(false);
    }
  };
  return {todayAttendance , todayLoading};
};