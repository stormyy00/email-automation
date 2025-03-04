"use client";

import { useState, useEffect } from "react";
import {
  BookTemplate,
  Mail,
  PlusCircle,
  Settings,
  TimerIcon,
} from "lucide-react";
import React from "react";
import Tile from "./tile";
import QuickAcess from "./quick-acess";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";

const UserDashboard = () => {
  const router = useRouter();
  const supabase = createClient();
  const [greeting, setGreeting] = useState("Good Day");
  const [user, setUser] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data?.user);
      }
    };

    fetchUser();
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [supabase.auth]);

  return (
    <div className="w-full min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        <div className="bg-white  rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-gray-800 ">
                {greeting},{" "}
                <span className="text-orange-600">
                  {user?.user_metadata.full_name}
                </span>
              </p>
              <p className="text-gray-500  mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <QuickAcess
                text={"Compose Email"}
                icon={<PlusCircle />}
                className={"bg-orange-600 text-white hover:bg-orange-700"}
                onClick={() => router.push("user/emails")}
              />
              <QuickAcess
                text={"Settings"}
                icon={<Settings />}
                className={"bg-gray-100 text-gray-700 hover:bg-gray-200"}
                onClick={() => router.push("user/settings")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-700  tracking-wide">
            Today{"'"}s Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-white  shadow-md rounded-xl p-6 flex items-center space-x-4 transform transition-transform hover:scale-105">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Emails Sent</p>
                <p className="text-2xl font-bold text-gray-800">10</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4 transform transition-transform hover:scale-105">
              <div className="bg-yellow-100  p-3 rounded-lg">
                <BookTemplate className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500  text-sm">Emails in Drafts</p>
                <p className="text-2xl font-bold text-gray-800">20</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 flex items-center space-x-4 transform transition-transform hover:scale-105">
              <div className="bg-green-100 p-3 rounded-lg">
                <TimerIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Scheduled Emails</p>
                <p className="text-2xl font-bold text-gray-800 ">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full gap-6">
          <Tile icon={<Mail />} text="Emails" link="/user/emails" />
          <Tile
            icon={<BookTemplate />}
            text="Templates"
            link="/user/templates"
          />
          <Tile icon={<TimerIcon />} text="View History" link="/user/history" />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
