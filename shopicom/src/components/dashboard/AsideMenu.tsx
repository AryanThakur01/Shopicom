"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  LuLayoutDashboard,
  LuShirt,
  LuShoppingBasket,
  LuTruck,
} from "react-icons/lu";
import { usePathname } from "next/navigation";
import { ISession, getServerSession } from "@/utils/serverActions/session";
import { useSelector } from "@/lib/redux";
import Cookies from "js-cookie";

interface IAsideMenu {}
const AsideMenu: React.FC<IAsideMenu> = ({}) => {
  const [session, setSession] = useState<ISession | null>();
  const user = useSelector((state) => state.user.value);
  const userStatus = useSelector((state) => state.user.status);
  useEffect(() => {
    setSession({ id: `${user.id}`, role: user.role });
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
    {
      icon: <LuTruck />,
      text: "Delivery Queue",
      link: "/dashboard/deliveryqueue",
      accessRole: ["seller", "admin"],
    },
  ];
  return (
    <aside className="text-sm lg:px-4 px-2 hidden md:flex flex-col gap-4 lg:text-xl">
      <h2 className="font-semibold">SHOPICOM</h2>
      {menuList.map((item, i) =>
        userStatus === "loading" ? (
          <div
            className="h-12 w-full animate-pulse bg-card rounded-lg flex items-center px-4 gap-4"
            key={"skeleton" + i}
          >
            <div className="w-5 bg-muted h-6"></div>
            <div className="h-6 bg-muted w-fit text-transparent">
              {item.text}
            </div>
          </div>
        ) : (
          (!item.accessRole ||
            (session &&
              item.accessRole &&
              item.accessRole.includes(session.role))) && (
            <AsideButton {...item} key={item.text} />
          )
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
        "flex lg:gap-4 gap-2 items-center rounded-lg h-12 px-4 transition-all duration-400"
      }
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};
export default AsideMenu;
