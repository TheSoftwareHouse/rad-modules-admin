import React from "react";

import "./UnauthorizedPage.css";

export class UnauthorizedPage extends React.Component {
  render() {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-message">You are unauthorized</div>
      </div>
    );
  }
}
