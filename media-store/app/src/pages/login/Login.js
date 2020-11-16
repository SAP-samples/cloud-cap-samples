import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { login } from "../../api-service";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../GlobalContext";
import { useErrors } from "../../useErrors";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};
const MESSAGE_TIMEOUT = 2;

const Login = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { setLoading, setUser } = useGlobals();
  const { handleError } = useErrors();

  const onFinish = (values) => {
    console.log("Validation Success:", values);
    setLoading(true);
    login({ email: values.email, password: values.password })
      .then((response) => {
        const { ID, email, level, token, roles } = response.data;
        setUser({
          ID,
          roles,
          email,
          level,
          token,
        });
        history.push("/");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          form.resetFields();
          message.error("Invalid credentials!", MESSAGE_TIMEOUT);
        } else {
          handleError(error);
        }
      })
      .then(() => setLoading(false));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input style={{ borderRadius: 6 }} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password style={{ borderRadius: 6 }} />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export { Login };
