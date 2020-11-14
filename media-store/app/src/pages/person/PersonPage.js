import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, message } from "antd";
import { omit } from "lodash";
import { fetchPerson, confirmPerson } from "../../api-service";
import { useErrors } from "../../useErrors";
import { useGlobals } from "../../GlobalContext";
import { Editable } from "../../Editable";

const MESSAGE_TIMEOUT = 2;
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
  const { setLoading } = useGlobals();
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

  useEffect(() => {
    setLoading(true);

    fetchPerson()
      .then((response) => {
        let { data: personData } = response;
        personData = omit(personData, "@odata.context", "ID");
        console.log("personData", personData);
        setInitialPerson(personData);
        setPerson(personData);
        setLoading(false);
      })
      .catch(handleError);
  }, []);

  const onConfirmChanges = () => {
    setLoading(true);
    confirmPerson(person)
      .then(() => {
        setLoading(false);
        setInitialPerson(person);
        message.success("Person successfully updated", MESSAGE_TIMEOUT);
      })
      .catch(handleError);
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
      <Card
        style={{ borderRadius: 6 }}
        title={`${person.lastName} ${person.firstName}`}
      >
        {personProperties}
        <div>
          Email: <span style={{ fontWeight: 600 }}>{person.email}</span>
        </div>
        {isPersonChanged && (
          <Button
            type="primary"
            style={{ margin: 10, borderRadius: 6 }}
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
