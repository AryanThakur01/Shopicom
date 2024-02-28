"use server";
import { jwtDecoder } from "../api/helpers";

export interface ISession {
  id: string;
  role: "customer" | "seller" | "admin";
}
export const getServerSession = async (token: string): Promise<ISession> => {
  const session = jwtDecoder(token);
  return { id: session.id, role: session.role };
};
