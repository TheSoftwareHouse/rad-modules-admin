import React, { useState } from "react";
import { Modal, Form, Input, message, AutoComplete } from "antd";
import httpClient from "../../../tools/httpClient";

function AddPolicyModal(props) {
  const { visible, setModalVisible, fetchData, limit, currentPage } = props;
  const { Option } = AutoComplete;
  const [policyFilter, setPolicyFilter] = useState([]);

  const getPolicies = async attributeFilter => {
    const data = attributeFilter
      ? await httpClient.getPolicies(
          1,
          100,
          `filter[attribute][includeOr]=${attributeFilter}`,
          "order[by]=attribute&order[type]=asc",
        )
      : { policies: [] };
    const uniqueAttributes = [...new Set(data.policies.map(policy => policy.attribute))];
    setPolicyFilter(uniqueAttributes);
  };

  const cleanFrom = () => {
    setPolicyFilter([]);
    props.form.resetFields();
  };

  const handleOnCancel = () => {
    setModalVisible(false);
    cleanFrom();
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await httpClient.addPolicy(values.attribute, values.resource);
          message.success("Policy added");
          await fetchData(currentPage, limit);
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

  const autoCompleteRenderOption = item => {
    return (
      <Option key={item} text={item}>
        <div className="global-search-item">
          <span className="global-search-item-desc">{item}</span>
        </div>
      </Option>
    );
  };

  const { getFieldDecorator } = props.form;

  return (
    <Modal title="Add new policy" visible={visible} onOk={handleSubmit} onCancel={handleOnCancel}>
      <Form>
        <Form.Item>
          {getFieldDecorator("attribute", {
            rules: [{ required: true, message: "Please input attribute!" }],
          })(
            <AutoComplete
              style={{ width: "100%" }}
              dataSource={policyFilter.map(autoCompleteRenderOption)}
              onSearch={getPolicies}
              placeholder="Attribute"
              optionLabelProp="text"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("resource", {
            rules: [{ required: true, message: "Please input resource!" }],
          })(<Input type="text" placeholder="Resource" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: "add_policy" })(AddPolicyModal);
