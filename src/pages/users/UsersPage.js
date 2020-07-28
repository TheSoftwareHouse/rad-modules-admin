import React, { useState, useEffect } from "react";
import "./UsersPage.css";
import { Button, Input, Divider, message } from "antd";
import httpClient from "../../tools/httpClient";
import UserList from "./components/UserList";
import AddUserModal from "./components/AddUserModal";

const { Search } = Input;

export function UsersPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState("order[by]=username&order[type]=asc");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("filter[isActive][eq]=true");
  const [highlight, setHighlight] = useState("");
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async (
    page,
    limit,
    _usernameFilter = usernameFilter,
    _isActiveFilter = isActiveFilter,
    _order = order,
  ) => {
    const filter = `${_usernameFilter}${
      _usernameFilter !== "" && _isActiveFilter !== "" ? `&${_isActiveFilter}` : _isActiveFilter
    }`;

    const data = await httpClient.getUsers(page, limit, filter, _order);
    setUsernameFilter(_usernameFilter);
    setIsActiveFilter(_isActiveFilter);
    setOrder(_order);
    setData(data.users);
    setTotal(data.total);
    setCurrentPage(data.page);
  };

  const onUserDelete = async id => {
    try {
      await httpClient.deleteUser(id);
      message.success("User deleted");
      await fetchData(currentPage, limit);
    } catch (err) {
      message.error(err.message);
    }
  };

  const onUserDeactivate = async id => {
    try {
      await httpClient.deactivateUser(id);
      await fetchData(currentPage, limit);
      message.success("User deactivated");
    } catch (err) {
      message.error(err.message);
    }
  };

  const onUserActivate = async activationToken => {
    try {
      await httpClient.activateUser(activationToken);
      await fetchData(currentPage, limit);
      message.success("User activated");
    } catch (err) {
      message.error(err.message);
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    fetchData(currentPage, limit, usernameFilter, isActiveFilter, order);
  }, []);
  return (
    <>
      <Button type={"primary"} onClick={() => showModal()}>
        Add User
      </Button>
      <Divider />
      <Search
        placeholder="input search text"
        onChange={event => {
          const value = event.target.value;
          const filter = value === "" ? "" : `filter[username][include]=${value}`;
          setHighlight(value);
          fetchData(currentPage, limit, filter, isActiveFilter, order);
        }}
        style={{ width: 200 }}
      />
      <br />
      <br />
      <UserList
        data={data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        limit={limit}
        total={total}
        setIsActiveFilter={setIsActiveFilter}
        setOrder={setOrder}
        fetchData={fetchData}
        userDelete={onUserDelete}
        userDeactivate={onUserDeactivate}
        userActivate={onUserActivate}
        highlight={highlight}
      />
      <AddUserModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        fetchData={fetchData}
        limit={limit}
        currentPage={currentPage}
      />
    </>
  );
}
