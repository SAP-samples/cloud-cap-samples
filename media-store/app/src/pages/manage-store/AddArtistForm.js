import React from "react";
import { Form, Input } from "antd";

const REQUIRED = [
  {
    required: true,
    message: "This filed is required!",
  },
];

const AddArtistForm = () => {
  return (
    <>
      <h3>Add artist</h3>
      <Form.Item label="Name" name="name" rules={REQUIRED}>
        <Input />
      </Form.Item>
    </>
  );
};

export { AddArtistForm };
