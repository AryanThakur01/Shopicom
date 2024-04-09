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
import { ISession } from "@/utils/serverActions/session";
import { useGetProfileQuery } from "@/lib/redux/services/user";
import { twMerge } from "tailwind-merge";

interface IAsideMenu {}
const AsideMenu: React.FC<IAsideMenu> = ({}) => {
  const [session, setSession] = useState<ISession | null>();
  const { data: user, isLoading } = useGetProfileQuery();
  useEffect(() => {
    if (user) setSession({ id: user.id.toString(), role: user.role });
    // console.log(user);
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
    <>
      <aside>
        <div className="text-sm lg:px-4 px-2 hidden md:flex flex-col gap-4 lg:text-xl">
          <h2 className="font-semibold">SHOPICOM</h2>
          {menuList.map((item, i) =>
            isLoading ? (
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
        </div>
        <div className="md:hidden fixed bottom-0 left-0 z-50 flex bg-background w-screen justify-center gap-[4%] py-1 px-[10%] border-t border-t-border">
          {menuList.map((item, i) =>
            isLoading ? (
              <div
                className="h-12 w-full animate-pulse bg-card rounded-lg flex items-center px-4 gap-4"
                key={"skeleton" + i}
              >
                <div className="w-5 bg-muted h-6"></div>
              </div>
            ) : (
              (!item.accessRole ||
                (session &&
                  item.accessRole &&
                  item.accessRole.includes(session.role))) && (
                <AsideButton {...item} text={undefined} key={item.text} />
              )
            ),
          )}
        </div>
      </aside>
    </>
  );
};

interface IAsideButton {
  link: string;
  icon: ReactNode;
  text?: string;
}
const AsideButton: React.FC<IAsideButton> = ({ link, icon, text }) => {
  const path = usePathname();
  return text ? (
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
  ) : (
    <Link
      href={link}
      className={twMerge(
        path === link || (link !== "/dashboard" && path.match(link + "/*"))
          ? "bg-primary  shadow shadow-muted-foreground/50"
          : "text-muted-foreground hover:text-foreground hover:bg-card",
        "flex items-center rounded-full h-8 px-2 transition-all duration-400",
      )}
    >
      {icon}
    </Link>
  );
};
export default AsideMenu;
