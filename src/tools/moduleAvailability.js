import React from "react";
import { Redirect } from "react-router-dom";

export const moduleAvailability = (moduleName, component) => {
  const modules = (process.env.REACT_APP_MODULES ?? "").split(",");
  if (modules.includes(moduleName)) {
    return component;
  } else {
    return () => <Redirect to="/404" />;
  }
};
