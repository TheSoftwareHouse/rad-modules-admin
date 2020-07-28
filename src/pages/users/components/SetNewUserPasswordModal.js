import React from "react";
import { Modal, Form, Input, message } from "antd";
import httpClient from "../../../tools/httpClient";

function SetNewUserPasswordModal(props) {
  const { visible, setModalVisible, username } = props;

  const cleanFrom = () => props.form.resetFields();

  const handleOnCancel = () => {
    setModalVisible(false);
    cleanFrom();
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await httpClient.setNewUserPassword(username, values.newPassword);
          message.success("New password has been set");
          setModalVisible(false);
          cleanFrom();
        } catch (err) {
          message.error(err.message);
        }
      } else {
        message.error("Validation error");
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <Modal title="Set new password" visible={visible} onOk={handleSubmit} onCancel={handleOnCancel}>
      <Form>
        <Form.Item>
          {getFieldDecorator("newPassword", {
            rules: [{ required: true, message: "Please input new password!" }],
          })(<Input placeholder="New password" type="password" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: "set_user_password" })(SetNewUserPasswordModal);
