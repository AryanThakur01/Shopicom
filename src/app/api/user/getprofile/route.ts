import { db } from "@/db";
import { users } from "@/db/schema/users";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller")
      throw new Error("You Don't have a seller account make one to continue");

    const profile = await db
      .select({
        profilePic: users.profilePic,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, payload.id));

    return new NextResponse(JSON.stringify(profile[0]));
  } catch (error) {
    return new NextResponse("");
  }
};
