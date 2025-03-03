"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { TABS } from "@/data/navigation";
import Link from "next/link";
// import Logo from "@/public/temporarylogo.png";
import { usePathname, useRouter } from "next/navigation";

const Navigation = () => {
  const path = usePathname();
  const router = useRouter();
  const NAVTABS = TABS[path.split("/")[1]].tabs;

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
            className="flex flex-row items-center hover:bg-gradient-to-r hover:cursor-pointer hover:from-transparent hover:to-ttickles-lightblue gap-2"
            onClick={() => router.push(tab.link)}
          >
            {tab.icon}
            <Link href={tab.link}>{tab.name}</Link>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>Profile</SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;
