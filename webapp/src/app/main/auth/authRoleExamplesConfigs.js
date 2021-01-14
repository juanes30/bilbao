import AdminRoleExampleConfig from "./admin-role-example/AdminRoleExampleConfig";
import GuestRoleExampleConfig from "./only-guest-role-example/GuestRoleExampleConfig";
import StaffRoleExampleConfig from "./staff-role-example/StaffRoleExampleConfig";
import ResetPasswordConfig from "./reset-password/ResetPasswordConfig";
import ForgotPasswordConfig from "./forgot-password/ForgotPasswordConfig";

const authRoleExamplesConfigs = [
  AdminRoleExampleConfig,
  StaffRoleExampleConfig,
  GuestRoleExampleConfig,
  ResetPasswordConfig,
  ForgotPasswordConfig,
];

export default authRoleExamplesConfigs;
