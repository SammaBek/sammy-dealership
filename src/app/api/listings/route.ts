import dbConnect from "@/lib/dbConnect";
import Listing from "@/models/listingModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const listings = await Listing.find({ isAvailable: true });

  return NextResponse.json(listings, {
    status: 200,
  });
}

export async function POST(req: Request) {
  await dbConnect();

  const data = await req.json();
}
