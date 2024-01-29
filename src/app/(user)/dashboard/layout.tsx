import AsideMenu from "@/components/dashboard/AsideMenu";
import React, { ReactNode } from "react";

interface IDashboard {
  children: ReactNode;
}
const layout: React.FC<IDashboard> = ({ children }) => {
  return (
    <main className="grid md:grid-cols-5 grid-cols-4 container my-10 gap-4">
      <AsideMenu />
      <section className="col-span-4">{children}</section>
    </main>
  );
};

export default layout;
