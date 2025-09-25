"use client";

import { useState, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { RotateCcw, X } from "lucide-react";
import { InAppBrowser } from "@capacitor/inappbrowser";

export default function InAppBrowserPage() {
  const [showIframe, setShowIframe] = useState(false);
  const [url, setUrl] = useState(
    "https://uat-i-inspect.hdfcergo.com/?claimNumber=6v+nyOrQpm3WUnQqiuMBEQ==&Source=OD2+XiVXy5kwYa8ykf7uiw=="
  );
  const iframeRef = useRef(null);

  const openBrowser = async () => {
    // if (Capacitor.isNativePlatform()) {
    //   // Mobile (Capacitor native): open system in-app browser
    //   await Browser.open({ url });
    // } else {
    // Web: show iframe inside div
    // setShowIframe(true);
    // }
    // console.log("InAppBrowser:", InAppBrowser);
    // console.log("Browser plugin:", Browser);
    // console.log("Platform:", Capacitor.getPlatform()); // should print "android" on device
    // console.log("isNativePlatform:", Capacitor.isNativePlatform());

    // if (Capacitor.isNativePlatform()) {
    //   // ✅ Runs on Android/iOS app
    //   try {
    //     await InAppBrowser.openInSystemBrowser({ url: url });
    //   } catch (err) {
    //     console.error("Failed to open in InAppBrowser:", err);
    //   }
    // } else {
    //   // // ✅ Runs on Web (Next.js)
    //   // window.open(url, "_blank", "noopener,noreferrer");

    //   // ✅ Runs on Web (Next.js) → open in current tab
    //   window.open(url, "_self");
    // }

    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url }); // opens inside native WebView overlay
    } else {
      window.open(url, "_self"); // web fallback, open in same tab
    }
  };

  const reload = () => {
    iframeRef.current?.contentWindow?.location.reload();
  };

  return (
    <div className="relative w-full h-full">
      <button
        onClick={openBrowser}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg cursor-pointer"
      >
        CAMCOM Redirection
      </button>

      {showIframe && (
        <div className="fixed top-0 left-0 w-full h-full bg-white shadow-2xl z-50 flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-indigo-600 text-white p-2">
            <div className="flex gap-2 items-center">
              <button
                onClick={reload}
                className="p-1 hover:bg-indigo-500 rounded"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            <span className="font-semibold truncate max-w-[200px]">Camcom</span>
            <button
              onClick={() => setShowIframe(false)}
              className="p-1 hover:bg-red-500 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src={url}
            className="flex-1 w-full border-none"
          />
        </div>
      )}
    </div>
  );
}
