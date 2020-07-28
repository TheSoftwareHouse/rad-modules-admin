import React from "react";
import { Table, Icon, Popconfirm, Divider } from "antd";
import { Highlighted } from "../../../tools/highlighted";

function AttributesList(props) {
  const { data, total, limit, currentPage, attributeDelete, setCurrentPage, fetchData, highlight } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "Attribute",
      dataIndex: "name",
      key: "name",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return (
          <a href={`/users/attribute/${record.name}`}>
            <Highlighted text={text} highlight={highlight}></Highlighted>
          </a>
        );
      },
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <a href={`/users/${record.userId}`}>
          <Highlighted text={text} highlight={highlight}></Highlighted>
        </a>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <div className="project-action-icons">
          <a href={`/users/attribute/${record.name}/`} title="details">
            <Icon type="search" />
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete attribute from user?"
            onConfirm={() => attributeDelete(record.userId, record.name)}
            okText="Yes"
            cancelText="No"
          >
            <a href="/#">
              <Icon type="delete" />
            </a>
          </Popconfirm>
        </div>
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
          ? `order[by]=${sorter.field === "username" ? "user.username" : sorter.field}&order[type]=${
              sorter.order === "descend" ? "desc" : "asc"
            }`
          : "order[by]=name&resource&order[type]=asc";
        fetchData(pagination.current, limit, undefined, order);
      }}
    />
  );
}

export default AttributesList;
