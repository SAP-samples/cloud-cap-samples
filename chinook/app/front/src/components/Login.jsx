import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { login } from '../api/calls';
import { useAppState } from '../hooks/useAppState';
import { useErrors } from '../hooks/useErrors';
import { MESSAGE_TIMEOUT } from '../util/constants';
import { emitter } from '../util/EventEmitter';

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
  const [form] = Form.useForm();
  const history = useHistory();
  const { setLoading, setInvoicedItems } = useAppState();
  const { handleError } = useErrors();

  const onFinish = (values) => {
    setLoading(true);
    login({ email: values.email, password: values.password })
      .then(({ data: user }) => {
        emitter.emit('UPDATE_USER', user);
        if (user.roles.includes('employee')) {
          setInvoicedItems([]);
        }
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          form.resetFields();
          message.error('Invalid credentials!', MESSAGE_TIMEOUT);
        } else {
          handleError(error);
        }
      })
      .finally(() => setLoading(false));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation Failed:', errorInfo);
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
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password style={{}} />
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

export default Login;
