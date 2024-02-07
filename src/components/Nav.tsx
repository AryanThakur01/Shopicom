"use client";
import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import { LuSearch, LuShoppingBag } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

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
          <Link
            href="/login"
            className="bg-muted text-foreground py-0.5 px-3 rounded text-md"
          >
            Login
          </Link>
        </ul>
      </div>
    </nav>
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

export default Nav;
