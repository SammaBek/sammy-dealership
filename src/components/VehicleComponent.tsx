"use client";
import AddVehicle from "@/app/dashboard/vehicle/new/page";
import { VehicleDTO } from "@/types/VehiclesDTO";
import { act, use, useState } from "react";
import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";
import path from "path";
import { off } from "process";
import toast from "react-hot-toast";

export default function VehicleComponent(data: VehicleDTO) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isModal, setIsModal] = useState(false);

  const [offerModal, setOfferModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    fullName: "",
    offerAmount: "",
    carId: data._id,
  });

  const handleIsModal = () => {
    setIsModal(true);
  };
  const offerModalHandler = () => {
    setOfferModal(!offerModal);
  };

  const offerStatusHandler = async (props: {
    action: "accept" | "reject";
    offerId: string;
  }) => {
    const response = await fetch("/api/cars/offer", {
      method: "PUT",
      body: JSON.stringify({
        action: props.action,
        carId: data._id,
        offerId: props.offerId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/dashboard/inventory");
    } else {
      const errorData = await response.json();
      toast.error(
        errorData.error || "Failed to update offer status, Sign in as Admin"
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Form Data Submitted:", formData);

      const response = await fetch("/api/cars/offer", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response from server:", data);

      setOfferModal(false);
      router.push("/");
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const addToFavoriteHandler = async () => {
    try {
      const response = await fetch("/api/cars/favorites", {
        method: "PUT",
        body: JSON.stringify({ carId: data._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Failed to update favorite");
        throw new Error("Failed to update favorite");
      }
      const result = await response.json();
      console.log("Favorite updated:", result);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <>
      <div className=" flex flex-col rounded-lg border border-gray-300 p-4 shadow-md max-h-[65vh]">
        <img
          className=" h-36 sm:h-56 object-cover rounded-lg"
          src={data.imageUrls[imgIndex]}
          alt=""
        />

        <div className=" flex h-10 scroll-auto overflow-x-auto mt-3 gap-x-2 ">
          {data.imageUrls.length > 0 &&
            pathname != "/dashboard/listings" &&
            data.imageUrls.map((img, index) => (
              <img
                onClick={() => setImgIndex(index)}
                className=" object-cover rounded-lg"
                src={img}
                key={index}
              />
            ))}
        </div>

        <h2 className="text-sm md:text-lg text-gray-500  mt-2">{data.name}</h2>

        {pathname != "/dashboard/listings" && (
          <>
            <p className=" text-gray-500 text-sm md:text-lg ">
              Make: {data.make} - {data.year}
            </p>
            <p className=" text-gray-500 text-sm md:text-lg">Vin: {data.vin}</p>
            <p className=" mt-2 text-gray-500">{data.description}</p>
            <p className=" font-bold text-gray-700 text-sm md:text-lg mt-2">
              Price: ${data.price}
            </p>

            <div className=" flex gap-x-4">
              {pathname?.startsWith("/dashboard") && (
                <span className="hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-500 my-auto"
                    onClick={handleIsModal}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </span>
              )}

              {pathname === "/" && (
                <span className="hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-500 my-auto cursor-pointer"
                    onClick={addToFavoriteHandler}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </span>
              )}
            </div>
          </>
        )}

        {pathname === "/dashboard/listings" &&
          data.offers.length > 0 &&
          data.offers.map((offer) => (
            <div key={offer._id} className="mt-2 flex ">
              {offer.status === "pending" && (
                <>
                  <p className="text-gray-500 text-sm md:text-lg">
                    Offer by: {offer.fullName}
                  </p>
                  <div className="flex gap-x-4 ml-3 my-auto">
                    <span className="rounded-full bg-green-800 hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-50 my-auto cursor-pointer"
                        onClick={() =>
                          offerStatusHandler({
                            action: "accept",
                            offerId: offer._id,
                          })
                        }
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </span>

                    <span className="rounded-full bg-red-800 hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-gray-50 my-auto cursor-pointer"
                        onClick={() =>
                          offerStatusHandler({
                            action: "reject",
                            offerId: offer._id,
                          })
                        }
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}

        <div className="flex gap-x-4">
          {pathname === "/" && (
            <button
              onClick={offerModalHandler}
              className="text-gray-50 bg-gray-500 rounded-lg px-2 py-1 text-sm mt-1 hover:bg-gray-600 transition-colors duration-300"
            >
              Make an Offer
            </button>
          )}
        </div>
      </div>

      {isModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center h-screen items-center scroll-auto overflow-y-auto px-28">
          <AddVehicle vehicle={data} onCancel={() => setIsModal(false)} />
        </div>
      )}

      {offerModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center overflow-y-auto px-4">
          <div className="flex flex-col items-center gap-5 w-full max-w-md bg-transparent p-6 rounded">
            <h1 className="font-serif text-center text-gray-50 text-sm md:text-lg">
              Make an Offer
            </h1>

            <input
              className="border border-gray-50 rounded h-10 w-44 md:w-[80%] p-3 text-gray-50"
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <input
              className="border border-gray-50 rounded h-10 w-44 md:w-[80%] p-3 text-gray-50"
              type="number"
              name="offerAmount"
              placeholder="Make Offer"
              onChange={handleChange}
            />

            <div className="flex gap-x-4 justify-center w-full">
              <button
                onClick={handleSubmit}
                className="bg-green-500 rounded-lg text-sm px-4 py-2 text-white"
              >
                Make Offer
              </button>
              <button
                onClick={offerModalHandler}
                className="bg-red-500 rounded-lg text-sm px-4 py-1 text-white"
              >
                Cancel Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
