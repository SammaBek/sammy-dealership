"use client";
import { set } from "mongoose";
import { use, useState } from "react";
import { VehicleDTO } from "@/types/VehiclesDTO";
import { MyFormatDate } from "@/utils/MyDateFormatter";
import { useRouter } from "next/navigation";

type VehicleFormProps = {
  vehicle?: VehicleDTO; // optional for "create" mode
  onCancel?: () => void;
  isModal?: boolean;
};

export default function AddVehicle({
  isModal,
  onCancel,
  vehicle,
}: VehicleFormProps) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(
    vehicle?.isAvailable ?? null
  );

  const [isOnSale, setIsOnSale] = useState<boolean | null>(
    vehicle?.isOnSale ?? null
  );

  const [imageMode, setImageMode] = useState<"existing" | "new">("existing");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  console.log(vehicle);

  const [formData, setFormData] = useState({
    name: vehicle ? vehicle.name : "",
    make: vehicle ? vehicle.make : "",
    description: vehicle ? vehicle.description : "",
    type: vehicle ? vehicle.type : "",
    year: vehicle ? vehicle.year : "",
    vin: vehicle ? vehicle.vin : "",
    images: [] as File[],
    price: vehicle ? vehicle.price : "",
    isOnSale: vehicle ? vehicle.isOnSale : false,
    isAvailable: vehicle ? vehicle.isAvailable : true,
    promoStartDate: vehicle ? vehicle.promoStartDate : "",
    promoEndDate: vehicle ? vehicle.promoEndDate : "",
    promoPercentage: vehicle ? vehicle.promoPercentage : 0,
  });

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageMode("new");
    const files = Array.from(e.target.files || []);
    if (files) {
      setFormData((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changeMainPicHandler = (index: number) => {
    setMainImageIndex(index);
  };

  const handleIsOnSaleChange = (value: true | false) => {
    setIsOnSale(value);
  };

  const handleIsAvailableChange = (value: true | false) => {
    setIsAvailable(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicleData = new FormData();
      if (vehicle) {
        vehicleData.append("_id", vehicle?._id ?? "");
      }
      vehicleData.append("name", formData.name);
      vehicleData.append("make", formData.make);
      vehicleData.append("description", formData.description);
      vehicleData.append("type", formData.type);
      vehicleData.append("year", String(formData.year));
      vehicleData.append("vin", formData.vin);
      vehicleData.append("isOnSale", isOnSale?.toString() || "false");
      vehicleData.append("isAvailable", isAvailable?.toString() || "true");
      vehicleData.append("promoStartDate", formData.promoStartDate);
      vehicleData.append("promoEndDate", formData.promoEndDate);
      vehicleData.append(
        "promoPercentage",
        formData.promoPercentage.toString()
      );

      vehicleData.append("price", formData.price.toString());

      if (imageMode === "new") {
        formData.images.forEach((image) => {
          vehicleData.append("imageUrls", image);
        });
      } else {
        vehicleData.append(
          "existingImageUrls",
          JSON.stringify(vehicle?.imageUrls)
        );
      }

      console.log("Submitting Vehicle Data:", vehicleData);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: vehicleData,
      });

      console.log("Vehicle Data Submitted:", vehicleData);

      const data = await response.json();

      console.log("Response from server:", data);

      router.refresh();
      router.push("/dashboard/inventory");
      onCancel && onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div
      className={` flex-col  h-screen md:flex p-10 gap-20  ${vehicle ? "bg-gray-50 w-[98%] md:w-[80%] top-10 absolute rounded-lg overflow-y-auto " : "relative w-full"} `}
    >
      <div className="flex gap-10 flex-col w-full  md:w-[60%] h-screen">
        <h1 className=" font-serif font-semibold text-gray-500">
          Add New Vehicle
        </h1>

        <div className="flex flex-col w-full gap-5 ">
          <h3 className=" font-serif  text-gray-500">General Information</h3>

          <div className=" h-auto shadow-lg text-sm font-sans text-gray-500 p-5 gap-4 flex flex-col w-[100%] ">
            <div>
              <h3>Vehicle Name</h3>
              <input
                className=" border border-gray-300 rounded p-2 w-[100%] mt-2"
                type="text"
                name="name"
                placeholder="Enter vehicle name"
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <h3>Vehicle Description</h3>
              <textarea
                className=" border border-gray-300 rounded p-2 w-[100%] mt-2 h-24"
                name="description"
                placeholder="Enter vehicle description"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col text-sm">
            <label htmlFor="">Vehicle Type</label>
            <select
              name="type"
              id="type"
              className=" border border-gray-300 rounded p-2  mt-2"
              onChange={handleChange}
              value={formData.type}
            >
              <option value="">vehicle type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="coupe">Coupe</option>
            </select>
          </div>

          <div className="flex flex-col text-sm">
            <label htmlFor="">Vehicle Make</label>
            <select
              name="make"
              id="make"
              className=" border border-gray-300 rounded p-2  mt-2"
              onChange={handleChange}
              value={formData.make}
            >
              <option value="">Select Make</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Acura">Acura</option>
              <option value="Nissan">Nissan</option>
              <option value="Tesla">Tesla</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Cheverolet">Cheverolet</option>
              <option value="BMW">BMW</option>
            </select>
          </div>

          <div className="flex flex-col text-sm">
            <label htmlFor="">Select Year</label>
            <select
              name="year"
              id="year"
              className=" border border-gray-300 rounded p-2  mt-2"
              onChange={handleChange}
              value={formData.year}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col text-sm">
            <h3>Vin Number</h3>
            <input
              className=" border border-gray-300 rounded p-2 mt-2"
              type="text"
              name="vin"
              placeholder="VIN number"
              onChange={handleChange}
              value={formData.vin}
            />
          </div>

          <div className="flex flex-col text-sm">
            <h3>Price</h3>
            <input
              className=" border border-gray-300 rounded p-2 mt-2"
              type="number"
              name="price"
              placeholder="Enter Price"
              onChange={handleChange}
              value={formData.price}
            />
          </div>

          <div className="flex flex-col text-sm">
            <label className="text-gray-500 font-sans">Is available</label>
            <div className="flex my-auto">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAvailable === true}
                  onChange={() => handleIsAvailableChange(true)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span>Yes</span>
              </label>

              <label className="flex items-center space-x-2 ml-2">
                <input
                  type="checkbox"
                  checked={isAvailable === false}
                  onChange={() => handleIsAvailableChange(false)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col text-sm">
            <label className="text-gray-500 font-sans">Is on Sale</label>
            <div className="flex my-auto text-gray-500">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isOnSale === true}
                  onChange={() => handleIsOnSaleChange(true)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span>Yes</span>
              </label>

              <label className="flex items-center space-x-2 ml-2">
                <input
                  type="checkbox"
                  checked={isOnSale === false}
                  onChange={() => handleIsOnSaleChange(false)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="text-gray-500 font-sans flex flex-col text-sm">
            <h3>Promo %</h3>
            <input
              className={` border border-gray-300 rounded p-2 w-[100%] mt-2 ${isOnSale ? "" : "opacity-50 cursor-not-allowed"}`}
              type="text"
              name="promoPercentage"
              placeholder="Enter promo%"
              onChange={handleChange}
              disabled={!isOnSale}
              value={formData.promoPercentage}
            />
          </div>

          <div className={`text-gray-500 font-sans text-sm `}>
            <h3>Promo Start</h3>
            <input
              className={` border border-gray-300 rounded p-2 w-[100%] mt-2 ${isOnSale ? "" : "opacity-50 cursor-not-allowed"}`}
              type="date"
              name="promoStartDate"
              onChange={handleChange}
              disabled={!isOnSale}
              value={MyFormatDate(formData.promoStartDate)}
            />
          </div>

          <div className="flex gap-3 ">
            <div className="text-gray-500 font-sans text-sm">
              <h3>Promo End</h3>
              <input
                className={` border border-gray-300 rounded p-2 w-[100%] mt-2 ${isOnSale ? "" : "opacity-50 cursor-not-allowed"}`}
                type="date"
                name="promoEndDate"
                onChange={handleChange}
                disabled={!isOnSale}
                value={MyFormatDate(formData.promoEndDate)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col text-gray-500 text-sm gap-4 md:w-[95%] xl:w-[65%] w-full">
          {formData.images.length > 0 && (
            <img
              src={
                vehicle
                  ? vehicle.imageUrls[mainImageIndex]
                  : URL.createObjectURL(formData.images[mainImageIndex])
              }
              alt="main-preview"
              className="w-full h-64 object-cover rounded mb-4"
            />
          )}
          <label className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center text-sm">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <div className="flex gap-2 w-full overflow-x-auto">
            {formData.images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded"
                onClick={() => changeMainPicHandler(index)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-x-6">
          <button
            onClick={handleSubmit}
            className=" bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            {`${vehicle ? "Edit Vehicle" : "Add Vehicle"}`}
          </button>

          {vehicle && (
            <button
              onClick={() => onCancel?.()}
              className=" bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              {" "}
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
