"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = async () => {
    // 1️⃣ Route prefetch (JS chunk + data)
    router.prefetch("/prefetch");

    // 2️⃣ Navigate after prefetch
    router.push("/prefetch");
  };

  return (
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800">
      <ToastContainer position="top-center" autoClose={2000} />

      <Header />

      <div className="max-w-3xl mx-auto p-6 grid gap-4">
        <Link href="/localforage">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
            Offline Sync Page
          </button>
        </Link>

        <Link href="/camera">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
            Camera Page
          </button>
        </Link>

        <Link href="/location">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
            Location Service Page
          </button>
        </Link>

        <Link href="/notification">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
            Notifications Page
          </button>
        </Link>

        <Link href="/inAppBrowser">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
            Camcom Page
          </button>
        </Link>

        <button
          onClick={handleClick}
          className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
        >
          Prefetch Demo
        </button>
      </div>
    </div>
  );
}
