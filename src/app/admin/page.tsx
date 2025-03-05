import { getUser } from "@/utils/data-fetch";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { user, redirect: redirectTo } = await getUser();
  if (redirectTo || !user) {
    return redirect(redirectTo ?? "/signin");
  }

  return (
    <div>
      Overview
      {user.email}
    </div>
  );
};

export default page;
