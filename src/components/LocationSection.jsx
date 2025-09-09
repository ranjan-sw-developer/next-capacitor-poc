"use client";

import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

const LocationService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      setIsLoading(true);

      if (Capacitor.getPlatform() === "web") {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude.toFixed(6),
              lng: pos.coords.longitude.toFixed(6),
            });
            setIsLoading(false);
          },
          (err) => {
            console.error(err);
            setIsLoading(false);
          }
        );
      } else {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === "granted") {
          const pos = await Geolocation.getCurrentPosition();
          setLocation({
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          });
        } else {
          console.error("Location permission not granted");
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="m-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-xl">
          📍
        </div>
        <h2 className="text-xl font-semibold text-gray-800 m-0">Location</h2>
      </div>

      {location && (
        <div className="bg-gray-100 rounded-xl p-4 mb-5 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">Latitude:</span>
            <span className="text-sm font-semibold text-gray-900 font-mono">
              {location.lat}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">
              Longitude:
            </span>
            <span className="text-sm font-semibold text-gray-900 font-mono">
              {location.lng}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={getLocation}
        disabled={isLoading}
        className={`w-full py-4 px-5 text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
          isLoading
            ? "opacity-70 cursor-not-allowed hover:transform-none"
            : "hover:from-cyan-600 hover:to-blue-700"
        }`}
      >
        {isLoading ? "📍 Getting Location..." : "📍 Get Location"}
      </button>
    </div>
  );
};

export default LocationService;
