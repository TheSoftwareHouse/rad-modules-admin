import React from "react";
import { Icon } from "antd";
import { Table, Popconfirm } from "antd";

function UserAttributesList(props) {
  const { data, userAttributeDelete } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Attribute",
      key: "attributes",
      sorter: (a, b) => a.localeCompare(b),
      sortDirections: ["descend", "ascend"],
      render: text => {
        return <a href={`/users/attribute/${text}`}>{text}</a>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <span>
          <Popconfirm
            title="Are you sure to delete the attribute?"
            onConfirm={() => userAttributeDelete(text)}
            okText="Yes"
            cancelText="No"
          >
            <a href="/#">
              <Icon type="delete" />
            </a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return <Table rowKey={record => record} columns={columns} dataSource={data} />;
}

export default UserAttributesList;
