"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  LuLayoutDashboard,
  LuSettings,
  LuShirt,
  LuShoppingBasket,
} from "react-icons/lu";
import { usePathname } from "next/navigation";

const AsideMenu = () => {
  const menuList = [
    {
      icon: <LuLayoutDashboard />,
      text: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: <LuShirt />,
      text: "Products",
      link: "/dashboard/products",
    },
    {
      icon: <LuShoppingBasket />,
      text: "Orders",
      link: "/dashboard/orders",
    },
    {
      icon: <LuSettings />,
      text: "Settings",
      link: "/dashboard/settings",
    },
  ];
  return (
    <aside className="text-xl px-4 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">SHOPICOM</h2>
      {menuList.map((item) => (
        <AsideButton {...item} key={item.text} />
      ))}
    </aside>
  );
};

interface IAsideButton {
  link: string;
  icon: ReactNode;
  text: string;
}
const AsideButton: React.FC<IAsideButton> = ({ link, icon, text }) => {
  const path = usePathname();
  return (
    <Link
      href={link}
      className={
        (path === link || (link !== "/dashboard" && path.match(link + "/*"))
          ? "bg-primary "
          : "text-muted-foreground hover:text-foreground hover:bg-card ") +
        "hidden md:flex gap-4 items-center rounded-lg p-2 px-4 transition-all duration-400"
      }
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};
export default AsideMenu;
