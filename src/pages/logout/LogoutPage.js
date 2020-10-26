import React, { useEffect, useState } from "react";
import "./LogoutPage.css";
import Cookies from "js-cookie";

export function LogoutPage(props) {
  useEffect(() => {
    Cookies.remove("X-SECURITY-TOKEN");
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    props.history.push("/");
  });

  return (
    <div>
      <p></p>
      <p>Logging out...</p>
    </div>
  );
}
