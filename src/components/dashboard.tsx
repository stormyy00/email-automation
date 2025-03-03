"use client";
import { useState } from "react";
import Toolbar from "./toolbar";
import Card from "./card";
import { ITEMS } from "@/data/mock";

// type props = {
//   document: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newsletterId?: string | any;
//   id: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handleConfigure: () => void;
// };

const Dashboard = ({ title }: { title: string }) => {
  const [documents, setDocuments] = useState(ITEMS);
  const [searchableItems, setSearch] = useState(ITEMS);
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
      <Toolbar
        data={documents}
        setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        setNewsletters={setDocuments}
      />

      <div className="flex flex-col gap-2">
        {searchableItems.map(({ title, emailId, status }, index) => (
          <Card
            title={title}
            id={emailId}
            status={status}
            handleConfigure={handleConfigure}
            onClick={() => {
              setChecked({
                ...checked,
                [emailId]: !checked[emailId],
              });
            }}
            checked={checked[emailId as keyof typeof checked]}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
