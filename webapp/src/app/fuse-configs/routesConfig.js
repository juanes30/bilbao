import FuseUtils from "@fuse/utils";
import appsConfigs from "app/main/apps/appsConfigs";
import authRoleExamplesConfigs from "app/main/auth/authRoleExamplesConfigs";
import DocumentationConfig from "app/main/documentation/DocumentationConfig";
import LoginConfig from "app/main/login/LoginConfig";
import LogoutConfig from "app/main/logout/LogoutConfig";
import pagesConfigs from "app/main/pages/pagesConfigs";
import RegisterConfig from "app/main/register/RegisterConfig";
import UserInterfaceConfig from "app/main/user-interface/UserInterfaceConfig";
import React from "react";
import { Redirect } from "react-router-dom";

const routeConfigs = [
  ...appsConfigs,
  ...pagesConfigs,
  ...authRoleExamplesConfigs,
  UserInterfaceConfig,
  DocumentationConfig,
  LogoutConfig,
  LoginConfig,
  RegisterConfig,
  LogoutConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, [
    "admin",
    "staff",
    "user",
  ]),
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/apps/dashboards/project" />,
  },
  {
    component: () => <Redirect to="/pages/errors/error-404" />,
  },
];

export default routes;
