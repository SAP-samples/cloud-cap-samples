import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { isEmpty } from "lodash";
import { TracksContainer } from "../pages/TracksPage";
import { Header } from "../components/Header";
import { PersonPage } from "../pages/PersonPage";
import { ErrorPage } from "../pages/ErrorPage";
import { Login } from "../pages/Login";
import { withRestrictions } from "../hocs/withRestrictions";
import { InvoicePage } from "../pages/InvoicePage";
import { ManageStore } from "../pages/ManageStore";
import { MyInvoicesPage } from "../pages/MyInvoicesPage";
import { requireEmployee } from "../util/constants";

const RestrictedLogin = withRestrictions(Login, ({ user }) => !user);
const RestrictedInvoicePage = withRestrictions(
  InvoicePage,
  ({ user, invoicedItems }) => !requireEmployee(user) && !isEmpty(invoicedItems)
);
const RestrictedPersonPage = withRestrictions(PersonPage, ({ user }) => !!user);
const RestrictedManageStore = withRestrictions(ManageStore, ({ user }) =>
  requireEmployee(user)
);

const MyRouter = () => {
  return (
    <Router>
      <Header />
      <div style={{ padding: "2em 20vh" }}>
        <Switch>
          <Route exact path={["/", "/tracks"]}>
            <TracksContainer />
          </Route>
          <Route exact path="/person">
            <RestrictedPersonPage />
          </Route>
          <Route exact path="/login">
            <RestrictedLogin />
          </Route>
          <Route exact path="/invoice">
            <RestrictedInvoicePage />
          </Route>
          <Route exact path="/invoices">
            <MyInvoicesPage />
          </Route>
          <Route exact path="/manage">
            <RestrictedManageStore />
          </Route>
          <Route path="/">
            <ErrorPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export { MyRouter };
