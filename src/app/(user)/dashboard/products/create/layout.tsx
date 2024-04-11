import React from "react";

interface ICreateProduct {
  children: React.ReactNode;
}
const layout: React.FC<ICreateProduct> = ({ children }) => {
  return (
    <div className="min-h-[80vh] bg-card p-2 rounded border border-border overflow-x-hidden flex flex-col">
      <h2 className="text-2xl font-bold p-1">Create A New Product</h2>
      {children}
    </div>
  );
};

export default layout;
