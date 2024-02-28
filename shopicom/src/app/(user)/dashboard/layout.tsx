import AsideMenu from "@/components/dashboard/AsideMenu";
import React, { ReactNode } from "react";

interface IDashboard {
  children: ReactNode;
}
const layout: React.FC<IDashboard> = async ({ children }) => {
  return (
    <main className="grid md:grid-cols-5 grid-cols-4 px-2 md:container py-10 gap-4">
      <AsideMenu />
      <section className="col-span-4">{children}</section>
    </main>
  );
};

export default layout;
