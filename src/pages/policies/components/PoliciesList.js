import React from "react";
import { Table, Icon, Popconfirm, Divider } from "antd";
import { Highlighted } from "../../../tools/highlighted";

function PoliciesList(props) {
  const { data, total, limit, currentPage, policyDelete, setCurrentPage, fetchData, highlight } = props;
  const columns = [
    {
      title: "#",
      key: "index",
      render: (value, item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <a href={`/policies/details/${record.attribute}/${record.resource}`}>
          <Highlighted text={text} highlight={highlight}></Highlighted>
        </a>
      ),
    },
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
      sorter: () => undefined,
      sortDirections: ["descend", "ascend"],
      // render: text => <Highlighted text={text} highlight={filter}></Highlighted>,
      render: (text, record) => {
        return (
          <a href={`/users/attribute/${record.attribute}`}>
            <Highlighted text={text} highlight={highlight}></Highlighted>
          </a>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (text, record) => (
        <div className="project-action-icons">
          <a href={`/policies/details/${record.attribute}/${record.resource}`} title="details">
            <Icon type="search" />
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete this policy?"
            onConfirm={() => policyDelete(record.id)}
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
          ? `order[by]=${sorter.field}&order[type]=${sorter.order === "descend" ? "desc" : "asc"}`
          : "order[by]=resource&order[type]=asc";
        fetchData(pagination.current, limit, undefined, order);
      }}
    />
  );
}

export default PoliciesList;
