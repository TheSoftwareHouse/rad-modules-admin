import React from "react";
import { Table, Icon, Popconfirm } from "antd";

function AttributeUsersList(props) {
  const { data, total, limit, currentPage, deleteAttributeFromUser, setCurrentPage, fetchData } = props;
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
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => <a href={`/users/${record.id}`}>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to remove the policy for the user?"
          onConfirm={() => deleteAttributeFromUser(record.id)}
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
      }}
      onChange={(pagination, filters, sorter) => {
        setCurrentPage(pagination.current);
        const order = sorter.order
          ? `order[by]=${sorter.field}&order[type]=${sorter.order === "descend" ? "desc" : "asc"}`
          : "order[by]=username&order[type]=asc";
        fetchData(pagination.current, limit, undefined, order);
      }}
    />
  );
}

export default AttributeUsersList;
