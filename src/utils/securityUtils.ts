import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env;

export async function hashPassword(password: string): Promise<string> {
  {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
      (err, token) => {
        if (err || !token) reject(err);
        else resolve(token);
      }
    );
  });
}

export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
