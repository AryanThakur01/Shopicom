export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePic: string;
  role: "admin" | "customer" | "seller";
}
