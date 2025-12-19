"use client";

import { useEffect, useState } from "react";

export default function NotificationPage() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const res = await fetch("/api/cars/available");
      const cars = await res.json();

      console.log("Available Cars:", cars.cars);

      if (Array.isArray(cars.cars) && cars.cars.length <= 2) {
        console.log("Less than 2 cars available, showing notification.");
        setShowNotification(true);
      }
    };

    checkAvailability();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 font-serif text-gray-500">
        Notifications
      </h1>

      {showNotification && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          Only less than 3 cars are currently available. Please add more cars to
          the inventory.
        </div>
      )}

      {!showNotification && (
        <p className="text-gray-500">No new notifications.</p>
      )}
    </div>
  );
}
