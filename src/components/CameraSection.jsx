"use client";

import { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";

const CameraSection = () => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
      });
      setPhoto(image.dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="m-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl 
                w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white text-xl">
          📸
        </div>
        <h2 className="text-xl font-semibold text-gray-800 m-0">
          Camera Capture
        </h2>
      </div>

      <div className="w-full aspect-square mb-5 rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
        {photo ? (
          <img
            src={photo}
            alt="captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-2 opacity-50">📷</div>
            <p className="text-sm m-0">No photo captured yet</p>
          </div>
        )}
      </div>

      <button
        onClick={takePhoto}
        disabled={isLoading}
        className={`w-full py-4 px-5 text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
          isLoading
            ? "opacity-70 cursor-not-allowed hover:transform-none"
            : "hover:from-indigo-700 hover:to-purple-700"
        }`}
      >
        {isLoading ? "📸 Taking Photo..." : "📸 Take Photo"}
      </button>
    </div>
  );
};

export default CameraSection;
