import React from "react";
import { LuBell, LuMail, LuPencilLine } from "react-icons/lu";

const Profile = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mx-auto h-32 w-32 bg-muted mt-8 rounded-full"></div>
      <h1 className="text-center text-xl mt-4">Aryan Thakur</h1>
      <div className="flex gap-4 justify-center my-4 text-muted-foreground">
        <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
          <LuPencilLine className="size-5" />
        </button>
        <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
          <LuMail className="size-5" />
        </button>
        <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
          <LuBell className="size-5" />
        </button>
      </div>
    </>
  );
};

export default Profile;
