import { BASE_URL } from "@/lib/constant";
import { setProblems } from "@/redux/problemSlice";
import { showApiError, showApiWarning } from "@/utils/api-error-handler";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";

function GetAllProblems() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);

  const fetchProblems = async (latitude, longitude) => {
    if (!isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/issue/all-problem`, {
        withCredentials: true,
        params: { latitude, longitude },
        timeout: 10000, // 10 second timeout
      });

      if (response.data.success) {
        dispatch(setProblems(response.data.message));
        setHasLoaded(true);

        // Only show warning if no problems found and this is the first load
        if (!response.data.message || response.data.message.length === 0) {
          showApiWarning(
            "No issues found in your area",
            "Be the first to report an issue!"
          );
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch problems");
      }
    } catch (error) {
      const errorMessage = showApiError(error, "Failed to load issues");
      setError(errorMessage);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Only fetch on initial load, not on retries
    if (hasLoaded) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchProblems(latitude, longitude);
        },
        (locationError) => {
          console.warn("Location access denied or unavailable:", locationError);
          showApiWarning(
            "Using default location",
            "Location access denied. Using default coordinates."
          );
          fetchProblems(22.59672, 72.83455); // Default location
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      showApiWarning(
        "Location not supported",
        "Your browser doesn't support geolocation. Using default location."
      );
      fetchProblems(22.59672, 72.83455); // Default location
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [dispatch, retryCount, hasLoaded]);

  // Don't render anything - this hook just manages data fetching
  return null;
}

export default GetAllProblems;
