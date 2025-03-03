import Navigation from "@/components/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "User",
  description: "The User Dashboard for Auto-Auto",
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <SidebarProvider>
        <Navigation />
        {children}
        <Toaster />
      </SidebarProvider>
    </div>
  );
};

export default Layout;
