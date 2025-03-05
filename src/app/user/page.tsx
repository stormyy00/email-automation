import UserDashboard from "@/components/user-dashboard";
import { getUser } from "@/utils/data-fetch";
import React from "react";

const page = async () => {
  const { user } = await getUser();
  return (
    <div className="w-full">
      <UserDashboard user={user} />
    </div>
  );
};

export default page;
