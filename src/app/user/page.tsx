import Dashboard from "@/components/dashboard";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="p-4 font-semibold text-2xl">Good Evening, Jonathan</div>
      <Dashboard />
    </div>
  );
};

export default page;
