import { users } from "@/db/schema/users";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { queryClient } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "@/lib/schemas/auth";
import { ZodError } from "zod";

const generateJWT = (data: object) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiry = process.env.JWT_LIFETIME as string;
  return jwt.sign(data, jwtSecret, { expiresIn: jwtExpiry });
};

export const POST = async (req: NextRequest) => {
  try {
    const db = drizzle(queryClient);
    const data = schema.parse(await req.json());

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
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ error, status: 400 });
    else if (error instanceof Error)
      return NextResponse.json({ error, status: 400 });

    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
