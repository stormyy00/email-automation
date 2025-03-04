"use client";

import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ChevronDown, Loader } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

type Team = "operations" | "sponsorship";

type Template = {
  id: string;
  name: string;
  body: string;
  team: Team;
};

type GroupedTemplate = {
  [key: string]: Template[]
}

const Form = () => {
  const [email, setEmail] = useState({
    recipients: "",
    subject: "",
    body: "",
    templateId: "",
  });
  const [templates, setTemplates] = useState<GroupedTemplate>({});
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });
  console.log(popup);
  console.log(email);
  const pathname = usePathname();
  const id = pathname.split("/")[3];
  useEffect(() => {
    fetch(`/api/email/${id}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((diddy) => {
        setEmail({
          recipients: diddy.message[0].recipients.join(", "),
          subject: diddy.message[0].subject,
          templateId: diddy.message[0].templateId,
          body: "this is a body",
        });
        fetch("/api/templates")
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            setTemplates(
              data.message.reduce((grouped: Record<Team, Template[]>, item: Template) => {
                const team = item.team;
                // If the team doesn't exist yet, create an empty array for it
                if (!grouped[team]) {
                  grouped[team] = [];
                }
                // Add the current item to the correct team group
                grouped[team].push(item);
                return grouped;
              }, {}),
            );
            for (const x of data.message) {
              if (
                diddy.message[0].templateId &&
                diddy.message[0].templateId != "" &&
                x.id === diddy.message[0].templateId
              ) {
                setSelectedTemplate(x);
                return;
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching templates:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
      })
      .finally(() => console.log("done")); // toaast
  }, [id]);

  const handleSubmit = async (status: "draft" | "scheduled" | "sent") => {
    if (!email.subject || !email.body) {
      toast.error("Subject and body are required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/email/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...email,
          status,
          templateId: selectedTemplate?.id ?? null,
          scheduled: status === "scheduled" ? Date.now() : 0, // Add scheduled date if needed
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      toast.success(
        status === "draft"
          ? "Draft saved successfully!"
          : status === "scheduled"
            ? "Email scheduled successfully!"
            : "Email sent successfully!",
      );
    } catch (error) {
      console.error("Error saving document:", error);
      setError(true);
      toast.error("Failed to save the email.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmail = () => {
    fetch("/api/email", {
      method: "DELETE",
      body: JSON.stringify(id),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then((data) => {
        console.log(data);
        toast.success("Deleted successfully");
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

  const confirmDelete = () => {
    setPopup({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this newsletter This action is irreversible.",
      color: "red",
      visible: true,
      onClick: deleteEmail,
      button: "Confirm",
    });
  };

  if (error) {
    <div>uh oh</div>;
  }

  console.log(templates);
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Email Editor</h2>
      <div className="flex flex-col gap-y-4 mt-4">
        <Input
          value={email.recipients}
          onChange={(e) =>
            setEmail((prev) => ({ ...prev, recipients: e.target.value }))
          }
          placeholder="Email Address"
        />
        <Input
          value={email.subject}
          onChange={(e) =>
            setEmail((prev) => ({ ...prev, subject: e.target.value }))
          }
          placeholder="Enter subject"
        />
        <Select onValueChange={(value) => setSelectedTemplate(JSON.parse(value))}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                selectedTemplate
                  ? selectedTemplate.name
                  : "Select a template..."
              }
              className="mt-4"
            />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectGroup> */}
            {Object.keys(templates)
              .filter((team) => team !== "")
              .map((team, key) => {
                return (
                  <SelectGroup key={key}>
                    <SelectLabel key={key}>
                      {team[0].toUpperCase() + team.substring(1)}
                    </SelectLabel>
                    {templates[team].map((template, key1) => {
                      return (
                        <SelectItem key={key1} value={JSON.stringify(template)}>
                          {template.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                );
              })}
          </SelectContent>
        </Select>
        {selectedTemplate && (
          <>
            <Label className="font-bold">preview text</Label>
            <Textarea
              value={selectedTemplate.body}
              className="h-48 text-gray-500"
              contentEditable={false}
            />
          </>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-end w-fit mt-4 px-4 py-2 bg-black text-white text-lg font-medium rounded-lg transition hover:bg-black/70">
          Select Action
          <ChevronDown className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full mt-2 rounded-lg bg-white shadow-lg border">
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full text-left py-2 px-4 hover:opacity-90"
              onClick={() => handleSubmit("sent")}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              className="w-full text-left py-2 px-4 hover:opacity-90"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Save as Draft"}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              className="w-full text-left py-2 px-4 hover:opacity-90"
              onClick={() => handleSubmit("scheduled")}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Schedule"}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full text-left py-2 px-4 text-red-600 hover:bg-red-50"
              onClick={confirmDelete}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Delete"}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Form;
