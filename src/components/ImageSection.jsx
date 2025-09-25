"use client";

import { useState } from "react";

import React from "react";

const ImageSection = ({ photos }) => {
  const [selected, setSelected] = useState(photos[0].id);

  const currentPhoto = photos.find((p) => p.id === selected);
  return (
    <div>
      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* User Selection Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            Data Prefetching
          </h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Data
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(Number(e.target.value))}
              className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900"
            >
              <option value="">Choose a data...</option>
              {photos.slice(0, 5).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.title}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            User data fetched and cached on the server for instant loading
          </p>
        </div>

        {/* Asset Prefetching Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              3
            </span>
            Asset Prefetching
          </h2>
          <div className="bg-gray-50 rounded-xl p-6">
            {currentPhoto && (
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="w-full max-w-md mx-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            )}
            <p className="text-sm text-gray-500 mt-4 text-center">
              Image assets prefetched for optimal loading performance
            </p>
          </div>
        </div>

        {/* Performance Benefits */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⚡ Performance Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-1">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Server-Side Caching</p>
                <p className="text-sm text-gray-600">
                  Data fetched once and cached
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-1">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Asset Optimization</p>
                <p className="text-sm text-gray-600">
                  Images loaded efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
