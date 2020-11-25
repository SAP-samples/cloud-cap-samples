import React, { useState } from "react";
import { Form, Button, message, Input } from "antd";
import { omit, map } from "lodash";
import { fetchPerson, confirmPerson } from "../api/calls";
import { useErrors } from "../hooks/useErrors";
import { useAppState } from "../hooks/useAppState";
import { MESSAGE_TIMEOUT } from "../util/constants";
import { useAbortableEffect } from "../hooks/useAbortableEffect";

const PERSON_PROP = {
  address: "Address ",
  city: "City ",
  country: "Country ",
  fax: "Fax: ",
  firstName: "First name: ",
  lastName: "Last name: ",
  phone: "Phone: ",
  postalCode: "Postal code: ",
  state: "State",
  email: "email",
  company: "Company: ",
};

const PersonPage = () => {
  const { setLoading } = useAppState();
  const { handleError } = useErrors();
  const [form] = Form.useForm();
  const [person, setPerson] = useState({
    lastName: "",
    firstName: "",
    city: "",
    state: "",
    address: "",
    country: "",
    phone: "",
    postalCode: "",
    fax: "",
    email: "",
    company: "",
  });

  useAbortableEffect((status) => {
    setLoading(true);

    fetchPerson()
      .then(({ data: personData }) => {
        personData = omit(personData, "@odata.context", "ID");
        if (!status.aborted) {
          setPerson(personData);
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, []);

  const onConfirmChanges = (newPerson) => {
    setLoading(true);
    confirmPerson(newPerson)
      .then(() => {
        message.success("Person successfully updated", MESSAGE_TIMEOUT);
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  const personProperties = map(Object.keys(person), (currentKey) => (
    <div key={currentKey}>
      <Form.Item label={PERSON_PROP[currentKey]} name={currentKey}>
        <Input />
      </Form.Item>
    </div>
  ));

  return (
    <>
      {person.lastName !== "" && (
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onConfirmChanges}
          onFinishFailed={() => console.log("Not valid params provided")}
          initialValues={{
            ...person,
          }}
        >
          {personProperties}
          <Form.Item
            type="primary"
            wrapperCol={{
              span: 14,
              offset: 4,
            }}
          >
            <Button onClick={() => form.submit()}>Confirm changes</Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export { PersonPage };
