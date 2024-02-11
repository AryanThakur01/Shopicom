import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import withAuth from "@/components/withAuth";
import React from "react";

const page = async () => {
  return (
    <div>
      <h2 className="text-2xl font-bold p-1">Create A New Product</h2>
      <ProductCatelogueForm />
    </div>
  );
};

export default withAuth(page, ["admin", "seller"]);
