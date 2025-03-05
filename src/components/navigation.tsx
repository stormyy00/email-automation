"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { TABS } from "@/data/navigation";
import { EarthIcon, Settings, User } from "lucide-react";
import Link from "next/link";
// import Logo from "@/public/temporarylogo.png";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navigation = () => {
  const path = usePathname();
  const router = useRouter();
  const NAVTABS = TABS[path.split("/")[1]].tabs;
  const supabase = createClient();

  return (
    <Sidebar className="text-white">
      <SidebarHeader className="flex flex-col justify-center items-center">
        {/* <Link href="/">
          <Image src={Logo} alt="TTickle Logo" className="hover:scale-105" />
        </Link> */}
        <div className="text-4xl font-bold">Auto-Auto</div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col text-lg ml-3 items-center">
        {NAVTABS.map((tab, index) => (
          <SidebarGroup
            key={index}
            className="flex flex-row items-center hover:bg-gradient-to-r hover:cursor-pointer hover:from-transparent hover:to-white/80 gap-2"
            onClick={() => router.push(tab.link)}
          >
            {tab.icon}
            <Link href={tab.link}>{tab.name}</Link>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between mx-4">
          <Link className="flex justify-center" href={"/"}>
            <EarthIcon size={36} className="hover:scale-110 duration-300" />
          </Link>
          <Link className="flex justify-center" href={"/user/profile"}>
            <User size={36} className="hover:scale-110 duration-300" />
          </Link>
          <Link className="flex justify-center" href={"/user/settings"}>
            <Settings size={36} className="hover:scale-110 duration-300" />
          </Link>
        </div>
        <Button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
          className="px-4 py-2 bg-gradient-to-br from-orange-300 to-orange-700 text-white font-semibold rounded-xl shadow-md hover:opacity-80 transition-transform duration-300"
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
