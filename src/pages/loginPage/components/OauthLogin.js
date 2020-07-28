import React from "react";
import { Button, Divider } from "antd";
import "./OauthLogin.css";

function OauthDivider(props) {
  if (
    props.loginProviders.indexOf("google") == -1 &&
    props.loginProviders.indexOf("facebook") == -1 &&
    props.loginProviders.indexOf("microsoft") == -1
  ) {
    return null;
  }
  return <Divider className="oauthLogin">or login with:</Divider>;
}

function GoogleLoginButton(props) {
  if (props.loginProviders.indexOf("google") === -1) {
    return null;
  }
  return (
    <Button className="loginBtn--google" icon="google" href={props.googleClientUrl}>
      Google
    </Button>
  );
}

function FacebookLoginButton(props) {
  if (props.loginProviders.indexOf("facebook") === -1) {
    return null;
  }
  return (
    <Button className="loginBtn--facebook" icon="facebook" href={props.facebookClientUrl}>
      Facebook
    </Button>
  );
}

function MicrosoftLoginButton(props) {
  if (props.loginProviders.indexOf("microsoft") === -1) {
    return null;
  }
  return (
    <Button className="loginBtn--microsoft" icon="windows" href={props.facebookClientUrl}>
      Microsoft
    </Button>
  );
}

function OauthLogin(props) {
  return (
    <div>
      <OauthDivider loginProviders={props.loginProviders} />
      <GoogleLoginButton loginProviders={props.loginProviders} googleClientUrl={props.googleClientUrl} />
      <MicrosoftLoginButton loginProviders={props.loginProviders} facebookClientUrl={props.microsoftClientUrl} />
      <FacebookLoginButton loginProviders={props.loginProviders} facebookClientUrl={props.facebookClientUrl} />
    </div>
  );
}

export default OauthLogin;
