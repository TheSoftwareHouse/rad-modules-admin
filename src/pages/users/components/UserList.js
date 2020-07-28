import React from "react";
import { Icon } from "antd";
import { Table, Divider, Tag, Popconfirm } from "antd";
import { Highlighted } from "../../../tools/highlighted";

function UserList(props) {
  const { data, currentPage, limit, total, fetchData, userDelete, userDeactivate, userActivate, highlight } = props;

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
      render: (text, record) => (
        <a href={`/users/${record.id}`}>
          <Highlighted text={text} highlight={highlight}></Highlighted>
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        {
          text: "Active",
          value: "activated",
        },
        {
          text: "Inactive",
          value: "deactivated",
        },
      ],
      defaultFilteredValue: ["activated"],
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        const color = record.isActive ? "green" : "red";
        return (
          <Tag color={color} key={record.id}>
            {record.isActive ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <span>
          <a
            href="/#"
            onClick={e => {
              e.preventDefault();
              return record.isActive ? userDeactivate(record.id) : userActivate(record.activationToken);
            }}
          >
            <Icon type={record.isActive ? "stop" : "check"} title={record.isActive ? "active" : "deactivate"} />
          </a>
          <Divider type="vertical" />

          <a href={`/users/${record.id}`} title="edit">
            <Icon type="edit" />
          </a>
          <Divider type="vertical" />

          <Popconfirm
            title="Are you sure delete user?"
            onConfirm={() => userDelete(record.id)}
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

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: limit,
        total: total,
      }}
      onChange={(pagination, filters, sorter) => {
        const order = sorter.order
          ? `order[by]=${sorter.field}&order[type]=${sorter.order === "descend" ? "desc" : "asc"}`
          : "order[by]=username&order[type]=asc";
        const isActiveFilter =
          filters?.isActive?.length === 1 ? `filter[isActive][eq]=${filters.isActive[0] === "activated"}` : "";
        fetchData(pagination.current, limit, undefined, isActiveFilter, order);
      }}
    />
  );
}

export default UserList;
