"use client";
import { useState, useEffect } from "react";
import Card from "../template/template-card";

import TemplateToolbar from "../template/template-toolbar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// type props = {
//   document: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newsletterId?: string | any;
//   id: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handleConfigure: () => void;
// };

interface Template {
  name: string;
  body: string;
  id: string;
  team: string;
}
const TemplateDashboard = ({ title }: { title: string }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchableItems, setSearch] = useState<Template[]>([]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
  });

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
  //     setDocuments({ ...documents, [key]: e.target.value });
  //   };

  useEffect(() => {
    fetch("/api/templates", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTemplates(data.message);
        setSearch(data.message);
        console.log(data);
        toast.success("Templates loaded sucessfully");
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveTemplate = (
    id: string,
    data: { title: string; description: string },
  ) => {
    setSaving(true);

    const templateToUpdate = templates.find((template) => template.id === id);

    if (!templateToUpdate) {
      toast.error("Template not found");
      setSaving(false);
      return;
    }

    const updatedTemplate = {
      ...templateToUpdate,
      name: data.title,
      body: data.description,
    };

    fetch(`/api/templates/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTemplate),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        const updatedTemplates = templates.map((template) =>
          template.id === id
            ? { ...template, name: data.title, body: data.description }
            : template,
        );

        setTemplates(updatedTemplates);
        setSearch(updatedTemplates);

        toast.success("Template updated successfully");
      })
      .catch((error) => {
        console.error("Error updating template:", error);
        toast.error("Failed to update template");
      })
      .finally(() => setSaving(false));
  };

  const handleConfigure = () => {
    console.log("hello");
    setPopup({
      ...popup,
      visible: true,
    });
  };
  return (
    <div className="flex flex-col w-5/6 mx-10 gap-4">
      <div className="text-4xl font-bold">{title}</div>

      <TemplateToolbar
        data={templates}
        setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        setTemplates={setTemplates}
      />
      {!loading ? (
        <div className="flex flex-col gap-2">
          {searchableItems.map(({ name, body, id, team }, index) => (
            <Card
              title={name}
              id={id}
              description={body}
              status={team}
              handleConfigure={handleConfigure}
              onClick={() => {
                setChecked({
                  ...checked,
                  [id]: !checked[id],
                });
              }}
              checked={checked[id as keyof typeof checked]}
              key={index}
              onSave={handleSaveTemplate}
            />
          ))}
        </div>
      ) : (
        <Loader2 size={35} />
      )}
      {saving && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg flex items-center gap-3">
            <Loader2 size={24} className="animate-spin" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDashboard;
