import React from "react";
import { Button, Divider, Popconfirm } from "antd";

function UserDetailsActions(props) {
  const { showModal, userDeactivate, userActivate, userDelete, isActive } = props;

  return (
    <>
      <Button type={"primary"} onClick={() => showModal("resetPassword")}>
        Set new password
      </Button>

      <Divider type="vertical" />

      <Button type={"primary"} onClick={() => showModal("addNewAttribute")}>
        Add new attribute
      </Button>

      <Divider type="vertical" />

      <Button type={"primary"} onClick={() => (isActive ? userDeactivate() : userActivate())}>
        {isActive ? "Deactivate" : "Active"}
      </Button>

      <Divider type="vertical" />

      <Popconfirm title="Are you sure delete the user?" onConfirm={() => userDelete()} okText="Yes" cancelText="No">
        <Button type={"danger"}>Delete</Button>
      </Popconfirm>
    </>
  );
}

export default UserDetailsActions;
