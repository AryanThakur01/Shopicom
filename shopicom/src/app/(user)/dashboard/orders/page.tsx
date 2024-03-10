import React from "react";
import withAuth from "@/components/withAuth";

const page = () => {
  return <div>page</div>;
};

export default withAuth(page, ["admin", "seller", "customer"]);
