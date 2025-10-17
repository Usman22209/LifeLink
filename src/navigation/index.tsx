import React from "react";
import ENV from "@config/env";
import UserNavigation from "./UserFlow";
import BloodBankNavigation from "./BloodBankFlow";
const AppNavigation: React.FC = () => {
  const { APP_FLAVOR } = ENV;
  console.log("App Flavor:", APP_FLAVOR);

  return APP_FLAVOR === "user" ? <UserNavigation /> : <BloodBankNavigation />;
};

export default AppNavigation;
