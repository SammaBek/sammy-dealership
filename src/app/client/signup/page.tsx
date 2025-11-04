"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
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

      const response = await fetch("/api/client/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Response from server:", data);

      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex">
      <div className=" absolute inset-0 -z-0">
        <img
          className=" w-[100%] h-screen object-cover"
          src="/clientbackground4.webp"
          alt="pic"
        />
      </div>

      <div className="absolute  flex flex-col w-[90%] sm:w-[50%] lg:w-[45%] xl:w-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-auto bg-black/20  p-10 rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-center font-bold text-sm md:text-xl font-serif text-gray-50">
          Client Sign Up
        </h2>
        <form
          className=" w-full flex flex-col gap-5 justify-items-center items-center my-auto"
          action=""
          onSubmit={handleSubmit}
        >
          <input
            className=" border border-gray-50 text-gray-50 text-sm md:text-xl rounded h-8 md:h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
          <input
            className=" border border-gray-50 text-gray-50 text-sm md:text-xl rounded h-8 md:h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className=" border border-gray-50 text-gray-50 text-sm md:text-xl rounded h-8 md:h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            className=" border border-gray-50 text-gray-50 text-sm md:text-xl rounded h-8 md:h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="number"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <button
            className="w-full font-bold font-sans text-sm md:text-xl text-gray-50 border p-2 rounded hover:bg-white/25"
            type="submit"
          >
            Sign Up
          </button>

          <Link
            href="/client/signin"
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
