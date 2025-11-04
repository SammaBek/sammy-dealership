import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/adminModel";
import { signInClient } from "controllers/clientController";
import { handleError } from "@/utils/errorHandler";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  try {
    const { client, token } = await signInClient(body);

    const response = NextResponse.json(
      { client, message: "Client signed in successfully" },
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
