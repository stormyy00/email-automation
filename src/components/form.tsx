"use client";

import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Loader, Send, Save, Clock, Trash, ChevronDown } from "lucide-react";
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
  [key: string]: Template[];
};

const Form = () => {
  const [email, setEmail] = useState({
    recipients: "",
    subject: "",
    body: "",
    templateId: "",
  });
  const [templates, setTemplates] = useState<GroupedTemplate>({});
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(undefined);
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
              data.message.reduce(
                (grouped: Record<Team, Template[]>, item: Template) => {
                  const team = item.team;
                  // If the team doesn't exist yet, create an empty array for it
                  if (!grouped[team]) {
                    grouped[team] = [];
                  }
                  // Add the current item to the correct team group
                  grouped[team].push(item);
                  return grouped;
                },
                {},
              ),
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
        <Select
          onValueChange={(value) => setSelectedTemplate(JSON.parse(value))}
        >
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
            {Object.keys(templates)
              .filter((team) => team !== "")
              .map((team, index) => {
                return (
                  <SelectGroup key={`team-${index}`}>
                    <SelectLabel>
                      {team[0].toUpperCase() + team.substring(1)}
                    </SelectLabel>
                    {templates[team].map((template, templateIndex) => {
                      return (
                        <SelectItem
                          key={`template-${templateIndex}`}
                          value={JSON.stringify(template)}
                        >
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
            <Label className="font-bold">Preview Text</Label>
            <Textarea
              value={selectedTemplate.body}
              onChange={(e) =>
                setSelectedTemplate((prev) =>
                  prev ? { ...prev, body: e.target.value } : undefined,
                )
              }
              className="h-48 text-gray-500"
            />
          </>
        )}
      </div>

      <div className="flex mt-6">
        <Button
          className="flex items-center gap-2 bg-black hover:opactiy-80 text-white px-4 py-2 rounded-l-md"
          onClick={() => handleSubmit("sent")}
          disabled={loading}
        >
          {loading ? (
            <Loader className="animate-spin w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Send</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="px-3 py-2 bg-black hover:opacity-80 text-white rounded-r-md border-l border-black">
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mt-2 rounded-md bg-white shadow-lg border">
            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
            >
              <Save className="w-4 h-4 text-gray-600" />
              <span>Save as Draft</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSubmit("scheduled")}
              disabled={loading}
            >
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Schedule</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-600"
              onClick={confirmDelete}
              disabled={loading}
            >
              <Trash className="w-4 h-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Form;
