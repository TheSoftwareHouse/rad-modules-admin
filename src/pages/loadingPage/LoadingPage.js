import React from "react";
import { Spin } from "antd";
import "./LoadingPage.css";

export const LoadingPage = () => (
  <div className="loading-page">
    <Spin size="large" />
  </div>
);
