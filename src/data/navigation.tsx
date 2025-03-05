import {
  Home,
  Mail,
  Clock10,
  BookCheck,
  Globe2,
  ChartArea,
} from "lucide-react";
interface Tab {
  name: string;
  link: string;
  icon: JSX.Element;
  requiresOrg?: boolean;
  requiresOwner?: boolean;
}

interface Collapsible {
  expand: boolean;
  tabs: Tab[];
}
type Tabs = Record<string, Collapsible>;

export const TABS: Tabs = {
  admin: {
    expand: true,
    tabs: [
      //TODO: Needs to be updated
      {
        name: "Overview",
        link: "/admin",
        icon: <Globe2 />,
      },
      {
        name: "Statistics",
        link: "/admin/statistics",
        icon: <ChartArea />,
      },
    ],
  },
  user: {
    expand: true,
    tabs: [
      {
        name: "Home",
        link: "/user",
        icon: <Home />,
      },
      {
        name: "Emails",
        link: "/user/emails",
        icon: <Mail />,
      },
      {
        name: "Templates",
        link: "/user/templates",
        icon: <BookCheck />,
        requiresOrg: true,
      },
      {
        name: "History",
        link: "/user/history",
        icon: <Clock10 />,
        requiresOrg: true,
      },
    ],
  },
};
