import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Car from "@/models/carModel";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/securityUtils";

export async function GET(req: NextRequest) {
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
  const clientId = verifiedToken.id;
  const activeOffers = await Car.find({
    offers: {
      $elemMatch: {
        clientId: clientId,
        status: "pending",
      },
    },
  });

  return NextResponse.json({ cars: activeOffers });
}
