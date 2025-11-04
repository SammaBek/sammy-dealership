"use client";
import { use, useState, useEffect } from "react";
import VehicleComponent from "@/components/VehicleComponent";
import { VehicleDTO } from "@/types/VehiclesDTO";
export default function SalesPage() {
  const [inventory, setInventory] = useState<VehicleDTO[]>([]);

  useEffect(() => {
    fetch("/api/cars/sales")
      .then((res) => res.json())
      .then((data) => setInventory(data.cars));
  }, []);

  console.log("Fetched Inventory Items:", inventory);
  return (
    <div className="p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-semibold mb-4 font-serif text-gray-500">
        Sales Management
      </h1>

      {inventory.length === 0 ? (
        <p>No Sold items found.</p>
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
