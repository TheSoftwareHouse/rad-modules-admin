import React from "react";
import { Table, Icon, Popconfirm } from "antd";

const parseDateTimeString = text => text.replace("T", " ").substring(0, text.length - 5);

function AccessKeysList(props) {
  const { data, total, limit, currentPage, confirm, setCurrentPage, fetchData } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "Access Key",
      dataIndex: "apiKey",
      key: "apiKey",
      render: text => <a>{text}</a>,
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      render: text => <a>{text}</a>,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: text => <a>{parseDateTimeString(text)}</a>,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <div className="project-action-icons">
          <Popconfirm
            title="Are you sure delete this access key?"
            onConfirm={() => confirm(record.apiKey)}
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
        onChange(current) {
          setCurrentPage(current);
          fetchData(current, limit);
        },
      }}
    />
  );
}

export default AccessKeysList;
