import React, { useEffect, useState, useCallback } from "react";
import { AutoComplete, Divider, message } from "antd";
import httpClient from "../../tools/httpClient";
import AttributeUsersList from "./components/AttributeUsersList";

export function AttributeDetailsPage(props) {
  const attributeName = props.match.params.attributeName;
  const [data, setData] = useState([]);
  const [usersNames, setUsersNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (page, limit) => {
    const data = await httpClient.getUsers(
      page,
      limit,
      `filter[attribute.name][eq]=${attributeName}`,
      "order[by]=username&order[type]=asc",
    );
    setData(data.users);
    setTotal(data.total);
  }, []);

  const fetchUsers = async username => {
    if (!username || username.length == 0) {
      return [];
    }
    const data = await httpClient.getUsers(
      1,
      200,
      `filter[username][include]=${username}`,
      "order[by]=username&order[type]=asc",
    );
    setUsersNames(data.users.map(user => user.username));
    setUsers(data.users);

    return users;
  };

  const deleteUserAttribute = async userId => {
    try {
      await httpClient.deleteUserAttribute(userId, attributeName);
      message.success("User deleted from policy");
    } catch (error) {
      message.error(error.message);
    } finally {
      await fetchData(currentPage, limit);
    }
  };

  const addAttributeToUser = async userName => {
    try {
      const user = users.find(user => user.username === userName);
      await httpClient.addUserAttribute(user.id, attributeName);
      message.success("User added to policy");
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
      <h1>Users with "{attributeName}" attribute</h1>
      <AutoComplete
        dataSource={usersNames}
        onSelect={addAttributeToUser}
        onSearch={fetchUsers}
        placeholder="Add user"
      />
      <Divider />
      <AttributeUsersList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        deleteAttributeFromUser={deleteUserAttribute}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
    </div>
  );
}
