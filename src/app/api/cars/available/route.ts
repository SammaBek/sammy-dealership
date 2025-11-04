import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Car from "@/models/carModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Find cars that are available
    const carsWithPendingOffers = await Car.find({
      isAvailable: true,
    });

    return NextResponse.json({ cars: carsWithPendingOffers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
