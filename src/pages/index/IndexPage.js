import React from "react";
import { Card, Row, Col, Button } from "antd";

export function IndexPage(props) {
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Security" extra={<a href="/users">More</a>}>
            <p>Authentication, attribute-based access control (ABAC) authorization, user management.</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Scheduler" extra={<a href="/jobs">More</a>}>
            <p>Schedule job for execution.</p>
          </Card>
        </Col>
      </Row>
    </>
  );
}
