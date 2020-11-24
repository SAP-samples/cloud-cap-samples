import React from "react";
import { Redirect } from "react-router-dom";
import { useAppState } from "../hooks/useAppState";

const withRestrictions = (Component, isUserMeetRestrictions) => {
  return (props) => {
    const { user, invoicedItems } = useAppState();
    return isUserMeetRestrictions({ user, invoicedItems }) ? (
      <Component {...props} />
    ) : (
      <Redirect exact to="/error" />
    );
  };
};

export { withRestrictions };
