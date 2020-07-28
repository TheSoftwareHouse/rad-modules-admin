import React from "react";
import { Icon, Popconfirm, Table } from "antd";
import { Highlighted } from "../../../tools/highlighted";

const parseDateTimeString = text => text.replace("T", " ").substring(0, text.length - 5);

function JobsList(props) {
  const { data, total, limit, currentPage, setCurrentPage, fetchData, jobCancel, highlight } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => <Highlighted text={text} highlight={highlight}></Highlighted>,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => text,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: text => text,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Failed",
          value: "Failed",
        },
        {
          text: "Delayed",
          value: "Delayed",
        },
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Waiting",
          value: "Waiting",
        },
        {
          text: "Paused",
          value: "Paused",
        },
        {
          text: "Stuck",
          value: "Stuck",
        },
        {
          text: "Deleted",
          value: "Deleted",
        },
      ],
      defaultFilteredValue: [],
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
    {
      title: "Action",
      key: "actions",
      align: "right",
      render: (text, record) => {
        if (record.status === "Active" && record.jobOptions?.cron) {
          return (
            <Popconfirm
              title="Are you sure to cancel job?"
              onConfirm={() => jobCancel(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a href="/#">
                <Icon type="delete" />
              </a>
            </Popconfirm>
          );
        }
      },
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
        const statusFilter = filters?.status?.length >= 1 ? `filter[status][in]=${filters.status.join(",")}` : "";
        fetchData(pagination.current, limit, undefined, statusFilter, order);
      }}
    />
  );
}

export default JobsList;
