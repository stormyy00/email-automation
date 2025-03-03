import {
  BookTemplate,
  Mail,
  PlusCircle,
  Settings,
  TimerIcon,
} from "lucide-react";
import React from "react";
import Tile from "./tile";

const UserDashboard = () => {
  return (
    <div className="w-full space-y-8 p-6">
      <div className="flex justify-between">
        <p className="flex text-3xl font-semibold text-gray-800">
          Good Evening, Jonathan
        </p>
        <div className="flex justify-center space-x-4">
          <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <PlusCircle className="w-5 h-5" />
            <span>Compose Email</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 tracking-wide">
          Today{","}s Stats
        </h2>
        <div className="w-4/5 bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 flex justify-between text-gray-700 dark:text-gray-300">
          <span className="font-medium">
            Total emails sent:{" "}
            <span className="text-blue-600 dark:text-blue-400">100</span>
          </span>
          <span className="font-medium">
            Emails in drafts:{" "}
            <span className="text-yellow-600 dark:text-yellow-400">2</span>
          </span>
          <span className="font-medium">
            Scheduled Emails:{" "}
            <span className="text-green-600 dark:text-green-400">10</span>
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full gap-6">
        <Tile icon={<Mail />} text="Emails" link="/user/emails" />
        <Tile icon={<BookTemplate />} text="Templates" link="/user/templates" />
        <Tile icon={<TimerIcon />} text="View History" link="/user/history" />
      </div>
    </div>
  );
};

export default UserDashboard;
