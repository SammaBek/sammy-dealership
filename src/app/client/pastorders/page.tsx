"use client";
import { use, useState, useEffect } from "react";
import VehicleComponent from "@/components/VehicleComponent";
import { VehicleDTO } from "@/types/VehiclesDTO";
import { toast } from "react-hot-toast";
export default function PastOrdersPage() {
  const [inventory, setInventory] = useState<VehicleDTO[]>([]);

  useEffect(() => {
    fetch("/api/cars/pastorders")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch past orders");
        }
        return res.json();
      })
      .then((data) => {
        setInventory(data.cars || []);
      })
      .catch((err) => {
        console.error("Past orders fetch error:", err);
        toast.error(err.message); // ✅ shows backend error like "Unauthorized"
      });
  }, []);

  console.log("Fetched Inventory Items:", inventory);
  return (
    <div className="p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-semibold mb-4 font-serif text-gray-500">
        Past Orders
      </h1>

      {inventory?.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-auto overflow-y-auto h-screen w-full">
          {inventory?.map((item) => (
            <VehicleComponent key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
