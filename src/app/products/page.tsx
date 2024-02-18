import ProductsFilters from "@/components/ProductsFilters";
import SearchedProduct from "@/components/SearchedProduct";
import React from "react";

const page = () => {
  return (
    <main className="grid grid-cols-4 container my-8">
      <aside>
        <ProductsFilters />
      </aside>
      <section className="md:col-span-3">
        <SearchedProduct />
      </section>
    </main>
  );
};

export default page;
