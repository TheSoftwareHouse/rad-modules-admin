import React, { useState } from "react";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  Tabs,
} from "antd";
import httpClient from "../../../tools/httpClient";

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

function AddJobModal(props) {
  const { visible, setModalVisible, services, limit, currentPage, fetchData } = props;
  const [actionOptions, setActionOptions] = useState([]);
  const [repeatableJob, setRepeatableJob] = useState(1);

  const cleanFrom = () => props.form.resetFields();

  const clearAllData = () => {
    setModalVisible(false);
    cleanFrom();
  };

  const fillActionSelect = service => {
    props.form.resetFields(["action"]);
    setActionOptions(
      services
        .find(item => {
          return item.service === service;
        })
        .actions.map(action => {
          return (
            <Option key={action} value={action}>
              {action}
            </Option>
          );
        }),
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const jobOptions = {
            cron: values.cron ?? undefined,
            cronStartDate: values.cronStartDate ? values.cronStartDate.format() : undefined,
            cronEndDate: values.cronEndDate ? values.cronEndDate.format() : undefined,
            cronTimeZone: values.cronTimeZone ?? undefined,
            cronLimit: values.cronLimit ?? undefined,
            delay: values.delay ?? undefined,
            timeout: values.timeout ?? undefined,
            attempts: values.attempts ?? undefined,
            backoff: values.backoff ?? undefined,
            lifo: values.lifo ? !!values.lifo : undefined,
            removeOnComplete: values.removeOnComplete ? !!values.removeOnComplete : undefined,
            removeOnFail: values.removeOnFail ? !!values.removeOnFail : undefined,
            stackTraceLimit: values.stackTraceLimit ?? undefined,
            priority: values.priority ?? undefined,
          };
          const payload = values.payload ? JSON.parse(values.payload) : undefined;
          await httpClient.scheduleJob(values.name, values.service, values.action, jobOptions, payload);
          message.success("Job scheduled");
          await fetchData(currentPage, limit);
          clearAllData();
        } catch (err) {
          message.error(err.message);
        }
      } else {
        message.error("Validation error");
      }
    });
  };

  const changeRepeatability = e => {
    setRepeatableJob(e.target.value);
  };

  const { getFieldDecorator } = props.form;

  return (
    <Modal title="Schedule job" visible={visible} onOk={handleSubmit} onCancel={clearAllData} width={"60%"}>
      <Form>
        <Form.Item label="Name">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "Please input name!" }],
          })(<Input placeholder="Name" />)}
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Service">
              {getFieldDecorator("service", {
                rules: [{ required: true, message: "Please select service!" }],
              })(
                <Select placeholder={"Select service"} onChange={e => fillActionSelect(e)}>
                  {services.map(service => {
                    return (
                      <Option key={service.service} value={service.service}>
                        {service.service}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Action">
              {getFieldDecorator("action", {
                rules: [{ required: true, message: "Please select action!" }],
              })(<Select placeholder={"Select action"}>{actionOptions}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Payload">
          {getFieldDecorator("payload", {
            rules: [{ required: false }],
          })(<TextArea placeholder="Payload JSON object" />)}
        </Form.Item>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Repeatability" key="1">
            <Radio.Group onChange={changeRepeatability}>
              <Radio value={1} checked={repeatableJob === 1}>
                One time job
              </Radio>
              <Radio value={2} checked={repeatableJob === 2}>
                Repeatable job
              </Radio>
            </Radio.Group>
            <div id="cronFields" hidden={repeatableJob === 1}>
              <Form.Item label="Cron">
                {getFieldDecorator("cron", {
                  rules: [{ required: false }],
                })(<Input placeholder="Cron expression" />)}
              </Form.Item>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item label="Cron start date">
                    {getFieldDecorator("cronStartDate", {
                      rules: [{ required: false }],
                    })(<DatePicker placeholder="Start date" showTime={true} style={{ width: "100%" }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Cron end date">
                    {getFieldDecorator("cronEndDate", {
                      rules: [{ required: false }],
                    })(<DatePicker placeholder="Start date" showTime={true} style={{ width: "100%" }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Cron time zone">
                {getFieldDecorator("cronTimeZone", {
                  rules: [{ required: false }],
                })(<Input placeholder="Time zone" />)}
              </Form.Item>
              <Form.Item label="Cron times of execution limit">
                {getFieldDecorator("cronLimit", {
                  rules: [{ required: false }],
                })(
                  <InputNumber placeholder="Number of times the job should repeat at max" style={{ width: "100%" }} />,
                )}
              </Form.Item>
            </div>
          </TabPane>
          <TabPane tab="Other settiings" key="2">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Delay">
                  {getFieldDecorator("delay", {
                    rules: [{ required: false }],
                  })(
                    <InputNumber placeholder="[ms] to wait until the job can be processed" style={{ width: "100%" }} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Timeout">
                  {getFieldDecorator("timeout", {
                    rules: [{ required: false }],
                  })(
                    <InputNumber
                      placeholder="[ms] after which the job fails with a timeout error"
                      style={{ width: "100%" }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Attempts">
                  {getFieldDecorator("attempts", {
                    rules: [{ required: false }],
                  })(
                    <InputNumber
                      placeholder="Number of attempts to try the job until it completes"
                      style={{ width: "100%" }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Backoff">
                  {getFieldDecorator("backoff", {
                    rules: [{ required: false }],
                  })(<InputNumber placeholder="Backoff delay" style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="LIFO">
              {getFieldDecorator("lifo", {
                rules: [{ required: false }],
              })(<Switch />)}
              <Divider type={"vertical"} style={{ background: "none" }} />
              <span>Add the job to the front of the queue instead of the rear</span>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Remove the job when it successfully completes">
                  {getFieldDecorator("removeOnComplete", {
                    rules: [{ required: false }],
                  })(<Switch />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Remove the job when it fails after all attempts">
                  {getFieldDecorator("removeOnFail", {
                    rules: [{ required: false }],
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Stack trace limit">
                  {getFieldDecorator("stackTraceLimit", {
                    rules: [{ required: false }],
                  })(
                    <InputNumber
                      placeholder="Number of lines that will be recorded in stack trace"
                      style={{ width: "100%" }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Priority">
                  {getFieldDecorator("priority", {
                    rules: [{ required: false }],
                  })(<InputNumber placeholder="Smaller number means higher priority" style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
}

export default Form.create({ name: "add_job" })(AddJobModal);
