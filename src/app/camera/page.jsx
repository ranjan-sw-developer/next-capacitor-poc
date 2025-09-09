"use client";

import Header from "@/src/components/Header";
import CameraSection from "../../components/CameraSection";
import Link from "next/link";

export default function CameraPage() {
  return (
    <div>
      <Header />
      <div className="w-full px-[20px] md:px-[200px] p-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800">
        <Link href="/">
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
            ⬅ Back Home
          </button>
        </Link>
        <h2 className="text-xl font-bold mb-4 mt-8">Camera Demo</h2>
        <CameraSection />
      </div>
    </div>
  );
}
