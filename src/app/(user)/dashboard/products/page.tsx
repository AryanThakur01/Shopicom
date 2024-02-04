import ProductList from "@/components/dashboard/products/ProductList";
import Link from "next/link";
import React from "react";
import { LuLoader2, LuPlus } from "react-icons/lu";

const page = () => {
  return (
    <>
      <div className="bg-card p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Product List</h2>
          <div className="flex gap-4">
            <Link
              href="/dashboard/products/create"
              className="bg-primary h-10 text-xl rounded px-2 flex items-center gap-2"
            >
              <LuPlus />
              <span className="text-lg">Create</span>
            </Link>
          </div>
        </div>
        <ProductList />
      </div>
    </>
  );
};

export default page;
