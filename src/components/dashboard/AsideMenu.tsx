"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { LuLayoutDashboard, LuShirt, LuShoppingBasket } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { ISession, getServerSession } from "@/utils/serverActions/session";
import { useSelector } from "@/lib/redux";
import Cookies from "js-cookie";

interface IAsideMenu {}
const AsideMenu: React.FC<IAsideMenu> = ({}) => {
  const [session, setSession] = useState<ISession | null>();
  const user = useSelector((state) => state.user.value);
  useEffect(() => {
    const token = Cookies.get("Session_Token");
    if (token) getServerSession(token).then((s) => setSession(s));
  }, [user]);
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
      accessRole: ["seller", "admin"],
    },
    {
      icon: <LuShoppingBasket />,
      text: "Orders",
      link: "/dashboard/orders",
    },
  ];
  return (
    <aside className="text-sm lg:px-4 px-2 hidden md:flex flex-col gap-4 lg:text-xl">
      <h2 className="font-semibold">SHOPICOM</h2>
      {menuList.map(
        (item) =>
          (!item.accessRole ||
            (session &&
              item.accessRole &&
              item.accessRole.includes(session.role))) && (
            <AsideButton {...item} key={item.text} />
          ),
      )}
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
        "flex lg:gap-4 gap-2 items-center rounded-lg p-2 px-4 transition-all duration-400"
      }
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};
export default AsideMenu;
