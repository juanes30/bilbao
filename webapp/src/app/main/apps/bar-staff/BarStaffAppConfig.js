import React from "react";
import { Redirect } from "react-router-dom";

const BarStaffAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/apps/bar-staff/:id",
      component: React.lazy(() => import("./BarStaffApp")),
    },
    {
      path: "/apps/bar-staff",
      component: () => <Redirect to="/apps/bar-staff/all" />,
    },
  ],
};

export default BarStaffAppConfig;
