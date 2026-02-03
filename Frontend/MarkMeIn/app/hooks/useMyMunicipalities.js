import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { API_URLS } from "../config/apiUrl";

/**
 * Fetch municipalities assigned to logged-in employee
 * (primary + extra charge if any)
 */
export const useMyMunicipalities = () => {
  const token = useAuthStore((s) => s.token);

  const [municipalities, setMunicipalities] = useState([]);
  const [munciplaityLoading, setMunicipalityLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if(token){
    fetchMunicipalities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMunicipalities = async () => {
    try {
      setMunicipalityLoading(true);
      setError(null);

      const res = await axios.get(API_URLS.GET_MUNICIPALITIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data ,"IN MUNICIPLAITY HOOK");
      setMunicipalities(res.data.municipalities || []);
    } catch (err) {
      console.log("Fetch municipalities error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to fetch municipality details"
      );
    } finally {
      setMunicipalityLoading(false);
    }
  };

  return {
    municipalities,
    munciplaityLoading,
    error
   
  };
};
