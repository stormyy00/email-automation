"use client";

import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const Form = () => {
  const [email, setEmail] = useState({
    emailAdress: "",
    subject: "",
    body: "",
  });
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(false);
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
        console.log("nice", data);
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
      })
      .finally(() => console.log("done")); // toaast
  }, [id]);

  const handleSubmit = async () => {
    if (!email) return;

    setIsLoading(false);

    try {
      const res = await fetch(`/api/email/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating Document:", error);
      setError(true);
    } finally {
      setIsLoading(true);
      toast.success("Newsletter saved successfully!");
    }
  };

  if (error) {
    <div>uh oh</div>;
  }
  return (
    <div className="flex flex-col w-5/6 items-center justify-center gap-5 m-4">
      <div>EMAIL</div>
      <Input
        value={email.subject}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, subject: e.target.value }))
        }
        placeholder="Enter subject"
      />
      <Textarea
        value={email.body}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, body: e.target.value }))
        }
        placeholder="Enter body"
      />
      <Button className="w-fit p-5" onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader className="animate-spin" /> : "Submit"}
      </Button>
    </div>
  );
};

export default Form;
