import React from "react";
import { Redirect } from "react-router-dom";

const RestaurantsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/apps/restaurants/:id",
      component: React.lazy(() => import("./RestaurantsApp")),
    },
    {
      path: "/apps/restaurants",
      component: () => <Redirect to="/apps/restaurants/all" />,
    },
  ],
};

export default RestaurantsAppConfig;
