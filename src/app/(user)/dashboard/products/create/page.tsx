import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold p-1">Create A New Product</h2>
      <ProductCatelogueForm />
    </div>
  );
};

export default page;
