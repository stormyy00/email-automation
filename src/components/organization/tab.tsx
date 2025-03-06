import React from "react";
import { Send } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orgConfigs } from "@/data/organizations";
import { toast } from "sonner";

type OrgData = {
  id: string;
  name: string;
};

interface OrgmTabContentProps {
  type: "join" | "create";
  onSubmit: (organization: OrgData) => Promise<void>;
  organization: OrgData;
  setOrganization: (organization: OrgData) => void;
}

const OrganizationTab = ({
  type,
  onSubmit,
  organization,
  setOrganization,
}: OrgmTabContentProps) => {
  const { title, description, labelText, placeholder } = orgConfigs[type];

  const handleSubmit = () => {
    const isValid =
      type === "join" ? organization.id !== "" : organization.name !== "";

    if (!isValid) {
      toast(`Enter a Valid ${type === "join" ? "Team ID" : "Org Name"}`);
      return;
    }

    onSubmit(organization);
  };

  return (
    <Card className="w-full border-none shadow-lg">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-3xl font-bold text-orange-600">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={type} className="text-lg font-medium text-gray-700">
            {labelText}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <Send
                size={16}
                onClick={handleSubmit}
                className="text-gray-400 hover:text-orange-500"
              />
            </div>
            <Input
              id={type}
              placeholder={placeholder}
              onChange={(e) =>
                setOrganization(
                  type === "join"
                    ? { id: e.target.value, name: "" }
                    : { name: e.target.value, id: "" },
                )
              }
              className="pr-10 pl-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationTab;
