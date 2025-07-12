import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    cookies().delete("Session_Token");
    return NextResponse.json({message : "Successfully logged out"},
                             {status : 200});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({error : error.message}, {status : 400});
    }
    return NextResponse.json({error : "Internal Server Error"}, {status : 500});
  }
}
