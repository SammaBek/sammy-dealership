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

export async function generateToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err || !token) reject(err);
      else resolve(token);
    });
  });
}

// 👇 Type-safe version (no `any`)
export async function verifyToken(token: string): Promise<string | JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded as string | JwtPayload);
    });
  });
}
