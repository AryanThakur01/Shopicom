import CreateVariants from "@/components/dashboard/products/create_v2/CreateVariants";
import withAuth from "@/components/withAuth";
import { redirect } from "next/navigation";
import React from "react";

interface IPage {
  params: {
    id: string;
  };
}
const page: React.FC<IPage> = ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) redirect("/dashboard/products/create");
  return (
    <>
      <div className="relative left-1 h-2 bg-muted w-72 rounded-full flex my-4">
        <div className="animate-open-from-l-wide w-full bg-primary rounded-full shrink-0" />
        <div className="h-4 w-4 rounded-full bg-primary relative -top-1 shrink-0 right-1" />
      </div>
      <div className="w-72 flex justify-between relative left-2 bottom-3 text-muted-foreground">
        <p>Details</p>
        <p className="text-foreground">Variant</p>
      </div>
      <CreateVariants id={Number(params.id)} />
    </>
  );
};

export default withAuth(page, ["admin", "seller"]);
