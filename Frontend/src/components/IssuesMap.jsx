import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, X, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSelector } from "react-redux";
import IssueDetailModal from "./IssueDetailModal";

const IssuesMap = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapContainer, setMapContainer] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const problems = useSelector((state) => state.problem.problems);
  const user = useSelector((state) => state.user.user);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.warn("Location access denied:", error);
          setUserLocation({ lat: 22.59672, lng: 72.83455 }); // Default location
        }
      );
    } else {
      setUserLocation({ lat: 22.59672, lng: 72.83455 }); // Default location
    }
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer || !userLocation) return;

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
  }, [mapContainer, userLocation]);

  const initializeMap = () => {
    if (!window.L || !mapContainer || !userLocation) return;

    const L = window.L;
    
    // Create map
    const newMap = L.map(mapContainer).setView([userLocation.lat, userLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add user location marker
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({
        className: 'user-location-marker',
        html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).addTo(newMap);

    // Add popup for user location
    userMarker.bindPopup('<b>Your Location</b><br>You are here').openPopup();

    setMap(newMap);
    setIsMapLoaded(true);
  };

  // Add issue markers when problems change
  useEffect(() => {
    if (!map || !problems || problems.length === 0) return;

    const L = window.L;
    if (!L) return;

    // Clear existing markers
    markers.forEach(marker => {
      if (marker && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });

    const newMarkers = [];

    problems.forEach((problem) => {
      try {
        // Parse location data
        let locationData;
        if (typeof problem.location === 'string') {
          locationData = JSON.parse(problem.location);
        } else {
          locationData = problem.location;
        }

        let lat, lng;
        if (locationData.coordinates?.lat && locationData.coordinates?.lng) {
          lat = locationData.coordinates.lat;
          lng = locationData.coordinates.lng;
        } else if (locationData.lat && locationData.lng) {
          lat = locationData.lat;
          lng = locationData.lng;
        } else {
          return; // Skip if no valid coordinates
        }

        // Create custom icon based on status
        const getStatusColor = (status) => {
          switch (status?.toUpperCase()) {
            case "REPORTED": return "bg-red-500";
            case "IN_PROGRESS": return "bg-yellow-500";
            case "COMPLETED": return "bg-green-500";
            case "REJECTED": return "bg-gray-500";
            default: return "bg-blue-500";
          }
        };

        const statusColor = getStatusColor(problem.status);

        const customIcon = L.divIcon({
          className: 'issue-marker',
          html: `
            <div class="relative">
              <div class="w-6 h-6 ${statusColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              ${problem.voteCount > 0 ? `
                <div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  ${problem.voteCount}
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        });

        // Create marker
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-gray-900 mb-1">${problem.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${problem.description.substring(0, 100)}${problem.description.length > 100 ? '...' : ''}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 text-xs rounded-full ${statusColor} text-white">${problem.status}</span>
              <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">${problem.category}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>${problem.voteCount || 0} votes</span>
              <span>${new Date(problem.createdAt).toLocaleDateString()}</span>
            </div>
            <button 
              onclick="window.openIssueModal('${problem.id}')" 
              class="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add click handler
        marker.on('click', () => {
          setSelectedIssue(problem);
          setIsModalOpen(true);
        });

        newMarkers.push(marker);
      } catch (error) {
        console.error('Error creating marker for problem:', problem.id, error);
      }
    });

    setMarkers(newMarkers);

    // Add global function for popup buttons
    window.openIssueModal = (problemId) => {
      const problem = problems.find(p => p.id.toString() === problemId);
      if (problem) {
        setSelectedIssue(problem);
        setIsModalOpen(true);
      }
    };

  }, [map, problems]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "REPORTED": return "bg-red-100 text-red-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Issues Map</h1>
            <p className="text-gray-600">View all reported issues on an interactive map</p>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Interactive Map</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Reported</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">In Progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Completed</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {problems?.length || 0} Issues
                </Badge>
              </div>
            </div>

            {/* Map */}
            <div 
              ref={setMapContainer}
              className="w-full h-[600px] relative z-0"
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

            {/* Map Controls */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    <span className="text-sm text-gray-600">Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <span className="text-sm text-gray-600">Issue Marker</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Click on markers to view issue details
                </div>
              </div>
            </div>
          </div>

          {/* Issues Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{problems?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Reported</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {problems?.filter(p => p.status === 'REPORTED').length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {problems?.filter(p => p.status === 'IN_PROGRESS').length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {problems?.filter(p => p.status === 'COMPLETED').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIssue(null);
          }}
          isGovOfficial={user?.isGoverment || false}
          onStatusUpdate={(issueId, newStatus) => {
            // Handle status update if needed
            console.log('Status updated:', issueId, newStatus);
          }}
        />
      )}
    </div>
  );
};

export default IssuesMap; 