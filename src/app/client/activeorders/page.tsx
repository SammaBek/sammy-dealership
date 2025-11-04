"use client";
import { use, useState, useEffect } from "react";
import VehicleComponent from "@/components/VehicleComponent";
import { VehicleDTO } from "@/types/VehiclesDTO";
import { toast } from "react-hot-toast";
export default function ActiveOrdersPage() {
  const [inventory, setInventory] = useState<VehicleDTO[]>([]);

  useEffect(() => {
    fetch("/api/cars/activeorders")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch active orders");
        }
        return res.json();
      })
      .then((data) => {
        setInventory(data.cars || []);
      })
      .catch((err) => {
        console.error("Active orders fetch error:", err);
        toast.error(err.message); // ✅ shows backend error like "Unauthorized"
      });
  }, []);

  console.log("Fetched Inventory Items:", inventory);
  return (
    <div className="p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-semibold mb-4 font-serif text-gray-500">
        Active Orders
      </h1>

      {inventory.length === 0 ? (
        <p>No active orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-auto overflow-y-auto h-screen w-full">
          {inventory.map((item) => (
            <VehicleComponent key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
