import i18next from "i18next";

import en from "./navigation-i18n/en";
import es from "./navigation-i18n/es";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("es", "navigation", es);

const navigationConfig = [
  {
    id: "applications",
    title: "Applications",
    translate: "APPLICATIONS",
    type: "group",
    icon: "apps",
    children: [
      {
        id: "project-dashboard",
        title: "Analytics",
        type: "item",
        url: "/apps/dashboards/project",
      },
      {
        id: "users",
        title: "Users",
        translate: "USERS",
        type: "item",
        url: "/apps/users",
      },
      {
        id: "cities",
        title: "Cities",
        translate: "CITIES",
        type: "item",
        url: "/apps/cities",
      },
      {
        id: "regional",
        title: "Regional",
        translate: "REGIONAL",
        type: "item",
        url: "/apps/regional",
      },
    ],
  },
];

export default navigationConfig;
