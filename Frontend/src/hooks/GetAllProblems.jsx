import { BASE_URL } from '@/lib/constant';
import { setProblems } from '@/redux/problemSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function GetAllProblems() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProblems = async (latitude, longitude) => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/issue/all-problem`, {
          withCredentials: true,
          params: { latitude, longitude }, 
        });

        if (response.data.success) {
          console.log(response.data); // No need for extra {}
          dispatch(setProblems(response.data.message));
        }
      } catch (error) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchProblems(latitude, longitude); // Fetch problems with user location
        },
        () => {
          setError("Location access denied or unavailable");
          fetchProblems(22.596720, 72.834550); // Default location
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      fetchProblems(22.596720, 72.834550); // Default location
    }
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return null; 
}

export default GetAllProblems;
