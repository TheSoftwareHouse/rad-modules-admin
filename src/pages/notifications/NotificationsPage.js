import React, { useEffect, useState } from "react";
import { Input } from "antd";
import httpClient from "../../tools/httpClient";
import "./NotificationsPage.css";
import NotificationsList from "./components/NotificationsList";

const { Search } = Input;

export function NotificationsPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [highlight, setHighlight] = useState("");
  const [order, setOrder] = useState("order[by]=createdAt&order[type]=asc");

  const fetchData = async (page, limit, _nameFilter = nameFilter, _statusFilter = statusFilter, _order = order) => {
    const filter = [_nameFilter, _statusFilter].join("&");
    const data = await httpClient.getNotifications(page, limit, filter, _order);
    setNameFilter(_nameFilter);
    setStatusFilter(_statusFilter);
    setOrder(_order);
    setData(data.notifications);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchData(currentPage, limit, nameFilter, undefined, order);
  }, []);

  return (
    <>
      <Search
        placeholder="input search text"
        onChange={event => {
          const value = event.target.value;
          const nameFilter = value === "" ? "" : `filter[channel][include]=${value}`;
          setHighlight(value);
          fetchData(currentPage, limit, nameFilter, statusFilter, order);
        }}
        style={{ width: 200 }}
      />
      <br />
      <br />
      <NotificationsList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
        highlight={highlight}
      />
    </>
  );
}
