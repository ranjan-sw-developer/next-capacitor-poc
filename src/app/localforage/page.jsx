"use client";

import Header from "@/src/components/Header";
import LocalForage from "../../components/LocalForage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { syncNotes } from "@/src/utils/localForageService";
import { toast } from "react-toastify";
import { Network } from "@capacitor/network";

export default function LocalForagePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // guard for SSR
    // Get initial status
    const loadStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    };
    loadStatus();

    // Listen for changes
    const handler = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected);
      console.log("Network status changed", status);

      if (status.connected) {
        // toast.success("✅ You are Online");
        console.log("🔔 Back online, syncing data...");
        syncNotes();
      } else {
        // toast.error("❌ You are Offline");
      }
    });

    return () => {
      // handler.remove(); // cleanup
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="w-full px-[20px] md:px-[200px] p-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800">
        <Link href="/">
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
            ⬅ Back Home
          </button>
        </Link>
        <h2 className="text-xl font-bold mb-4 mt-8">Local Forage Demo</h2>
        <LocalForage isOnline={isOnline} />
      </div>
    </div>
  );
}
