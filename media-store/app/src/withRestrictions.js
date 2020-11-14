import React from "react";
import { Redirect } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const withRestrictions = (Component, isUserMeetRestrictions) => {
  return (props) => {
    const { user, invoicedItems } = useGlobals();
    return isUserMeetRestrictions({ user, invoicedItems }) ? (
      <Component {...props} />
    ) : (
      <Redirect exact to="/error" />
    );
  };
};

const withRestrictedSection = (Component, isUserMeetRestrictions) => {
  return (props) => {
    const { user, invoicedItems } = useGlobals();
    return (
      isUserMeetRestrictions({ user, invoicedItems }) && (
        <Component {...props} />
      )
    );
  };
};

export { withRestrictions, withRestrictedSection };
