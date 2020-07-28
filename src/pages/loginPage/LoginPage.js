import React, { useState } from "react";
import "./LoginPage.css";
import { Alert } from "antd";
import LoginForm from "./components/LoginForm";
import OauthLogin from "./components/OauthLogin";

export function LoginPage(props) {
  const [loginFailMessage, setLoginFailMessage] = useState(props.match.params.message);

  return (
    <div className="login-page">
      <div className="login-form">
        <img
          className="login-logo"
          alt="tsh-logo"
          src={`https://raw.githubusercontent.com/TheSoftwareHouse/kakunin-cli/HEAD/data/tsh.png`}
        />
        {loginFailMessage ? (
          <Alert
            className="login-error-message"
            message={loginFailMessage}
            type="error"
            closable
            afterClose={() => setLoginFailMessage("")}
            showIcon
          />
        ) : null}
        <LoginForm setLoginFailMessage={setLoginFailMessage}></LoginForm>
        <OauthLogin
          loginProviders={process.env.REACT_APP_ENABLED_PROVIDERS ?? ""}
          googleClientUrl={process.env.REACT_APP_GOOGLE_AUTH_URL}
          facebookClientUrl={process.env.REACT_APP_FACEBOOK_AUTH_URL}
          microsoftClientUrl={process.env.REACT_APP_MICROSOFT_AUTH_URL}
        ></OauthLogin>
        <div className="powered-by">
          <p>Powered by RAD Modules</p>
        </div>
      </div>
    </div>
  );
}
