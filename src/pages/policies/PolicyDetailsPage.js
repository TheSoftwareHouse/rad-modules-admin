import React, { useEffect, useState, useCallback } from "react";
import { Divider, message } from "antd";
import httpClient from "../../tools/httpClient";
import PolicyUsersList from "./components/PolicyUsersList";

export function PolicyDetailsPage(props) {
  const [policyName] = useState(props.match.params.policyName);
  const [attributeName] = useState(props.match.params.attributeName);
  const [data, setData] = useState([]);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (page, limit) => {
      const data = await httpClient.getUsersByPolicy(page, limit, policyName);
      setData(data.users);
      setTotal(data.total);
    },
    [policyName],
  );

  const onDeleteUserFromPolicy = async userId => {
    try {
      await httpClient.deleteAttributeForUser(attributeName, userId);
      message.success("User deleted from policy");
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
    <>
      <h1>User with "{policyName}" policy</h1>
      <Divider />
      <PolicyUsersList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        deleteUserFromPolicy={onDeleteUserFromPolicy}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
    </>
  );
}
