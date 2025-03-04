"use client";

import { useState, useEffect } from "react";
import Toolbar from "./toolbar";
import Card from "./card";
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
interface Email {
  subject: string;
  id: string;
  status: string;
}

const Dashboard = ({ title }: { title: string }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchableItems, setSearch] = useState<Email[]>([]);
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
        setEmails(data.message);
        setSearch(data.message);
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
        setEmails={setEmails}
      />
      {!loading ? (
        <div className="flex flex-col gap-2">
          {searchableItems.map(({ subject, id, status }, index) => (
            <Card
              title={subject}
              id={id}
              status={status}
              handleConfigure={handleConfigure}
              onClick={() => {
                setChecked({
                  ...checked,
                  [id]: !checked[id],
                });
              }}
              checked={checked[id as keyof typeof checked]}
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
