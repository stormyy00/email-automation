"use client";
import { useState } from "react";
import Card from "../card";
import { TEMPLATES } from "@/data/mock";
import TemplateToolbar from "../template/template-toolbar";

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
  const [popup, setPopup] = useState({
    visible: false,
  });

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
  //     setDocuments({ ...documents, [key]: e.target.value });
  //   };

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
    </div>
  );
};

export default TemplateDashboard;
