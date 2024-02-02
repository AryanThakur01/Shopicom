import { User, users } from "@/db/schema/users";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";

const generateJWT = (data: object) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiry = process.env.JWT_LIFETIME as string;
  return jwt.sign(data, jwtSecret, { expiresIn: jwtExpiry });
};

export const POST = async (req: NextRequest) => {
  try {
    // Collect the info provided by user
    const data: User = await req.json();
    if (!data.email || !data.password)
      throw new Error("Email or Password missing");

    const user = await db
      .select({ id: users.id, role: users.role, password: users.password })
      .from(users)
      .where(eq(users.email, data.email));
    const passwordCheck = await compare(
      data.password,
      user[0].password as string,
    );
    if (!passwordCheck) throw new Error("Incorrect Password");

    const authToken = generateJWT({ id: user[0].id, role: user[0].role });
    cookies().set("Session_Token", authToken, { sameSite: "none" });
    return new NextResponse(JSON.stringify(authToken));
    // return new NextResponse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error));
  }
};