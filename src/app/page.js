"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800">
      <ToastContainer position="top-center" autoClose={2000} />

      <Header />

      <div className="max-w-3xl mx-auto p-6 grid gap-4">
        <Link href="/localforage">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            LocalForage Demo
          </button>
        </Link>

        <Link href="/camera">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            Camera Demo
          </button>
        </Link>

        <Link href="/location">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            Location Service
          </button>
        </Link>

        <Link href="/notification">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            Notifications
          </button>
        </Link>

        <Link href="/inAppBrowser">
          <button className="w-full bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            In App Browser
          </button>
        </Link>
      </div>
    </div>
  );
}
