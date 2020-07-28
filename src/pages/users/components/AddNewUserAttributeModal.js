import React, { useState } from "react";
import { Modal, Form, message, AutoComplete } from "antd";
import httpClient from "../../../tools/httpClient";

function AddNewUserAttributeModal(props) {
  const { visible, setModalVisible, userId, userAttributes, fetchData } = props;
  const { Option } = AutoComplete;
  const [policyFilter, setPolicyFilter] = useState([]);

  const cleanFrom = () => {
    setPolicyFilter([]);
    props.form.resetFields();
  };

  const getPolicies = async attributeFilter => {
    const data = attributeFilter
      ? await httpClient.getPolicies(
          1,
          100,
          `filter[attribute][includeOr]=${attributeFilter}`,
          "order[by]=attribute&order[type]=asc",
        )
      : { policies: [] };
    setPolicyFilter(data.policies.filter(policy => !userAttributes.includes(policy.attribute)) || []);
  };

  const autoCompleteRenderOption = item => {
    return (
      <Option key={item.attribute} text={item.attribute}>
        <div className="global-search-item">
          <span className="global-search-item-desc">
            Get <b>{item.attribute}</b> from &nbsp;
            <a href={`/policies/details/${item.attribute}/${item.resource}`} target="_blank" rel="noopener noreferrer">
              {item.resource}
            </a>{" "}
            resource
          </span>
        </div>
      </Option>
    );
  };

  const addAtribute = e => {
    props.form.validateFields(async (error, values) => {
      if (!error) {
        try {
          await httpClient.addUserAttribute(userId, values.newAttribute);
          message.success("The attribute has been added successful");
          setModalVisible(false);
          cleanFrom();
          await fetchData();
        } catch (error) {
          message.error(error.message);
        }
      } else {
        message.error("Validation error " + error.message);
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <Modal title="Add new attribute" visible={visible} onOk={addAtribute} onCancel={() => setModalVisible(false)}>
      <Form>
        <Form.Item>
          {getFieldDecorator("newAttribute", {
            rules: [{ required: true, message: "Please input new attribute!" }],
          })(
            <AutoComplete
              style={{ width: "100%" }}
              dataSource={policyFilter.map(autoCompleteRenderOption)}
              onSearch={getPolicies}
              placeholder="New attribute"
              optionLabelProp="text"
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: "add_new_user_attribute" })(AddNewUserAttributeModal);
