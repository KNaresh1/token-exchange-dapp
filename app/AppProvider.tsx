import React from "react";
import UIProvider from "./UIProvider";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <UIProvider>{children}</UIProvider>;
};

export default AppProvider;
