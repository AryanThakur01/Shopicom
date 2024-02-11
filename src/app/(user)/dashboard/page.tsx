import Profile from "@/components/dashboard/Profile";
import withAuth from "@/components/withAuth";
import React from "react";

const Dashboard = async () => {
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between gap-4">
      <div className=""></div>
      <aside className="md:w-1/3 w-full px-6">
        <Profile />
      </aside>
    </div>
  );
};

export default withAuth(Dashboard, ["customer", "seller", "admin"]);
