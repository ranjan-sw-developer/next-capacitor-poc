"use client";

import { useState } from "react";
import { Download, ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";

const ImageContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageUrl =
    "https://i.pinimg.com/originals/7c/3a/bb/7c3abbd4ab71537e486254a933577d86.jpg";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg">
            🖼️
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Image Gallery
          </h2>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
          <div className="relative group overflow-hidden rounded-xl shadow-2xl bg-white">
            <img
              src={imageUrl}
              alt="Gallery Image"
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              style={{ transform: `scale(${zoom})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 transition-all hover:scale-110 shadow-lg"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 transition-all hover:scale-110 shadow-lg"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 transition-all hover:scale-110 shadow-lg"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg"
                title="Download"
              >
                <Download size={20} />
              </button>
            </div>

            {zoom !== 1 && (
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={resetZoom}
                  className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gray-800 text-sm font-medium transition-all hover:scale-105 shadow-lg"
                >
                  Reset Zoom
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Beautiful Landscape
                </p>
                <p className="text-xs text-gray-600">High resolution image</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">
                Zoom: {Math.round(zoom * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">HD</p>
            <p className="text-xs text-gray-600 mt-1">Quality</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">4K</p>
            <p className="text-xs text-gray-600 mt-1">Resolution</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">JPG</p>
            <p className="text-xs text-gray-600 mt-1">Format</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <X size={24} />
          </button>

          <div className="max-w-7xl max-h-full overflow-auto">
            <img
              src={imageUrl}
              alt="Gallery Image Fullscreen"
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Download size={20} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContainer;
