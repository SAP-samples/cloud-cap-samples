import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { login } from "../../api-service";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../GlobalContext";
import { useErrors } from "../../useErrors";

const USER_SERVICE = "http://localhost:4004/users";

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

const Login = () => {
  const history = useHistory();
  const { setLoading, setUser } = useGlobals();
  const { handleError } = useErrors();

  const onFinish = (values) => {
    console.log("Validation Success:", values);
    setLoading(true);
    login({ email: values.email, password: values.password })
      .then((response) => {
        console.log(response.data);
        const { ID, email, level, token, roles } = response.data;
        setUser({
          ID,
          roles,
          email,
          level,
          token,
        });
        setLoading(false);
        history.push("/");
      })
      .catch(handleError);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <Form
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
