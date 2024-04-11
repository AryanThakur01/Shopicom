import React from "react";
import { LuLoader2 } from "react-icons/lu";

const loading = () => {
  return (
    <div className="flex h-[80vh]">
      <LuLoader2 className="size-52 animate-spin mx-auto my-auto" />
    </div>
  );
};

export default loading;
