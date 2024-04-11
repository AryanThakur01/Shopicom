import Link from "next/link";
import { FaApple, FaGoogle } from "react-icons/fa";
import { XIcon } from "@/components/CustomIcons";
import bcrypt from "bcryptjs";
import { FC } from "react";

interface IOAuthLogin {
  googleCallback?: string | null;
}

const OAuthLogin: FC<IOAuthLogin> = ({ googleCallback }) => {
  const state = bcrypt.genSaltSync();
  const googleSearchParams = [
    `state=${state}`,
    "response_type=code",
    "client_id=852079849085-c30fsva3ae8l1s9lo2a9f87ibves7c62.apps.googleusercontent.com",
    "scope=openid%20profile%20email",
    "prompt=consent",
    `redirect_uri=http://localhost:3000/api/register`,
  ];
  const urlSearch = googleSearchParams.join("&");
  return (
    <>
      <div className="bg-background rounded-lg h-10 flex justify-center items-center">
        {/* <FaApple className="mx-auto" /> */}
      </div>
      <Link
        href={"https://accounts.google.com/o/oauth2/v2/auth?" + urlSearch}
        className="bg-muted rounded-lg h-10 drop-shadow-md flex justify-center items-center"
      >
        <FaGoogle className="mx-auto" />
      </Link>
      <div className="bg-background rounded-lg h-10 flex justify-center items-center">
        {/* <XIcon /> */}
      </div>
    </>
  );
};

export default OAuthLogin;
