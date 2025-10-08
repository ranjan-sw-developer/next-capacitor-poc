"use client";

import CarViewer from "@/src/components/CarViewer";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [carType, setCarType] = useState("suv");
  const [selectedPart, setSelectedPart] = useState(null);
  const [partHistory, setPartHistory] = useState([]);

  const handlePartClick = (partName) => {
    setSelectedPart(partName);
    setPartHistory((prev) => {
      const newHistory = [
        { name: partName, time: new Date().toLocaleTimeString() },
        ...prev,
      ];
      return newHistory.slice(0, 5); // Keep only last 5
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-4 py-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            3D Car Explorer
          </h1>
          <Link href="/">
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
              ⬅ Back Home
            </button>
          </Link>
          {/* <div className="flex flex-wrap gap-2 md:gap-3">
            {["SUV", "Sedan", "Hatchback"].map((type) => (
              <button
                key={type}
                onClick={() => setCarType(type.toLowerCase())}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  carType === type.toLowerCase()
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* 3D Viewer */}
        <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="h-64 md:h-96 lg:h-full">
            <CarViewer carType={"kia_sportage"} onPartClick={handlePartClick} />
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:w-80 xl:w-96 flex flex-col gap-4">
          {/* Selected Part Display */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Selected Part</h2>
            </div>

            {selectedPart ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">
                    {selectedPart}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Click on car parts to explore
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">
                  Click on any car part to view details
                </p>
              </div>
            )}
          </div>

          {/* History */}
          {partHistory.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recent Clicks
              </h3>
              <div className="space-y-2">
                {partHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors"
                  >
                    <span className="text-slate-200 font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white">Rotate:</strong> Click and drag
                  <br />
                  <strong className="text-white">Zoom:</strong> Scroll or pinch
                  <br />
                  <strong className="text-white">Pan:</strong> Right-click and
                  drag
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
