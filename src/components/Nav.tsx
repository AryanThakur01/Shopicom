import Link from "next/link";
import React, { ReactNode } from "react";
import { LuSearch, LuShoppingBag } from "react-icons/lu";

const Nav = () => {
  return (
    <nav className="container h-12 flex items-center bg-black/35 backdrop-blur-xl">
      <Link href="/">Shopicom</Link>
      <ul className="flex items-center gap-4 justify-end ml-auto">
        <NavButton>
          <LuSearch />
        </NavButton>
        <NavButton>
          <LuShoppingBag />
        </NavButton>
      </ul>
    </nav>
  );
};

interface INavButton {
  children: ReactNode;
}
const NavButton: React.FC<INavButton> = ({ children }) => {
  return (
    <button className="flex justify-center items-center text-xl text-muted-foreground hover:text-foreground transition-all duration-500 p-1">
      {children}
    </button>
  );
};

export default Nav;
