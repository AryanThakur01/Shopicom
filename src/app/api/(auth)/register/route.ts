import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { User, users } from "@/db/schema/users";
import { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const generateJWT = (data: object) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiry = process.env.JWT_LIFETIME as string;
  return jwt.sign(data, jwtSecret, { expiresIn: jwtExpiry });
};
const passwordEncrypter = async (password: string) => {
  const salt = await genSalt(10);
  const hashVal = await hash(password, salt);
  return hashVal;
};

export const POST = async (req: NextRequest) => {
  try {
    // Collect the info provided by user
    const data: User = await req.json();
    data.role = "customer";
    if (!data.email || !data.password)
      throw new Error("Email or Password missing");

    data.password = await passwordEncrypter(data.password);
    const res: User[] = await db.insert(users).values(data).returning();
    const authToken = generateJWT({ id: res[0].id, role: res[0].role });
    cookies().set("Session_Token", authToken);
    return new NextResponse(JSON.stringify(authToken));
  } catch (error) {
    return new NextResponse(JSON.stringify(error));
  }
};
