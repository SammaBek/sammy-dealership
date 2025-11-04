import Car from "@/models/carModel";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createCar } from "@/controllers/carsController";
import { handleError } from "@/utils/errorHandler";

export async function GET() {
  try {
    await dbConnect();
    const cars = await Car.find({ isAvailable: true });
    return NextResponse.json(cars, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  try {
    console.log("Creating car with body:", body);
    const newCar = await createCar(body);

    return NextResponse.json(
      { newCar: newCar, message: "Car created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    return handleError(error);
  }
}
