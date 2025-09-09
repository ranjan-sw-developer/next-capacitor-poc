"use client";

import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] p-5 shadow-xl shadow-indigo-500/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 px-5">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
          📱
        </div>
        <h1 className="text-white text-2xl font-bold m-0">HDFC MCP POC</h1>
      </div>
    </header>
  );
};

export default Header;
