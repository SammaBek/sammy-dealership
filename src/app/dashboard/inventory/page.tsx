
import VehicleComponent from "@/components/VehicleComponent";
import { VehicleDTO } from "@/types/VehiclesDTO";

export default async function InventoryPage() {

  // fetch inventory with revalidation/caching
const res = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/cars`,
  { next: { revalidate: 60 } }
);
  const inventory: VehicleDTO[] = await res.json();
   
  console.log("Fetched Inventory Items:", inventory);
  return (
    <div className="p-6 flex flex-col h-screen ">
      <span className="sm:text-2xl font-semibold mb-4 font-serif text-gray-500 text-sm text-center">
        {` Sammy's Dealership Inventory`}
      </span>

      {inventory.length === 0 ? (
        <p>No inventory found.</p>
      ) : (
        <div className="grid grid-col sm:grid-cols-2 xl:grid-cols-3 gap-6 scroll-auto overflow-y-auto h-screen">
          {inventory.map((item:VehicleDTO) => (
            <VehicleComponent key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
