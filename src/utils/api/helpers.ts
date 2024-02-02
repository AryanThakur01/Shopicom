import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface IJwtGenerateData {
  id: string;
  role: "admin" | "customer" | "seller";
}
export const generateJWT = (data: IJwtGenerateData) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiry = process.env.JWT_LIFETIME as string;
  return jwt.sign(data, jwtSecret, { expiresIn: jwtExpiry });
};
export const jwtDecoder = (
  token: string,
  req: NextRequest,
): string | JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const payload = jwt.verify(token, jwtSecret, { ignoreExpiration: true });
  if (typeof payload === "string" || !payload.exp)
    throw new Error("Session Token either string or has no expiry");

  /* Regenerate JWT When old one expires and set it in the cookie */
  const time = new Date();
  const initial = time.getTime() / 1000;
  if (payload.exp - initial <= 2582551) {
    const newToken = generateJWT({ id: payload.id, role: payload.role });
    cookies().set("Session_Token", newToken);
  }

  return payload;
};
