import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { NOT_FOUND } from "http-status-codes";
import httpClient from "../../tools/httpClient";
import UserContext from "../../contexts/UserContext";

function LoginOauthPage(props) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const [provider] = useState(props.match.params.provider);

  const [loginFailMessage, setLoginFailMessage] = useState("");

  const { logIn, setLoading } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const { username, accessToken, refreshToken } = await httpClient.loginOauth(provider, code);
        setLoading(true);
        logIn(username, accessToken, refreshToken);
        props.history.push("/");
      } catch (error) {
        if (error.response && error.response.status === NOT_FOUND) {
          setLoginFailMessage(`User with a given username does not exist.`);
        } else {
          setLoginFailMessage("Login failed.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [code, logIn, props.history, setLoading, provider]);

  return loginFailMessage ? (
    <Redirect
      to={{
        pathname: "/?message=" + loginFailMessage,
      }}
    />
  ) : (
    <div>
      Logging with <i>{provider}</i>, please wait...
    </div>
  );
}

export default withRouter(LoginOauthPage);
