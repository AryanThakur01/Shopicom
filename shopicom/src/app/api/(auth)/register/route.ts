import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { cookies } from "next/headers";
import { generateJWT, passwordEncrypter } from "@/utils/api/helpers";
import jwt from "jsonwebtoken";
import { schema } from "@/lib/schemas/auth";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    // Collect the info provided by user
    const data = await req.json();
    data.role = "customer";

    schema.parse(data);

    data.password = await passwordEncrypter(data.password);
    const res = await db.insert(users).values(data).returning();
    const authToken = generateJWT({ id: res[0].id, role: res[0].role });
    cookies().set("Session_Token", authToken);
    return new NextResponse(JSON.stringify(authToken));
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const body = {
      grant_type: "authorization_code",
      code: searchParams.get("code"),
      client_id: process.env.GOOGLE_ID as string,
      client_secret: process.env.GOOGLE_SECRET as string,
      redirect_uri: process.env.WEB_URI + "/api/register",
    };

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const authTokens = await res.json();
    console.log(authTokens);
    if (!authTokens.id_token) throw new Error("Not Verified");

    jwt.decode(authTokens.id_token);
    cookies().set("Session_Token", authTokens.id_token);
    return NextResponse.redirect(new URL("/register", req.url));
  } catch (error) {
    if (error instanceof Error) return new NextResponse(error.message);
    return new NextResponse(JSON.stringify(error));
  }
};
