import React from "react";
import { Redirect } from "react-router-dom";

const RegionalAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/apps/regional/:id",
      component: React.lazy(() => import("./RegionalApp")),
    },
    {
      path: "/apps/regional",
      component: () => <Redirect to="/apps/regional/all" />,
    },
  ],
};

export default RegionalAppConfig;
