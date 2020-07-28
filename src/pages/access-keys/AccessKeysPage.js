import React, { useState } from "react";
import { useEffect } from "react";
import { message, Button, Divider } from "antd";
import httpClient from "../../tools/httpClient";
import "./AccessKeysPage.css";
import AccessKeysList from "./components/AccessKeysList";

export function AccessKeysPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page, limit) => {
    const data = await httpClient.getAccessKeys(page, limit);
    setData(data.accessKeys);
    setTotal(data.total);
  };

  const confirm = async apiKey => {
    await httpClient.deleteAccessKey(apiKey);
    message.success("Access key deleted");
    await fetchData(currentPage, limit);
  };

  const addAccessKey = async () => {
    try {
      await httpClient.addAccessKey();
      message.success("Access key added");
      await fetchData(currentPage, limit);
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <>
      <Button type={"primary"} onClick={() => addAccessKey()}>
        Add Access Key
      </Button>
      <Divider />
      <AccessKeysList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        confirm={confirm}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
      />
    </>
  );
}
