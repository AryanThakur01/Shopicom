"use client";
import { useSelector } from "@/lib/redux";
import { ISession, getServerSession } from "@/utils/serverActions/session";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import React, { FC, ReactNode, useEffect, useState } from "react";
import {
  LuArrowRight,
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
    <nav className="flex flex-col container h-12 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
      <div className="my-auto flex items-center">
        <Link href="/">Shopicom</Link>
        <ul className="flex items-center gap-4 justify-end ml-auto">
          <SearchDropDown>
            <button>
              <NavButton>
                <LuSearch />
              </NavButton>
            </button>
          </SearchDropDown>
          <button>
            <NavButton>
              <LuShoppingBag />
            </NavButton>
          </button>
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

interface ISearchDropDown {
  children: React.ReactNode;
}
const SearchDropDown: React.FC<ISearchDropDown> = ({ children }) => {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild className="relative">
          {children}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed top-0 bg-black/50 backdrop-blur-lg h-screen w-screen animate-open-opacity" />
          <Dialog.Content className="pt-12 pb-8 overflow-hidden flex flex-col w-screen fixed right-0 top-0 bg-black animate-open-from-t z-40 container min-h-[60vh]">
            <Dialog.DialogClose className="ml-auto relative bottom-8 right-20 font-extrabold text-xl">
              <LuX />
            </Dialog.DialogClose>
            <label
              htmlFor="search"
              className="text-xl flex gap-2 text-muted-foreground font-extrabold items-center"
            >
              <LuSearch className="text-muted-foreground" />
              <input
                name="search"
                id="search"
                type="text"
                className="bg-transparent outline-none placeholder:text-muted w-full"
                placeholder="Search shopify.com"
              />
            </label>
            <div className="mt-8 text-muted-foreground pr-8">
              <h2 className="text-sm px-1">Quick Links</h2>
              <div className="flex flex-col gap-1 my-2 text-sm">
                <a
                  href="/products/2529"
                  className="flex gap-4 items-center hover:bg-card p-1 rounded-md"
                >
                  <LuArrowRight />
                  <p className="text-foreground">Shearling Baffle</p>
                </a>
                <a
                  href="/products/2530"
                  className="flex gap-4 items-center hover:bg-card p-1 rounded-md"
                >
                  <LuArrowRight />
                  <p className="text-foreground">Flock Subtract</p>
                </a>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
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
        <Dialog.Overlay className="fixed z-40 top-0 bg-black/50 backdrop-blur-lg h-screen w-screen animate-open-opacity" />
        <Dialog.Content className="overflow-hidden flex flex-col min-w-96 max-w-[80vw] fixed z-50 h-screen right-0 top-0 bg-card p-1 border-l border-border shadow-2xl animate-open-from-r">
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
              <Dialog.Close
                className="w-full border border-border p-2 bg-background rounded flex items-center gap-4 px-4"
                onClick={() => {
                  Cookies.remove("Session_Token");
                  setSession(null);
                  router.push("/");
                }}
              >
                <LuLogOut />
                <span>Logout</span>
              </Dialog.Close>
            ) : (
              <Dialog.Close
                onClick={() => router.push("/login")}
                className="gap-4 items-center w-full bg-background rounded flex p-2 px-4"
              >
                <LuLogIn />
                <span>Login</span>
              </Dialog.Close>
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
  const router = useRouter();
  return (
    <Dialog.Close
      onClick={() => router.push(href)}
      className="hover:text-foreground group flex justify-between items-center w-full"
    >
      {linkText}
      <span className="hidden group-hover:inline">
        <LuChevronRight />
      </span>
    </Dialog.Close>
  );
};

export default Nav;
