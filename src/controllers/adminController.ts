import { CreateUserDTO, SignInUserDTO } from "@/types/CreateUserDTO";
import Admin from "@/models/adminModel";
import dbConnect from "@/lib/dbConnect";
import { hashPassword, comparePassword } from "@/utils/securityUtils";
import { handleError } from "@/utils/errorHandler";
import { AppError } from "@/utils/AppError";
import { generateToken } from "@/utils/securityUtils";
import { cookies } from "next/headers";

export async function createAdmin(body: CreateUserDTO) {
  const { name, email, password } = body;

  const hashedPassword = await hashPassword(password);
  await dbConnect();

  try {
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = await generateToken({
      id: newAdmin._id,
      email: newAdmin.email,
      role: "admin",
    });

    return { newAdmin, token };
  } catch (error: unknown) {
    throw new AppError("Failed to create an admin", 500);
  }
}

export async function signInAdmin(body: SignInUserDTO) {
  const { email, password } = body;

  await dbConnect();

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new AppError("Admin not found", 404);
    } else {
      const isMatch = await comparePassword(password, admin.password);
      if (!isMatch) {
        throw new AppError("Invalid password", 401);
      }

      const token = await generateToken({
        id: admin._id,
        email: admin.email,
        role: "admin",
      });

      return { admin, token };
    }
  } catch (error: unknown) {
    throw new AppError("Failed to sign in admin", 500);
  }
}
