import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";
import Layout from "./components/layout/Layout";
import { LoginPage } from "./pages/loginPage/LoginPage";
import LoginOauthPage from "./pages/loginOauthPage/LoginOauthPage";
import httpClient from "./tools/httpClient";
import UserContext from "./contexts/UserContext";
import { LoadingPage } from "./pages/loadingPage/LoadingPage";
import { UnauthorizedPage } from "./pages/unauthorized/UnauthorizedPage";
import { IndexPage } from "./pages/index/IndexPage";
import { UserDetailsPage } from "./pages/users/UserDetailsPage";
import { AttributesPage } from "./pages/attributes/AttributesPage";
import { PoliciesPage } from "./pages/policies/PoliciesPage";
import { PolicyDetailsPage } from "./pages/policies/PolicyDetailsPage";
import { AccessKeysPage } from "./pages/access-keys/AccessKeysPage";
import { AttributeDetailsPage } from "./pages/attributes/AttributeDetailsPage";
import { JobsPage } from "./pages/jobs/JobsPage";
import { NotificationsPage } from "./pages/notifications/NotificationsPage";
import { UsersPage } from "./pages/users/UsersPage";
import { NotFoundPage } from "./pages/not-found/NotFoundPage";
import { isModuleEnabled, moduleAvailability } from "./tools/moduleAvailability";
import { LogoutPage } from "./pages/logout/LogoutPage";

function App() {
  const loggedOutUser = {
    isLoggedIn: false,
    username: null,
    accessToken: null,
    refreshToken: null,
    isAuthorized: false,
  };

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(loggedOutUser);

  const isEnabled = moduleName => {
    return isModuleEnabled(moduleName);
  };

  const logIn = (username, accessToken, refreshToken) => {
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    Cookies.set("X-SECURITY-TOKEN", accessToken);
    setUser({
      isLoggedIn: true,
      username,
      accessToken,
      refreshToken,
      isAuthorized: false,
    });
  };

  const authorize = hasAccess => {
    setUser({
      ...user,
      isAuthorized: hasAccess,
    });
  };

  const logOut = () => {
    Cookies.remove("X-SECURITY-TOKEN");
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(loggedOutUser);
  };

  useEffect(() => {
    async function checkToken() {
      try {
        const valid = await httpClient.isAuthenticatedWithRetry();
        if (!valid) {
          logOut();
          return setLoading(false);
        }

        const username = localStorage.getItem("username");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        logIn(username, accessToken, refreshToken);
      } catch (err) {
        logOut();
        setLoading(false);
      }
    }

    async function checkAccess() {
      const hasAccess = await httpClient.hasAccess();

      authorize(hasAccess);
      setLoading(false);
    }

    if (!user.isLoggedIn) {
      checkToken();
    } else if (!user.isAuthorized) {
      checkAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isLoggedIn, user.isAuthorized]);

  if (loading) return <LoadingPage />;

  return (
    <div className="App">
      <Router>
        {!user.isLoggedIn ? (
          <>
            <UserContext.Provider value={{ user, logIn, logOut, setLoading }}>
              <Switch>
                <Route path="/login-callback/:provider" component={LoginOauthPage} />
                <Route path="/" component={LoginPage} />
              </Switch>
            </UserContext.Provider>
          </>
        ) : (
          <UserContext.Provider value={{ user, logIn, logOut }}>
            <Layout isModuleEnabled={isEnabled}>
              {user.isAuthorized ? (
                <Switch>
                  <Route path="/" render={() => IndexPage(isEnabled)} exact />
                  <Route path="/users" component={moduleAvailability("security", UsersPage)} exact />
                  <Route path="/users/:userId" component={moduleAvailability("security", UserDetailsPage)} exact />
                  <Route path="/policies" component={moduleAvailability("security", PoliciesPage)} exact />
                  <Route path="/attributes" component={moduleAvailability("security", AttributesPage)} exact />
                  <Route path="/access-keys" component={moduleAvailability("security", AccessKeysPage)} exact />
                  <Route path="/jobs" component={moduleAvailability("scheduler", JobsPage)} exact />
                  <Route path="/logout" component={LogoutPage} />
                  <Route
                    path="/notifications"
                    component={moduleAvailability("notifications", NotificationsPage)}
                    exact
                  />
                  <Route
                    path="/policies/details/:attributeName/:policyName+"
                    component={moduleAvailability("security", PolicyDetailsPage)}
                    exact
                  />
                  <Route
                    path="/users/attribute/:attributeName"
                    component={moduleAvailability("security", AttributeDetailsPage)}
                    exact
                  />
                  <Route path="/404" exact component={NotFoundPage} />
                  <Route path="*" render={() => <Redirect to="/404" />} />
                </Switch>
              ) : (
                <UnauthorizedPage></UnauthorizedPage>
              )}
            </Layout>
          </UserContext.Provider>
        )}
      </Router>
    </div>
  );
}

export default App;
