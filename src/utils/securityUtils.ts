import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Please define JWT_SECRET in .env.local");

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateToken(payload: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err || !token) reject(err);
      else resolve(token);
    });
  });
}

// 👇 Custom payload type
export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

// 👇 Type-safe verifyToken
export async function verifyToken(token: string): Promise<DecodedToken | null> {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || typeof decoded === "string") return resolve(null);
      resolve(decoded as DecodedToken);
    });
  });
}
