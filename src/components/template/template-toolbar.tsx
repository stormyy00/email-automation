"use client";

import { useState, ChangeEvent } from "react";
import { Plus, Search, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { QUESTIONS } from "@/data/questions";
import Select from "../select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { TYPES } from "@/data/status";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { TemplateType } from "@/types";
import { Textarea } from "../ui/textarea";
interface props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearch: (value: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];

  checked: { [key: string]: boolean };
  setChecked: (value: { [key: string]: boolean }) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTemplates: (value: any[] | ((prev: any[]) => any[])) => void;
}

const TemplateToolbar = ({ data, setSearch, checked, setTemplates }: props) => {
  const [value, setValue] = useState("");
  const [popup, setPopup] = useState({
    visible: false,
  });
  const [template, setTemplate] = useState<TemplateType>({
    subject: "",
    body: "",
    team: "",
  });

  const ids = Object.keys(checked).filter((id) => checked[id]);

  const handleTemplates = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    setTemplate({ ...template, [key]: e.target.value });
  };

  const handleConfigure = () => {
    console.log("hello");
    setPopup({
      ...popup,
      visible: true,
    });
  };

  const handleAddTemplate = () => {
    fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        toast.success("Template saved successfully");
        setPopup({ ...popup, visible: false });
      })
      .catch((error) => {
        console.error("Error saving template:", error);
        toast.error("Failed to save template");
      });
  };

  const deleteTemplate = () => {
    const keep = data.filter((item) => !ids.includes(item.newsletterId));
    console.log("keep", keep);
    setSearch(keep);
    setTemplates(keep);
    fetch("/api/templates", {
      method: "DELETE",
      body: JSON.stringify(ids),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then(() => {
        toast.success("Deleted successfully");
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full md:w-full flex-grow md:flex-grow-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <Input
          value={value}
          onChange={(e) => {
            const value = e.target.value;
            setValue(value);
            setSearch(
              value === ""
                ? data
                : data.filter(({ name }) =>
                    name.toLowerCase().includes(value.toLowerCase()),
                  ),
            );
          }}
          placeholder="Search Templates"
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm"
        />
      </div>
      <Select
        options={TYPES.map(({ team }) => ({
          label: team,
          value: team,
        }))}
        onChange={(selected) => {
          setSearch(
            selected === "All"
              ? data
              : data.filter(({ team }) => team === selected),
          );
        }}
        placeholder="filter by status"
      />
      <Plus
        size={32}
        onClick={handleConfigure}
        className="cursor-pointer hover:text-blue-500 duration-300"
      />
      <Trash
        size={32}
        onClick={deleteTemplate}
        className="cursor-pointer hover:text-red-500 duration-300"
      />
      <AlertDialog open={popup.visible}>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Template</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="flex flex-col gap-4">
            {QUESTIONS.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label className="font-bold">{question.title}</Label>
                {question.type === "input" && (
                  <Input
                    type="text"
                    value={template[question.title as keyof TemplateType]}
                    onChange={(e) => handleTemplates(e, question.title)}
                  />
                )}
                {question.type === "textarea" && (
                  <Textarea
                    value={template[question.title as keyof TemplateType]}
                    onChange={(e) => handleTemplates(e, question.title)}
                  />
                )}
                {question.type === "select" && (
                  <Select
                    options={[
                      { label: "Sponsorship", value: "sponsorship" },
                      { label: "Operations", value: "operations" },
                    ]}
                    onChange={(selected) =>
                      console.log("Selected category:", selected)
                    }
                    placeholder="Select a Team"
                  />
                )}
              </div>
            ))}
          </AlertDialogDescription>

          <div className="flex flex-row self-end gap-2">
            <AlertDialogCancel
              onClick={() => setPopup({ ...popup, visible: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button
                onClick={handleAddTemplate}
                className="bg-ttickles-blue text-white hover:bg-ttickles-blue"
              >
                Submit
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TemplateToolbar;
