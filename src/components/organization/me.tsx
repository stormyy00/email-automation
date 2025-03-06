"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import OrganizationTab from "./tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/utils";
type OrgData = {
  id: string;
  name: string;
};

const OrganizationPage = () => {
  const [orgId, setOrgId] = useState("");
  const [organization, setOrganization] = useState({
    id: "",
    name: "",
  });

  const handleJoin = async (organization: OrgData) => {
    try {
      const response = await fetch("/api/organizations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team: organization.id }),
      });

      if (response.ok) {
        toast("Successfully joined organization!");
        setOrgId(organization.id);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while joining the organization");
    }
  };

  const handleCreate = async (organization: OrgData) => {
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organization }),
      });
      const { id } = await response.json();

      setOrgId(id);
      toast("Successfully created a new organization!");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the organization");
    }
  };

  return (
    <div className="w-full flex flex-col items-center mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black">My Organization</h1>

      <AlertDialog open={orgId !== ""}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-orange-800">
              Welcome to your new organization!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Using the organization dashboard, you can add team members, upload
              submission links, and view critical information for judging!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href={`organization/${organization.name}`}>
              <AlertDialogAction className="bg-orange-500 hover:bg-orange-600">
                Visit New Organization
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-6">
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl mb-6">
            <TabsTrigger
              className={cn(
                "rounded-lg py-3 text-lg font-semibold text-gray-500",
                "data-[state=active]:bg-white data-[state=active]:text-orange-600",
                "data-[state=active]:shadow-md transition-all duration-300",
              )}
              value="join"
            >
              Join an Organization
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "rounded-lg py-3 text-lg font-semibold text-gray-500",
                "data-[state=active]:bg-white data-[state=active]:text-orange-600",
                "data-[state=active]:shadow-md transition-all duration-300",
              )}
              value="create"
            >
              Create an Organization
            </TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <OrganizationTab
              type="join"
              onSubmit={handleJoin}
              organization={organization}
              setOrganization={setOrganization}
            />
          </TabsContent>
          <TabsContent value="create">
            <OrganizationTab
              type="create"
              onSubmit={handleCreate}
              organization={organization}
              setOrganization={setOrganization}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationPage;
