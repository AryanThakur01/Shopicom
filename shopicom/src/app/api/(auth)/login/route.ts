import { users } from "@/db/schema/users";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db, queryClient } from "@/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "@/lib/schemas/auth";
import { ZodError } from "zod";
import { generateJWT } from "@/utils/api/helpers";

export const POST = async (req: NextRequest) => {
  try {
    const data = schema.parse(await req.json());

    const user = await db
      .select({ id: users.id, role: users.role, password: users.password })
      .from(users)
      .where(eq(users.email, data.email));

    if (!user.length) throw new Error("Account not found");

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
      return NextResponse.json({ error: error.message }, { status: 400 });
    else if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
};
