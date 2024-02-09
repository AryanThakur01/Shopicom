import { NextRequest, NextResponse } from "next/server";
import { queryClient } from "@/db";
import { User, users } from "@/db/schema/users";
import { genSalt, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { generateJWT } from "@/utils/api/helpers";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/postgres-js";

const passwordEncrypter = async (password: string) => {
  const salt = await genSalt(10);
  const hashVal = await hash(password, salt);
  return hashVal;
};

export const POST = async (req: NextRequest) => {
  try {
    const db = drizzle(queryClient);
    // Collect the info provided by user
    const data: User = await req.json();
    data.role = "customer";
    if (!data.email || !data.password || data.password.length < 8)
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
    console.log(error);
    return new NextResponse(JSON.stringify(error));
  }
};
