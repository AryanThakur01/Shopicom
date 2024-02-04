import Profile from "@/components/dashboard/Profile";
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between gap-4">
      <div className=""></div>
      <aside className="md:w-1/3 w-full px-6">
        <Profile />
      </aside>
    </div>
  );
};

export default Dashboard;
