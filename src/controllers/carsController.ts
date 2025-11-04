import { CreateCarDTO } from "@/types/CreateCarDTO";
import Car from "@/models/carModel";
import dbConnect from "@/lib/dbConnect";
import { handleError } from "@/utils/errorHandler";
import { AppError } from "@/utils/AppError";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/securityUtils";

export async function createCar(body: CreateCarDTO) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const adminVerified = await verifyToken(token || "");
  if (!adminVerified || adminVerified.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized, Sign in As Admin" },
      { status: 401 }
    );
  }

  const { make, type, year, vin, imageUrls, name, description } = body;

  try {
    const newCar = await Car.create({
      make,
      type,
      year,
      vin,
      imageUrls,
      name,
      description,
    });
  } catch (error: unknown) {
    throw new AppError("Failed to create car", 500);
  }
}
