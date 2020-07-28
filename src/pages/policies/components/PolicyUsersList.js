import React from "react";
import { Table, Icon, Popconfirm } from "antd";

function PolicyUsersList(props) {
  const { data, total, limit, currentPage, deleteUserFromPolicy, setCurrentPage, fetchData } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "User name",
      dataIndex: "username",
      key: "username",
      render: text => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to remove the policy for the user?"
          onConfirm={() => deleteUserFromPolicy(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <a href="/#">
            <Icon type="delete" />
          </a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      rowKey={record => record.id}
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: limit,
        total: total,
        onChange(current) {
          setCurrentPage(current);
          fetchData(current, limit);
        },
      }}
    />
  );
}

export default PolicyUsersList;
