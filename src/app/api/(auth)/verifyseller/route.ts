import { db } from "@/db";
import { users } from "@/db/schema/users";
import { generateJWT, jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");
    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");
    const userId = jwtPayload.id;
    // const data = await req.formData();
    const data = await req.json();

    const firstName = data.firstName;
    const lastName = data.lastName;
    const profilePic = data.profilePic;
    if (!firstName || !lastName || !profilePic)
      throw new Error("all fields are necessary");

    const user = await db
      .update(users)
      .set({ firstName, lastName, profilePic, role: "seller" })
      .where(eq(users.id, userId))
      .returning();
    const newToken = generateJWT({ id: jwtPayload.id, role: user[0].role });
    cookies().set("Session_Token", newToken);

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    else if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
};
