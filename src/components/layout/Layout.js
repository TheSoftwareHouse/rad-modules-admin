import { Avatar, Breadcrumb, Dropdown, Icon, Layout as AntdLayout, Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import "./Layout.css";

const { Header, Content, Footer } = AntdLayout;

const profileMenu = logout => (
  <Menu>
    <Menu.Divider />
    <Menu.Item>
      <a onClick={logout}>Logout</a>
    </Menu.Item>
  </Menu>
);

export default function Layout(props) {
  const { logOut, user } = useContext(UserContext);
  const [activeRoute, setactiveRoute] = useState("");

  const getRouteFrom = () => {
    const [_, root = ""] = window.location.pathname.split("/");
    return `/${root}`;
  };

  useEffect(() => {
    const activeRoute = getRouteFrom();
    setactiveRoute(activeRoute);
  }, []);

  return (
    <AntdLayout className="layout" style={{ minHeight: "100vh" }}>
      <Header className="layout-navbar">
        <Menu
          theme="dark"
          mode="horizontal"
          className="navbar-menu"
          selectedKeys={[activeRoute]}
          onClick={() => {
            const activeRoute = window.location.pathname;
            setactiveRoute(activeRoute);
          }}
          style={{ lineHeight: "64px" }}
        >
          {user.isAuthorized && (
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" style={{ marginRight: 0 }} />
              </Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("security") && user.isAuthorized && (
            <Menu.Item key="/users">
              <Link to="/users">Users</Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("security") && user.isAuthorized && (
            <Menu.Item key="/policies">
              <Link to="/policies">Policies</Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("security") && user.isAuthorized && (
            <Menu.Item key="/attributes">
              <Link to="/attributes">Attributes</Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("security") && user.isAuthorized && (
            <Menu.Item key="/access-keys">
              <Link to="/access-keys">Access keys</Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("scheduler") && user.isAuthorized && (
            <Menu.Item key="/jobs">
              <Link to="/jobs">Jobs</Link>
            </Menu.Item>
          )}
          {props.isModuleEnabled("notifications") && user.isAuthorized && (
            <Menu.Item key="/notifications">
              <Link to="/notifications">Notifications</Link>
            </Menu.Item>
          )}
        </Menu>
        <div className="navbar-profile">
          <Dropdown overlay={profileMenu(logOut)}>
            <a href="#">
              <Avatar icon="user" />
              <b>{user.username}</b> <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>tsh.io</Footer>
    </AntdLayout>
  );
}
