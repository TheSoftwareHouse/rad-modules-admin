import React from "react";
import { Icon, Popconfirm, Table } from "antd";
import { Highlighted } from "../../../tools/highlighted";

const parseDateTimeString = text => text.replace("T", " ").substring(0, text.length - 5);

function NotificationsList(props) {
  const { data, total, limit, currentPage, setCurrentPage, fetchData, jobCancel, highlight } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => text,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => text,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => parseDateTimeString(text),
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
          : "order[by]=name&order[type]=asc";
        fetchData(pagination.current, limit, undefined, undefined, order);
      }}
    />
  );
}

export default NotificationsList;
