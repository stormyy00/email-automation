"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOCKORG } from "@/data/mock";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CopiedItems = {
  [key: string]: boolean;
};

const MyOrg = () => {
  const [copiedItems, setCopiedItems] = useState<CopiedItems>({});
  const orgId = "citrushack";

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} Copied`);

      setCopiedItems((prev) => ({
        ...prev,
        type: true,
      }));

      setTimeout(() => {
        setCopiedItems((prev) => ({
          ...prev,
          type: false,
        }));
      }, 2000);
    });
  };

  useEffect(() => {
    fetch(`/api/organizations/${orgId}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then((data) => {
        console.log(data);
        toast("Retieved Organization");
      })
      .catch((error) => toast.error("Failed to Retieved Organization", error));
  }, []);

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">My Organization</h1>
      {MOCKORG.map(({ organization, image, members }, index) => (
        <div key={index} className="flex flex-col items-center">
          <Card
            key={index}
            className="w-full flex flex-col max-w-4xl mb-4 shadow-lg rounded-xl"
          >
            <CardHeader className="flex items-center p-6 bg-slate-100 rounded-t-xl">
              <Avatar className="w-24 h-24 mr-6 border-2 border-orange-200">
                <Image
                  src={image}
                  alt={`${organization} logo`}
                  className="rounded-full object-cover"
                />
              </Avatar>
              <h2 className="text-4xl font-bold text-orange-600">
                {organization}
              </h2>
            </CardHeader>

            <CardContent className="p-6">
              <div className="text-xl font-semibold text-gray-700 border-b pb-2">
                Members
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {members.map(({ name, email }, memberIndex) => (
                  <div
                    key={memberIndex}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{name}</p>
                      <p className="text-sm text-gray-500">{email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyToClipboard(email, "Email")}
                    >
                      {copiedItems[memberIndex] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default MyOrg;
