import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Car from "@/models/carModel";
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Find cars where at least one offer has status "accepted"
    const carsWithPendingOffers = await Car.find({
      "offers.status": "accepted",
    });

    return NextResponse.json({ cars: carsWithPendingOffers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
