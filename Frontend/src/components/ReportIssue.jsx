import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Top from "./Top";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useDispatch } from "react-redux";
import { addProblem } from "@/redux/problemSlice";

const center = {
  lat: 22.596878,
  lng: 72.83455,
};

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(center);
  const [showMarker, setShowMarker] = useState(false);
  const [mapContainer, setMapContainer] = useState(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (map) {
        map.remove();
      }
    };
  }, [mapContainer]);

  const initializeMap = () => {
    if (!window.L || !mapContainer) return;

    const L = window.L;
    
    // Create map
    const newMap = L.map(mapContainer).setView([center.lat, center.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add click handler for location selection
    newMap.on('click', (e) => {
      const newLocation = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      setLocation(newLocation);
      setShowMarker(true);
      
      // Add marker at clicked location
      if (window.selectedMarker) {
        newMap.removeLayer(window.selectedMarker);
      }
      
      window.selectedMarker = L.marker([newLocation.lat, newLocation.lng], {
        icon: L.divIcon({
          className: 'selected-location-marker',
          html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
      }).addTo(newMap);
    });

    setMap(newMap);
    setIsMapLoaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !image ||
      !showMarker ||
      !category
    ) {
      toast.error(
        "Please fill all fields, select a category, and select a location"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isAnonymous", isAnonymous);
      formData.append("image", image);
      formData.append("location", JSON.stringify(location));

      const res = await axios.post(
        `${BASE_URL}/issue/upload-problem`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setShowSuccess(true);
        dispatch(addProblem(res.data.message));
        setTimeout(() => {
          navigate("/home");
        }, 500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          setShowMarker(true);
          
          // Update map view and add marker
          if (map && window.L) {
            const L = window.L;
            map.setView([newLocation.lat, newLocation.lng], 15);
            
            // Remove existing marker
            if (window.selectedMarker) {
              map.removeLayer(window.selectedMarker);
            }
            
            // Add new marker
            window.selectedMarker = L.marker([newLocation.lat, newLocation.lng], {
              icon: L.divIcon({
                className: 'selected-location-marker',
                html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 24]
              })
            }).addTo(map);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Failed to get your location. Please select manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Report Public Issues,
              <br />
              Improve Your City!
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl mt-6 max-w-2xl mx-auto text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Help make your community better by reporting infrastructure
              issues. Our AI-powered platform ensures quick response to your
              concerns.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden"
          >
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Top
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  handleImageUpload={handleImageUpload}
                  image={image}
                  category={category}
                  setCategory={setCategory}
                  isAnonymous={isAnonymous}
                  setIsAnonymous={setIsAnonymous}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Location
                      </h3>
                      <p className="text-sm text-gray-600">
                        Click on the map to place a marker
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-2"
                      variant="outline"
                    >
                      <Navigation className="w-4 h-4" />
                      Use My Location
                    </Button>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <div 
                      ref={setMapContainer}
                      className="w-full h-[400px] relative"
                    >
                      {!isMapLoaded && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 font-medium">Loading Map...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>
                      Selected coordinates: {location.lat.toFixed(6)},{" "}
                      {location.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-6 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Report...</span>
                    </div>
                  ) : (
                    "Submit Issue Report"
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Submitting Your Report
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Please wait while we process your submission...
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                  <motion.div
                    className="h-1.5 rounded-full bg-blue-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-center text-gray-900">
                Report Submitted Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600 mt-2">
                Your issue has been reported successfully. You will be
                redirected shortly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-6">
              <motion.div
                className="h-1.5 rounded-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      {!isMapLoaded && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600 font-medium">Loading Map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportIssue;
