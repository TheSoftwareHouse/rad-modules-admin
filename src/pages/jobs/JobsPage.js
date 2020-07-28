import React, { useEffect, useState } from "react";
import { Button, Divider, Input, message } from "antd";
import httpClient from "../../tools/httpClient";
import "./JobsPage.css";
import JobsList from "./components/JobsList";
import AddJobModal from "./components/AddJobModal";

const { Search } = Input;

export function JobsPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [highlight, setHighlight] = useState("");
  const [order, setOrder] = useState("order[by]=name&order[type]=asc");
  const [modalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState([]);

  const fetchData = async (page, limit, _nameFilter = nameFilter, _statusFilter = statusFilter, _order = order) => {
    const filter = [_nameFilter, _statusFilter].join("&");
    const data = await httpClient.getSchedulerJobs(page, limit, filter, _order);
    setNameFilter(_nameFilter);
    setStatusFilter(_statusFilter);
    setOrder(_order);
    setData(data.jobs);
    setTotal(data.total);
  };

  const onJobCancel = async id => {
    try {
      await httpClient.jobCancel(id);
      message.success("Job cancelled");
      await fetchData(currentPage, limit);
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const showModal = async () => {
    setServices(await httpClient.getSchedulerServices());
    setModalVisible(true);
  };

  return (
    <>
      <Button type={"primary"} onClick={() => showModal()}>
        Schedule job
      </Button>
      <Divider />
      <Search
        placeholder="input search text"
        onChange={event => {
          const value = event.target.value;
          const nameFilter = value === "" ? "" : `filter[name][include]=${value}`;
          setHighlight(value);
          fetchData(currentPage, limit, nameFilter, statusFilter, order);
        }}
        style={{ width: 200 }}
      />
      <br />
      <br />
      <JobsList
        data={data}
        total={total}
        limit={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchData={fetchData}
        jobCancel={onJobCancel}
        highlight={highlight}
      />
      <AddJobModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        services={services}
        limit={limit}
        currentPage={currentPage}
        fetchData={fetchData}
      />
    </>
  );
}
