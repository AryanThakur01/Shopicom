"use client";
import { useSelector } from "@/lib/redux";
import { ISession, getServerSession } from "@/utils/serverActions/session";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import React, { FC, ReactNode, useEffect, useState } from "react";
import {
  LuChevronRight,
  LuLogIn,
  LuLogOut,
  LuMenu,
  LuSearch,
  LuShoppingBag,
  LuX,
} from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Nav = () => {
  return (
    <nav className="flex flex-col container h-12 bg-black/40 backdrop-blur-xl sticky top-0">
      <div className="my-auto flex items-center">
        <Link href="/">Shopicom</Link>
        <ul className="flex items-center gap-4 justify-end ml-auto">
          <button>
            <NavButton>
              <LuSearch />
            </NavButton>
          </button>
          <NavButton>
            <LuShoppingBag />
          </NavButton>
          <Drawer>
            <button className="group">
              <LuMenu className="stroke-muted-foreground group-hover:stroke-foreground" />
            </button>
          </Drawer>
        </ul>
      </div>
    </nav>
  );
};

interface IProfileDialog {
  children: React.ReactNode;
}
const Drawer: FC<IProfileDialog> = ({ children }) => {
  const [session, setSession] = useState<ISession | null>();
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("Session_Token");
    if (token) getServerSession(token).then((s) => setSession(s));
  }, [user]);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute top-0 bg-black opacity-80 h-screen w-screen animate-open-opacity" />
        <Dialog.Content className="overflow-hidden flex flex-col min-w-96 max-w-[80vw] absolute h-screen right-0 top-0 bg-card p-1 border-l border-border shadow-2xl animate-open-from-r">
          <div className="flex justify-between items-center px-4 py-2">
            <Dialog.Close asChild>
              <button
                className="ml-auto text-lg relative right-2 text-muted-foreground hover:text-foreground rounded-full p-1 hover:border-foreground"
                aria-label="Close"
              >
                <LuX className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="text-2xl flex flex-col gap-1 justify-between text-muted-foreground p-4 font-semibold">
            <NavLink linkText="Home" href="/" />
            {session && <NavLink linkText="Dashboard" href="/dashboard" />}
          </div>
          <div className="mb-8 mt-auto px-4">
            {session ? (
              <button
                className="block w-full border border-border p-2 bg-background rounded"
                onClick={() => {
                  Cookies.remove("Session_Token");
                  setSession(null);
                  router.push("/");
                }}
              >
                <Dialog.Close className="flex items-center w-full gap-4">
                  <LuLogOut />
                  <span>Logout</span>
                </Dialog.Close>
              </button>
            ) : (
              <Link
                href="/login"
                className="block border border-border p-2 bg-background rounded"
              >
                <Dialog.Close className="flex gap-4 items-center w-full">
                  <LuLogIn />
                  <span>Login</span>
                </Dialog.Close>
              </Link>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface INavButton {
  children: ReactNode;
  className?: string;
}
const NavButton: React.FC<INavButton> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "flex justify-center items-center text-xl text-muted-foreground hover:text-foreground transition-all duration-500 p-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface INavLink {
  href: string;
  linkText: string;
}
const NavLink: FC<INavLink> = ({ href, linkText }) => {
  return (
    <Link className="hover:text-foreground group" href={href}>
      <Dialog.Close className="flex justify-between items-center w-full">
        {linkText}
        <span className="hidden group-hover:inline">
          <LuChevronRight />
        </span>
      </Dialog.Close>
    </Link>
  );
};

export default Nav;
