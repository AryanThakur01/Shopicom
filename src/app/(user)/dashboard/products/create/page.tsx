// import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import GenDetails from "@/components/dashboard/products/create_v2/GenDetails";
import withAuth from "@/components/withAuth";
import React from "react";

const page = async () => {
  return (
    <>
      <div className="relative left-1 h-2 bg-muted w-72 rounded-full flex my-4">
        <div className="bg-primary rounded-full shrink-0" />
        <div className="h-4 w-4 rounded-full bg-primary relative -top-1 shrink-0 right-1" />
      </div>
      <div className="w-72 flex justify-between relative left-2 bottom-3 text-muted-foreground">
        <p className="text-foreground">Details</p>
        <p>Variant</p>
      </div>
      <GenDetails />
      {/* <ProductCatelogueForm /> */}
    </>
  );
};

export default withAuth(page, ["admin", "seller"]);
