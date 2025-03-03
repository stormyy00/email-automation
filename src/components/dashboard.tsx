"use client";

import { useState, useEffect } from "react";
import Toolbar from "./toolbar";
import Card from "./card";
import { ITEMS } from "@/data/mock";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// type props = {
//   document: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   newsletterId?: string | any;
//   id: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handleConfigure: () => void;
// };

const Dashboard = ({ title }: { title: string }) => {
  const [emails, setEmails] = useState(ITEMS || []);
  const [searchableItems, setSearch] = useState(ITEMS || []);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({
    visible: false,
  });

  useEffect(() => {
    fetch("/api/email", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // setEmails(data.newsletters);
        // setSearch(data.newsletters);
        console.log(data);
        toast.success("Emails loaded sucessfully");
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

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
        data={emails}
        setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        setNewsletters={setEmails}
      />
      {!loading ? (
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
      ) : (
        <Loader2 size={35} />
      )}
    </div>
  );
};

export default Dashboard;
