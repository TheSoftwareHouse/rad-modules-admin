import React, { useEffect, useState, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { Divider, message } from "antd";
import httpClient from "../../tools/httpClient";
import UserAttributesList from "./components/UserAttributesList";
import SetNewUserPasswordModal from "./components/SetNewUserPasswordModal";
import AddNewUserAttributeModal from "./components/AddNewUserAttributeModal";
import UserDetailsActions from "./components/UserDetailsActions";

export function UserDetailsPage(props) {
  const [userId, setUserId] = useState(props.match.params.userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [user, setUser] = useState({});

  const showModal = async modalMode => {
    setModalMode(modalMode);
    setModalVisible(true);
  };

  const fetchData = useCallback(async () => {
    try {
      const user = await httpClient.getUser(userId);
      setUser(user);
    } catch (err) {
      message.error(err.message);
    }
  }, [userId]);

  const renderModal = useCallback(() => {
    switch (modalMode) {
      case "resetPassword":
        return (
          <SetNewUserPasswordModal visible={modalVisible} setModalVisible={setModalVisible} username={user.username} />
        );
      case "addNewAttribute":
        return (
          <AddNewUserAttributeModal
            visible={modalVisible}
            setModalVisible={setModalVisible}
            userId={userId}
            userAttributes={user.attributes || []}
            fetchData={fetchData}
          />
        );
      default:
        return <></>;
    }
  }, [fetchData, modalMode, modalVisible, userId, user.username]);

  const onUserAttributeDelete = async attribute => {
    try {
      await httpClient.deleteUserAttribute(userId, attribute);
      message.success("Attribute deleted");
    } catch (err) {
      message.error(err.message);
    } finally {
      await fetchData();
    }
  };

  const onUserDeactivate = async () => {
    try {
      await httpClient.deactivateUser(userId);
      await fetchData();
      message.success("User deactivated");
    } catch (err) {
      message.error(err.message);
    }
  };

  const onUserActivate = async () => {
    try {
      const { activationToken } = await httpClient.getUser(userId);
      await httpClient.activateUser(activationToken);
      await fetchData();
      message.success("User activated");
    } catch (err) {
      message.error(err.message);
    }
  };

  const onUserDelete = async () => {
    try {
      await httpClient.deleteUser(userId);
      setUserId("");
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchData(userId);
  }, []);

  return userId === "" ? (
    <Redirect to={"/"} />
  ) : (
    <div>
      <UserDetailsActions
        showModal={showModal}
        userDeactivate={onUserDeactivate}
        userActivate={onUserActivate}
        userDelete={onUserDelete}
        isActive={user.isActive}
      />
      <Divider />
      <h1>Details of: {user.username}</h1>
      <UserAttributesList data={user.attributes} userAttributeDelete={onUserAttributeDelete} />
      {renderModal()}
    </div>
  );
}
