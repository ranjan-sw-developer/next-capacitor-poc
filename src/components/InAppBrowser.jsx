"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { CapacitorWebview } from "@jackobo/capacitor-webview";
import { Geolocation } from "@capacitor/geolocation";
import { Browser } from "@capacitor/browser";

export default function InAppBrowserPage() {
  const [url] = useState(
    "https://uat-i-inspect.hdfcergo.com/?claimNumber=6v+nyOrQpm3WUnQqiuMBEQ==&Source=OD2+XiVXy5kwYa8ykf7uiw=="
  );

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorWebview.addListener("urlChanged", (info) => {
        console.log("WebView URL changed:", info.url);
      });

      CapacitorWebview.addListener("webViewClosed", (info) => {
        console.log("WebView closed at:", info.url);
      });
    }
  }, []);

  const openBrowser = async () => {
    if (Capacitor.isNativePlatform()) {
      await Geolocation.requestPermissions();
      const loc = await Geolocation.getCurrentPosition();

      await CapacitorWebview.openWebView({
        url,
        toolbar: {
          title: "Camcom",
          backgroundColor: "#4F46E5",
          color: "#ffffff",
          // closeButtonAlign: "right",
          isVisible: false,
        },
      });

      // Inject JS to fake navigator.geolocation
      await CapacitorWebview.executeScript({
        code: `
          window.navigator.geolocation = {
            getCurrentPosition: function(success) {
              success({ coords: { latitude: ${loc.coords.latitude}, longitude: ${loc.coords.longitude} } });
            },
            watchPosition: function() {}
          };
        `,
      });

      // await Browser.open({ url }); // opens inside native WebView overlay
    } else {
      // Web fallback
      window.open(url, "_self");
    }
  };

  return (
    <div className="relative w-full h-full">
      <button
        onClick={openBrowser}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg cursor-pointer"
      >
        CAMCOM Redirection
      </button>
    </div>
  );
}
