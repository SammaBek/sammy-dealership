import { CreateClientDTO, SignInClientDTO } from "types/createClientDTO";
import Client from "models/clientModel";
import dbConnect from "@/lib/dbConnect";
import { hashPassword, comparePassword } from "@/utils/securityUtils";
import { handleError } from "@/utils/errorHandler";
import { AppError } from "@/utils/AppError";
import { generateToken } from "@/utils/securityUtils";
import { cookies } from "next/headers";

export async function createClient(body: CreateClientDTO) {
  const { name, email, password, phone } = body;

  const hashedPassword = await hashPassword(password);
  await dbConnect();

  try {
    const newClient = await Client.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = await generateToken({
      id: newClient._id,
      email: newClient.email,
      role: "client",
    });

    return { newClient, token };
    return newClient;
  } catch (error: unknown) {
    throw new AppError("Failed to create a Client", 500);
  }
}

export async function signInClient(body: SignInClientDTO) {
  const { email, password } = body;

  await dbConnect();

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      throw new AppError("Client not found", 404);
    } else {
      const isMatch = await comparePassword(password, client.password);
      if (!isMatch) {
        throw new AppError("Invalid password", 401);
      }

      const token = await generateToken({
        id: client._id,
        email: client.email,
        role: "client",
      });

      return { client, token };
    }
  } catch (error: unknown) {
    throw new AppError("Failed to sign in Client", 500);
  }
}
