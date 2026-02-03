import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";


export const useRemoteAttendanceStatus =()=>{
    const {token} = useAuthStore();
    const [remoteAttendance , setRemoteAttendance] = useState(null);
    const [remoteLoading ,setRemoteLoading] = useState(true);


useEffect(()=>{
    fetchRemoteAttendanc();
},[setRemoteLoading])

/// API Call for tdoay 
const fetchRemoteAttendanc = async()=>{
    try{
         const res = await axios.get(`${API_URLS.REMOTEATTENDANCE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        
        if(res.status === 200){
        
        setRemoteAttendance(res.data.monthlyRemoteCount);
    }
    }
    catch(err){
        console.log("API Error in remote", err)
    }
    finally{
        setRemoteLoading(false);
    }
}
return { remoteAttendance , remoteLoading}
}