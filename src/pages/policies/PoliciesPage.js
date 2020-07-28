import React, { useState } from "react";
import { useEffect } from "react";
import { message, Divider, Button, Input } from "antd";
import { CONFLICT } from "http-status-codes";
import httpClient from "../../tools/httpClient";
import "./PoliciesPage.css";
import PoliciesList from "./components/PoliciesList";
import AddPolicyModal from "./components/AddPolicyModal";

const { Search } = Input;

export function PoliciesPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [resourceFilter, setResourceFilter] = useState("");
  const [highlight, setHighlight] = useState("");
  const [order, setOrder] = useState("order[by]=resource&order[type]=asc");

  const fetchData = async (page, limit, _resourceFilter = resourceFilter, _order = order) => {
    const data = await httpClient.getPolicies(page, limit, _resourceFilter, _order);
    setResourceFilter(_resourceFilter);
    setOrder(_order);
    setData(data.policies);
    setTotal(data.total);
  };

  const onPolicyDelete = async id => {
    try {
      await httpClient.deletePolicy(id);
      message.success("Policy deleted");
      await fetchData(currentPage, limit);
    } catch (error) {
      if (error.response.status === CONFLICT) {
        message.success("Cannot delete base policy");
      } else {
        message.success("Unknown error");
      }
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, []);

  return (
    <>
      <Button type={"primary"} onClick={() => showModal()}>
        Add Policy
      </Button>
      <Divider />
      <Search
        placeholder="input search text"
        onChange={event => {
          const value = event.target.value;
          const filter =
            value === "" ? "" : `filter[resource][includeOr]=${value}&filter[attribute][includeOr]=${value}`;
          setHighlight(value);
          fetchData(currentPage, limit, filter, order);
        }}
        style={{ width: 200 }}
      />
      <br />
      <br />
      <PoliciesList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        policyDelete={onPolicyDelete}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
        highlight={highlight}
      />
      <AddPolicyModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        fetchData={fetchData}
        limit={limit}
        currentPage={currentPage}
      />
    </>
  );
}
