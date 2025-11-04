"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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

      const response = await fetch("/api/users/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response from server:", data);

      router.push("/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "Signup failed");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex">
      <div className=" absolute inset-0 -z-0">
        <img
          className=" w-[100%] h-screen object-cover"
          src="/lambo.jpg"
          alt="pic"
        />
      </div>

      <div className="absolute  sm:h-[60%]  flex flex-col w-[95%] md:w-[50%] xl:w-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-[55%] bg-white/10 p-6 sm:p-10 rounded-lg shadow-lg border-2 border-white/10">
        <h2 className="text-center font-bold text-xl text-gray-50 font-serif">
          Admin Sign Up
        </h2>
        <form
          className=" w-full flex flex-col gap-5 justify-items-center items-center my-auto"
          action=""
          onSubmit={handleSubmit}
        >
          <input
            className=" border border-gray-50 text-gray-50 rounded h-8 sm:h-10 w-[100%] p-3"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
          <input
            className=" border border-gray-50 text-gray-50 rounded h-8 sm:h-10 w-[100%] p-3"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className=" border border-gray-50 text-gray-50 rounded h-8 sm:h-10 w-[100%] p-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button
            className="w-full border p-2 rounded text-gray-50 hover:bg-white/25"
            type="submit"
          >
            Sign Up
          </button>

          <Link
            href="/user/signin"
            className="text-sm text-gray-200 hover:underline mt-2"
          >
            Have an account? Sign In
          </Link>

          <Link href="/" className="text-sm text-gray-200 hover:underline mt-2">
            Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}
