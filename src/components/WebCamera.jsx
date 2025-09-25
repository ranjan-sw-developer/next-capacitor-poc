"use client";

import { useEffect, useRef, useState } from "react";

const WebCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    // Request camera access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // 👈 "user" = front camera, "environment" = back
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    startCamera();
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    // Set canvas size to video size
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setCaptured(dataUrl);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {!captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-xl border w-full max-w-md"
          />
          <button
            onClick={capturePhoto}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700"
          >
            📸 Capture
          </button>
        </>
      ) : (
        <>
          <img
            src={captured}
            alt="Captured"
            className="rounded-xl border w-full max-w-md"
          />
          <button
            onClick={() => setCaptured(null)}
            className="px-4 py-2 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-700"
          >
            🔄 Retake
          </button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default WebCamera;
