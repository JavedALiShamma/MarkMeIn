import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config/apiUrl";
import { useAuthStore } from "../store/useAuthStore";

export const useSubscriptionStatus = () => {
  const token = useAuthStore((s) => s.token);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, [loading]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_URLS.SUBSCRIPTION}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Respose is in subscption ", res.data);
      setSubscription(res.data);
    } catch (err) {
      console.log("Subscription status error", err);
    } finally {
      setLoading(false);
    }
  };

  return { subscription, loading };
};
