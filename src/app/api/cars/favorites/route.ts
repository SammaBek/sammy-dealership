import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/securityUtils";
import Client from "@/models/clientModel";
import Car from "@/models/carModel";

import mongoose, { Types } from "mongoose";

export async function PUT(req: NextRequest) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const verifiedToken = await verifyToken(token || "");

  if (!verifiedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { carId } = await req.json();
  const carObjectId = new mongoose.Types.ObjectId(carId);

  const client = await Client.findById(verifiedToken.id);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const alreadyFavorited = client.favoriteCars.some(
    (id: mongoose.Types.ObjectId) =>
      (id as mongoose.Types.ObjectId).equals(carObjectId)
  );

  if (!alreadyFavorited) {
    client.favoriteCars.push(carObjectId);
    await client.save();
  }

  const updatedClient = await Client.findById(client._id).populate(
    "favoriteCars"
  );

  return NextResponse.json({
    message: "Car favorited successfully",
    favorites: updatedClient.favoriteCars,
  });
}

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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

  const client = await Client.findById(verifiedToken.id).populate(
    "favoriteCars"
  );

  console.log("client favorites:", client);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ cars: client.favoriteCars });
}
