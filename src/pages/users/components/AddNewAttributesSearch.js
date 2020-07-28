import React, { useState } from "react";
import { AutoComplete, Tag, Divider } from "antd";
import httpClient from "../../../tools/httpClient";

function AddNewAttributesSearch(props) {
  const { attributes, setAttributes } = props;
  const [policyFilter, setPolicyFilter] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { Option } = AutoComplete;

  const getPolicies = async attributeFilter => {
    const data = attributeFilter
      ? await httpClient.getPolicies(
          1,
          100,
          `filter[attribute][includeOr]=${attributeFilter}`,
          "order[by]=attribute&order[type]=asc",
        )
      : { policies: [] };

    setPolicyFilter(data.policies);
  };

  const autoCompleteRenderOption = item => {
    return (
      <Option key={item.attribute + item.resource} value={item.attribute} text={item.attribute}>
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

  const addAttribute = attribute => {
    setAttributes([...new Set([...attributes, attribute])]);
    setPolicyFilter([]);
    setSearchInput(null);
  };

  const handleRemoveAttribute = removedAttribute => {
    setAttributes(attributes.filter(attribute => attribute !== removedAttribute));
  };

  const onChange = value => {
    setSearchInput(value);
  };

  return (
    <>
      <AutoComplete
        style={{ width: "100%" }}
        allowClear={true}
        dataSource={policyFilter.map(autoCompleteRenderOption)}
        onSearch={getPolicies}
        onSelect={addAttribute}
        onChange={onChange}
        placeholder="Search an attribute for the user to add"
        optionLabelProp="text"
        value={searchInput}
      />
      {attributes.length ? <Divider plain>Added attributes</Divider> : null}
      {attributes.map((attribute, index) => (
        <Tag key={attribute + index} closable onClose={() => handleRemoveAttribute(attribute)}>
          {attribute}
        </Tag>
      ))}
    </>
  );
}

export default AddNewAttributesSearch;
