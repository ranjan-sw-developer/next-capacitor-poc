"use client";

import { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

const NotificationSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const sendNotification = async () => {
    try {
      setIsLoading(true);
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Hello 👋",
            body: "This is a local notification!",
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-gray-800 text-xl">
          🔔
        </div>
        <h2 className="text-xl font-semibold text-gray-800 m-0">
          Notifications
        </h2>
      </div>

      {notificationSent && (
        <div className="bg-green-100 border border-green-300 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-green-800">
          <span className="text-base">✅</span>
          <span>Notification sent successfully!</span>
        </div>
      )}

      <button
        onClick={sendNotification}
        disabled={isLoading}
        className={`w-full py-4 px-5 text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
          isLoading
            ? "opacity-70 cursor-not-allowed hover:transform-none"
            : "hover:from-amber-600 hover:to-orange-700"
        }`}
      >
        {isLoading ? "🔔 Sending..." : "🔔 Send Notification"}
      </button>
    </div>
  );
};

export default NotificationSection;
