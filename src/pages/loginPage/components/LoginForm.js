import React, { useContext } from "react";
import { Form, Icon, Input, Button } from "antd";
import httpClient from "../../../tools/httpClient";
import UserContext from "../../../contexts/UserContext";

function LoginForm(props) {
  const { setLoginFailMessage } = props;

  const { logIn, setLoading } = useContext(UserContext);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        await login(values.userName, values.password);
      } else {
        console.log("VALIDATION ERROR!");
      }
    });
  };

  const login = async function(username, password) {
    try {
      const { accessToken, refreshToken } = await httpClient.login(username, password);
      setLoading(true);
      logIn(username, accessToken, refreshToken);
    } catch (error) {
      if (error.response) {
        setLoginFailMessage("Login failed");
      } else {
        setLoginFailMessage(error.message);
      }
    }
  };

  const { getFieldDecorator } = props.form;

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator("userName", {
          rules: [{ required: true, message: "Please input your username!" }],
        })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "Please input your Password!" }],
        })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: "normal_login" })(LoginForm);
