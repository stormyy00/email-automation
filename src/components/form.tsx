"use client";

import React, { KeyboardEvent } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Loader, Send, Save, Clock, Trash, ChevronDown, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import QuickDialog from "./quick-dialog";
import { UUID } from "crypto";

type Team = "operations" | "sponsorship";

type Template = {
  id: string;
  name: string;
  body: string;
  team: Team;
};

type Email = {
  recipients: string[];
  subject: string;
  body: string;
  templateId: string;
  scheduledDate: number;
};

type GroupedTemplate = {
  [key: string]: Template[];
};

type Recipient = {
  email_id: UUID;
  user_email: string;
};

const Form = () => {
  const router = useRouter();
  const [email, setEmail] = useState<Email>({
    recipients: [],
    subject: "",
    body: "",
    templateId: "",
    scheduledDate: 0,
  });
  const [scheduledDate, setScheduledDate] = useState(0);
  const [scheduleShow, setShowSchedule] = useState(false);
  const [dlConfirmShow, setDeleteConfirmShow] = useState(false);
  const [templates, setTemplates] = useState<GroupedTemplate>({});
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(undefined);
  const [recipientInput, setRecipientInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(true);
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
          recipients: Array.from(
            new Set(
              diddy.message[0].recipients.map(
                (recipient: Recipient) => recipient.user_email,
              ),
            ),
          ) as string[],
          subject: diddy.message[0].subject,
          templateId: diddy.message[0].templateId,
          body: "this is a body",
          scheduledDate: diddy.message[0].scheduled_date,
        });
        fetch("/api/templates")
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            setFetchingEmail(false);
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
          scheduled: scheduledDate, // Add scheduled date if needed
          sendNow: status === "sent",
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
      if (status === "scheduled") setShowSchedule(false);
    } catch (error) {
      console.error("Error saving document:", error);
      setError(true);
      toast.error("Failed to save the email.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmail = () => {
    fetch(`/api/email/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then((data) => {
        console.log(data);
        toast.success("Deleted successfully");
        setDeleteConfirmShow(false);
        setTimeout(() => router.push("/user/emails"), 1000);
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

  const convertDate = (epoch: number) => {
    const date = new Date(epoch);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "Space") &&
      recipientInput.trim() !== ""
    ) {
      setEmail((prev) => {
        const recipients = [...prev.recipients, recipientInput.trim()];
        return { ...prev, recipients: recipients };
      });
      setRecipientInput("");
      e.preventDefault();
    }
    if (e.key === "Backspace" && recipientInput === "") {
      setEmail((prev) => {
        const recipients = prev.recipients.slice(0, prev.recipients.length - 1);
        return { ...prev, recipients: recipients };
      });
    }
  };

  if (error) {
    <div>uh oh</div>;
  }

  if (fetchingEmail) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-y-4">
        <h1 className="font-bold text-lg">Loading email...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <QuickDialog
        show={dlConfirmShow}
        setShow={setDeleteConfirmShow}
        title="Email Deletion Confirmation"
        description="Clicking 'yes' will permanently delete this email!"
        width="600px"
        showClose={false}
      >
        <div className="flex w-full gap-x-4 mt-12">
          <Button
            onClick={deleteEmail}
            variant={"destructive"}
            className="w-1/2"
          >
            Yes
          </Button>
          <Button onClick={() => setDeleteConfirmShow(false)} className="w-1/2">
            No
          </Button>
        </div>
      </QuickDialog>
      <QuickDialog
        show={scheduleShow}
        setShow={setShowSchedule}
        title="Scheduled Date"
        width="600px"
      >
        <Label className="font-bold">date & time</Label>
        <Input
          type="datetime-local"
          defaultValue={convertDate(
            scheduledDate === 0 ? email.scheduledDate : scheduledDate,
          )
            .toISOString()
            .slice(0, 16)}
          onChange={(event) =>
            setScheduledDate(
              new Date(event.currentTarget.value).getTime() ?? Date.now(),
            )
          }
        />

        <Button onClick={() => handleSubmit("scheduled")}>Schedule</Button>
      </QuickDialog>
      <h2 className="text-2xl font-semibold text-gray-800">Email Editor</h2>
      <div className="flex flex-col gap-y-4 mt-4">
        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded focus-within:border-blue-500 overflow-auto">
          <ul className="flex text-xs gap-x-1">
            {email.recipients.map((email, index) => (
              <li
                key={index}
                className="px-2 py-1 bg-blue-300 text-white rounded-md flex items-center gap-x-1"
              >
                {email} <X size={20} />
              </li>
            ))}
          </ul>
          <input
            type="email"
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter email"
            className="flex-grow p-1 text-sm border-none focus:ring-0 focus:outline-none"
          />
        </div>
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
              className="h-48 text-gray-500"
              readOnly
            />
          </>
        )}
      </div>

      <div className="flex mt-6">
        <Button
          className="flex items-center gap-2 bg-black hover:opactiy-80 text-white px-4 py-2 rounded-l-md rounded-r-none"
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
              onClick={() => setShowSchedule(true)}
              disabled={loading}
            >
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Schedule</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-600"
              onClick={() => setDeleteConfirmShow(true)}
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
