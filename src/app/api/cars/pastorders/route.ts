import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/securityUtils";
import Client from "@/models/clientModel";
import Car from "@/models/carModel";

export async function GET() {
  await dbConnect();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized Sign in " },
      { status: 401 }
    );
  }
  const verifiedToken = await verifyToken(token || "");
  if (!verifiedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("verified token:", verifiedToken);
  const client = await Client.findById(verifiedToken.id).populate("pastOrders");

  console.log("client favorites:", client);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({ cars: client.pastOrders });
}
