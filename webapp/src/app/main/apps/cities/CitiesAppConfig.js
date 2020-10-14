import React from "react";
import { Redirect } from "react-router-dom";

const CitiesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/apps/cities/:id",
      component: React.lazy(() => import("./CitiesApp")),
    },
    {
      path: "/apps/cities",
      component: () => <Redirect to="/apps/cities/all" />,
    },
  ],
};

export default CitiesAppConfig;
