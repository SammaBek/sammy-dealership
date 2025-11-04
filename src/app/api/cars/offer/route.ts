import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Car from "@/models/carModel";

import { verifyToken } from "@/utils/securityUtils";

import { cookies } from "next/headers";
import { Token } from "aws-sdk";
import mongoose from "mongoose";
import Client from "@/models/clientModel";

export async function POST(req: NextRequest) {
  try {
    const { carId, fullName, offerAmount } = await req.json();
    if (!carId || !fullName || !offerAmount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const tokenStore = await cookies();
    const token = tokenStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized Sign in" },
        { status: 401 }
      );
    }
    const verifiedToken = await verifyToken(token || "");
    if (!verifiedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Received offer for carId:", carId);

    console.log("Verified Token:", verifiedToken);
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    car.offers.push({
      fullName,
      offerAmount,
      status: "pending",
      clientId: new mongoose.Types.ObjectId(verifiedToken.id),
    });

    await car.save();

    return NextResponse.json({ message: "Offer submitted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("Admin token:", token);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized Sign in as Admin" },
      { status: 401 }
    );
  }

  const adminVerified = await verifyToken(token || "");
  console.log("Admin verified token:", adminVerified);
  if (!adminVerified || adminVerified.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized, Sign in As Admin" },
      { status: 401 }
    );
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized Sign in as Admin" },
      { status: 401 }
    );
  }

  try {
    const { carId, offerId, action } = await req.json();

    if (!carId || !offerId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await dbConnect();
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const offer = car.offers.id(offerId);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    offer.status = action === "accept" ? "accepted" : "rejected";

    // Only mark car unavailable if offer is accepted
    if (action === "accept") {
      car.isAvailable = false;
      console.log("car id:", carId);
      console.log("Client ID:", offer.clientId);
      const carObjectId = new mongoose.Types.ObjectId(carId);

      console.log("Car Object ID:", carObjectId);
      const client = await Client.findById(offer.clientId);
      if (!client) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }
      console.log("Client found:", client);
      const updatedClient = await Client.findByIdAndUpdate(
        offer.clientId,
        { $addToSet: { pastOrders: carObjectId } },
        { new: true, upsert: false, strict: false }
      );
      console.log("Updated client:", updatedClient);
    }

    await car.save();

    return NextResponse.json({ message: `Offer ${action}ed` }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Find cars where at least one offer has status "pending"
    const carsWithPendingOffers = await Car.find({
      "offers.status": "pending",
    });

    return NextResponse.json({ cars: carsWithPendingOffers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
