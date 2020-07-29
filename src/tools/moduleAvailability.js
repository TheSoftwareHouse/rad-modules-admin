import React from "react";
import { Redirect } from "react-router-dom";

export const isModuleEnabled = moduleName => {
  const modules = (process.env.REACT_APP_MODULES ?? "").split(",");
  return modules.includes(moduleName);
};

export const moduleAvailability = (moduleName, component) => {
  if (isModuleEnabled(moduleName)) {
    return component;
  } else {
    return () => <Redirect to="/404" />;
  }
};
