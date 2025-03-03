import React from "react";
import Link from "next/link";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white text-center px-6">
      <div className="text-7xl font-semibold tracking-tight bg-gradient-to-br from-orange-300 to-orange-900 bg-clip-text text-transparent">
        Auto-Auto
      </div>
      <p className="text-lg text-gray-600 mt-4 max-w-xl">
        Revolutionizing email automation.
      </p>
      <Link
        href={"/user"}
        className="mt-4 px-6 py-3 text-lg font-medium bg-black/80 text-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-900 transition-all duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Landing;
