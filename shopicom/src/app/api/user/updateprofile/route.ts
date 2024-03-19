import { db } from "@/db";
import { users } from "@/db/schema/users";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");

    const body = await req.json();
    const newData = await db
      .update(users)
      .set({
        firstName: body.firstName || null,
        lastName: body.lastName || null,
        profilePic: body.profilePic || null,
      })
      .where(eq(users.id, payload.id))
      .returning();
    console.log(newData);
    return new NextResponse(JSON.stringify(newData));
  } catch (error) {
    if (error instanceof Error) return new NextResponse(error.message);
    return new NextResponse(JSON.stringify(error));
  }
};
