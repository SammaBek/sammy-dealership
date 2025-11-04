import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createClient } from "controllers/clientController";
import { handleError } from "@/utils/errorHandler";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  try {
    const { newClient, token } = await createClient(body);

    const response = NextResponse.json(
      { newClient: newClient, message: "Client created successfully" },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1, //1 hr
    });

    return response;
  } catch (error: unknown) {
    return handleError(error);
  }
}
