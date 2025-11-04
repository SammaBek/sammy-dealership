"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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

      const response = await fetch("/api/client/signin", {
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

      <div className="absolute  flex flex-col w-[90%] sm:w-[50%] lg:w-[45%] xl:w-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-[50%] bg-black/20  p-10 rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-center font-bold text-xl font-serif text-gray-50">
          Client Sign In
        </h2>
        <form
          className=" w-full flex flex-col gap-5 justify-items-center items-center my-auto"
          action=""
          onSubmit={handleSubmit}
        >
          <input
            className=" border border-gray-50 text-gray-50 rounded h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className=" border border-gray-50 text-gray-50 rounded h-10 w-[100%] p-3 placeholder:text-gray-50"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button
            className="w-full font-bold font-sans border p-2 rounded hover:bg-white/25 text-gray-50"
            type="submit"
          >
            Sign In
          </button>

          <Link
            href="/client/signup"
            className="text-sm text-gray-200 hover:underline mt-2"
          >
            Don't have an account? Sign Up
          </Link>
          <Link href="/" className="text-sm text-gray-200 hover:underline mt-2">
            Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}
