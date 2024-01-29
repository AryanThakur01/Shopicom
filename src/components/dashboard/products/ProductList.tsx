import React, { ReactNode } from "react";

const ProductList = () => {
  return (
    <div className="">
      {/* table Header */}
      <Tr isHead>
        <div className="col-span-2 text-start">
          <h3>PRODUCT</h3>
        </div>
        <h3>PRICE</h3>
        <h3>ORDERS</h3>
        <h3>STOCK</h3>
        <h3>AMOUNT</h3>
      </Tr>
      <Tr>
        <div className="col-span-2 flex items-center gap-4 text-foreground">
          <div className="h-12 w-12 bg-purple-500 rounded"></div>
          <p>Purple Killer</p>
        </div>
        <p>$250</p>
        <p>250</p>
        <p>50</p>
        <p className="text-foreground">$250</p>
      </Tr>
    </div>
  );
};

interface ITr {
  children: ReactNode;
  isHead?: boolean;
}
const Tr: React.FC<ITr> = ({ children, isHead }) => {
  return (
    <div
      className={
        (isHead ? "bg-muted " : "") +
        "grid grid-cols-6 mt-4 rounded text-muted-foreground px-6 p-2 text-center items-center"
      }
    >
      {children}
    </div>
  );
};

export default ProductList;
