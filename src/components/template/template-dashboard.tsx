"use client";
import { useState, useEffect } from "react";
import Card from "../card";
import { TEMPLATES } from "@/data/mock";
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

const TemplateDashboard = ({ title }: { title: string }) => {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [searchableItems, setSearch] = useState(TEMPLATES);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
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
        // setTemplates(data.newsletters);
        // setSearch(data.newsletters);
        console.log(data);
        toast.success("Templates loaded sucessfully");
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

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
          {searchableItems.map(({ templateName, templateId, type }, index) => (
            <Card
              title={templateName}
              id={templateId}
              status={type}
              handleConfigure={handleConfigure}
              onClick={() => {
                setChecked({
                  ...checked,
                  [templateId]: !checked[templateId],
                });
              }}
              checked={checked[templateId as keyof typeof checked]}
              key={index}
            />
          ))}
        </div>
      ) : (
        <Loader2 size={35} />
      )}
    </div>
  );
};

export default TemplateDashboard;
