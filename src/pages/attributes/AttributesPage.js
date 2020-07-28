import React, { useState } from "react";
import { useEffect } from "react";
import { message, Input } from "antd";
import httpClient from "../../tools/httpClient";
import "./AttributesPage.css";
import AttributesList from "./components/AttributesList";

const { Search } = Input;

export function AttributesPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [highlight, setHighlight] = useState("");
  const [order, setOrder] = useState("order[by]=name&order[type]=asc");

  const fetchData = async (page, limit, _filter = filter, _order = order) => {
    const data = await httpClient.getAttributes(page, limit, _filter, _order);
    setFilter(_filter);
    setOrder(_order);
    setData(data.attributes);
    setTotal(data.total);
  };

  const onAttributeDelete = async (userId, name) => {
    try {
      await httpClient.deleteUserAttribute(userId, name);
      message.success(`Attribute "${name}" deleted`);
    } catch (error) {
      message.error(error.message);
    } finally {
      await fetchData(currentPage, limit);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, []);

  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={event => {
          const value = event.target.value;
          const filter =
            value === ""
              ? ""
              : `filter[name][includeOr]=${encodeURIComponent(
                  value,
                )}&filter[user.username][includeOr]=${encodeURIComponent(value)}`;
          setHighlight(value);
          fetchData(currentPage, limit, filter, order);
        }}
        style={{ width: 200 }}
      />
      <br />
      <br />
      <AttributesList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        attributeDelete={onAttributeDelete}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
        highlight={highlight}
      />
    </div>
  );
}
