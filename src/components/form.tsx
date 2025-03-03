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

const Form = () => {
  const [email, setEmail] = useState({
    emailAdress: "",
    subject: "",
    body: "",
  });
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
      .then((data) => {
        setEmail({
          emailAdress: "lil bro",
          subject: data.message[0].subject,
          body: "this is a body",
        });
        console.log("nice", data);
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
          document: {
            ...email,
            status,
            scheduled: status === "scheduled" ? new Date().toISOString() : null, // Add scheduled date if needed
          },
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
  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Email Editor</h2>
      <Input
        className="mt-4"
        value={email.emailAdress}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, subject: e.target.value }))
        }
        placeholder="Email Adress"
      />
      <Input
        className="mt-4"
        value={email.subject}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, subject: e.target.value }))
        }
        placeholder="Enter subject"
      />
      <Textarea
        className="mt-3 h-72 resize-none"
        value={email.body}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, body: e.target.value }))
        }
        placeholder="Enter body"
      />

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
