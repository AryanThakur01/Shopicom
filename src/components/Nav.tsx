"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
import { LuSearch, LuShoppingBag } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

const Nav = () => {
  // const cookies = document.cookie.split(";");
  return (
    <nav className="container h-12 flex items-center bg-black/40 backdrop-blur-xl">
      <Link href="/">Shopicom</Link>
      <ul className="flex items-center gap-4 justify-end ml-auto">
        <NavButton>
          <LuSearch />
        </NavButton>
        <NavButton>
          <LuShoppingBag />
        </NavButton>
        <Link
          href="/login"
          className="bg-muted text-foreground py-0.5 px-3 rounded text-md"
        >
          Login
        </Link>
      </ul>
    </nav>
  );
};

interface INavButton {
  children: ReactNode;
  className?: string;
}
const NavButton: React.FC<INavButton> = ({ children, className }) => {
  return (
    <button
      className={twMerge(
        "flex justify-center items-center text-xl text-muted-foreground hover:text-foreground transition-all duration-500 p-1",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Nav;
