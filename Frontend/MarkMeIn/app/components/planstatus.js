import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const PlanStatus =()=>{
    const {user} =useAuthStore();
    const [isSubscribed , setIsSubscribed]= useState(user.subsriptionId=== null)
    console.log(isSubscribed);
    console.log(user);
    
    return(<></>)
}
export default PlanStatus;