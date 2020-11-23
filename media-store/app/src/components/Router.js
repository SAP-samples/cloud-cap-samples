import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { isEmpty } from "lodash";
import { TracksContainer } from "../pages/tracks/TracksPage";
import { CurrentPageHeader } from "./CurrentPageHeader";
import { Header } from "../components/Header";
import { PersonPage } from "../pages/person/PersonPage";
import { ErrorPage } from "../pages/ErrorPage";
import { Login } from "../pages/login/Login";
import {
  withRestrictions,
  withRestrictedSection,
} from "../hocs/withRestrictions";
import { InvoicePage } from "../pages/invoice/InvoicePage";
import { ManageStore } from "../pages/manage-store/ManageStore";
import { MyInvoices } from "../pages/person/MyInvoices";

const needCustomer = ({ user }) => !!user && user.roles.includes("customer");

const RestrictedLogin = withRestrictions(Login, ({ user }) => !user);
const RestrictedInvoicePage = withRestrictions(
  InvoicePage,
  ({ user, invoicedItems }) => needCustomer({ user }) && !isEmpty(invoicedItems)
);
const RestrictedMyInvoicesSection = withRestrictedSection(
  MyInvoices,
  needCustomer
);
const RestrictedPersonPage = withRestrictions(PersonPage, ({ user }) => !!user);
const RestrictedManageStore = withRestrictions(
  ManageStore,
  ({ user }) => !!user && user.roles.includes("employee")
);

const MyRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/error">
          <ErrorPage />
        </Route>
        <Route>
          <Header />
          <div style={{ padding: "2em 20vh" }}>
            <CurrentPageHeader />
            <Switch>
              <Route exact path={["/"]}>
                <TracksContainer />
              </Route>
              <Route exact path="/person">
                <RestrictedPersonPage
                  myInvoicesSection={<RestrictedMyInvoicesSection />}
                />
              </Route>
              <Route exact path="/login">
                <RestrictedLogin />
              </Route>
              <Route exact path="/invoice">
                <RestrictedInvoicePage />
              </Route>
              <Route exact path="/manage">
                <RestrictedManageStore />
              </Route>
              <Route>
                <Redirect to="/error" />
              </Route>
            </Switch>
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export { MyRouter };
