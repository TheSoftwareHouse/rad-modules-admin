import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import httpClient from "../../../tools/httpClient";
import AddNewAttributesSearch from "./AddNewAttributesSearch";

function AddUserModal(props) {
  const { visible, setModalVisible, fetchData, limit, currentPage } = props;
  const [attributes, setAttributes] = useState([]);

  const cleanFrom = () => props.form.resetFields();

  const clearAllData = () => {
    setModalVisible(false);
    setAttributes([]);
    cleanFrom();
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await httpClient.addUser(values.username, values.password, attributes);
          message.success("User added");
          await fetchData(currentPage, limit);
          clearAllData();
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
    <Modal title="Add new user" visible={visible} onOk={handleSubmit} onCancel={clearAllData}>
      <Form>
        <Form.Item label="Username">
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input username!" }],
          })(<Input placeholder="Username" />)}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input password!" }],
          })(<Input type="password" placeholder="Password" />)}
        </Form.Item>
      </Form>
      <Form.Item label="User's initial attributes">
        <AddNewAttributesSearch attributes={attributes} setAttributes={setAttributes} />
      </Form.Item>
    </Modal>
  );
}

export default Form.create({ name: "add_user" })(AddUserModal);
