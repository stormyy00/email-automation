import { Users, Users2, User, Building2 } from "lucide-react";
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
        name: "Organizations",
        link: "/admin/orgs",
        icon: <Building2 />,
      },
      {
        name: "Users",
        link: "/admin/users",
        icon: <Users />,
      },
    ],
  },
  user: {
    expand: true,
    tabs: [
      {
        name: "Home",
        link: "/user",
        icon: <User />,
      },
      {
        name: "Emails",
        link: "/user/emails",
        icon: <User />,
      },
      {
        name: "Templates",
        link: "/user/templates",
        icon: <Users2 />,
        requiresOrg: true,
      },
      {
        name: "History",
        link: "/user/history",
        icon: <Users2 />,
        requiresOrg: true,
      },
    ],
  },
};
