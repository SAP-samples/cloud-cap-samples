import React from "react";
import { Breadcrumb, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

const names = {
  "/": "Browse / Tracks",
  "/person": "Profile",
  "/login": "Login form",
  "/invoice": "Requested items",
  "/manage": "Manage store",
};

const CurrentPageHeader = () => {
  const location = useLocation();
  const { loading } = useAppState();

  return (
    <Breadcrumb
      style={{ height: 50, paddingBottom: 20, fontWeight: 600, fontSize: 20 }}
    >
      <Breadcrumb.Item>
        {names[location.pathname]}
        <span style={{ padding: 10 }}>{loading && <Spin />}</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export { CurrentPageHeader };
