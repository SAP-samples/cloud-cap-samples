import React, { useState, useMemo } from "react";
import { Card, Button, message } from "antd";
import { omit } from "lodash";
import { fetchPerson, confirmPerson } from "../../api/calls";
import { useErrors } from "../../hooks/useErrors";
import { useAppState } from "../../hooks/useAppState";
import { Editable } from "../../components/Editable";
import { MESSAGE_TIMEOUT } from "../../util/constants";
import { useAbortableEffect } from "../../hooks/useAbortableEffect";

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

const PersonPage = ({ myInvoicesSection }) => {
  const { setLoading } = useAppState();
  const { handleError } = useErrors();
  const [initialPerson, setInitialPerson] = useState({});
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
        console.log("personData", personData);
        if (!status.aborted) {
          setInitialPerson(personData);
          setPerson(personData);
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  }, []);

  const onConfirmChanges = () => {
    setLoading(true);
    confirmPerson(person)
      .then(() => {
        setInitialPerson(person);
        message.success("Person successfully updated", MESSAGE_TIMEOUT);
      })
      .catch(handleError)
      .finally(() => setLoading(false));
  };
  const isPersonChanged = useMemo(() => {
    const keysOne = Object.keys(initialPerson);
    const keysTwo = Object.keys(person);
    if (keysOne.length !== keysTwo.length) {
      return true;
    }

    for (let key of keysOne) {
      if (initialPerson[key] !== person[key]) {
        return true;
      }
    }

    return false;
  }, [person, initialPerson]);

  const personProperties = Object.keys(person).reduce((acc, currentKey) => {
    if (currentKey === "email") {
      return acc;
    }
    return acc.concat([
      <div key={currentKey}>
        {PERSON_PROP[currentKey]}
        <Editable
          type="text"
          value={person[currentKey]}
          onChange={(value) =>
            setPerson({ ...person, [`${currentKey}`]: value })
          }
        />
      </div>,
    ]);
  }, []);

  return (
    <>
      <Card title={`${person.lastName} ${person.firstName}`}>
        {personProperties}
        <div>
          Email: <span style={{ fontWeight: 600 }}>{person.email}</span>
        </div>
        {isPersonChanged && (
          <Button
            type="primary"
            style={{ margin: 10 }}
            onClick={onConfirmChanges}
          >
            Confirm changes
          </Button>
        )}
      </Card>
      {myInvoicesSection}
    </>
  );
};

export { PersonPage };
