import React from "react";
import { Menu, Badge } from "antd";
import { isEmpty } from "lodash";
import {
  CreditCardOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useGlobals } from "./GlobalContext";
import "./Header.css";

const { SubMenu } = Menu;

const keys = ["/", "/person", "/login", "/manage", "/invoice"];
const AVAILABLE_LOCALES = ["en", "fr", "de"];
const RELOAD_LOCATION_NUMBER = 0;

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const { user, invoicedItems, setUser, locale, setLocale } = useGlobals();
  const currentKey = [keys.find((key) => key === location.pathname)];
  const haveInvoicedItems = !isEmpty(invoicedItems);
  const invoicedItemsLength = invoicedItems.length;

  const onChangeLocale = (value) => {
    setLocale(value);
    history.go(RELOAD_LOCATION_NUMBER);
  };
  const localeElements = AVAILABLE_LOCALES.filter(
    (localeName) => localeName !== locale
  ).map((curLocale, index) => (
    <Menu.Item
      key={`${index}${curLocale}`}
      onClick={() => onChangeLocale(curLocale)}
    >
      {curLocale}
    </Menu.Item>
  ));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingLeft: "15vh",
        paddingRight: "15vh",
        background: "white",
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        style={{ width: "50%" }}
        selectedKeys={currentKey}
      >
        <Menu.Item key="/" onClick={() => history.push("/")}>
          Browse
        </Menu.Item>

        {!!user && (
          <Menu.Item key="/person" onClick={() => history.push("/person")}>
            Profile
          </Menu.Item>
        )}
        {!!user && user.roles.includes("employee") && (
          <Menu.Item key="/manage" onClick={() => history.push("/manage")}>
            Manage
          </Menu.Item>
        )}
      </Menu>

      <Menu
        style={{ width: "50%", display: "flex", justifyContent: "flex-end" }}
        theme="light"
        mode="horizontal"
        selectedKeys={currentKey}
      >
        {haveInvoicedItems && !!user && user.roles.includes("customer") && (
          <Menu.Item
            style={{
              width: 40,
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => history.push("/invoice")}
            key="/invoice"
          >
            <div
              style={{
                height: "100%",
              }}
            >
              <Badge
                size="default"
                style={{ backgroundColor: "#2db7f5" }}
                count={invoicedItemsLength}
              >
                <CreditCardOutlined style={{ fontSize: 16 }} />
              </Badge>
            </div>
          </Menu.Item>
        )}

        <SubMenu title={locale}>{localeElements}</SubMenu>

        {!!user ? (
          <Menu.Item
            onClick={() => {
              setUser(undefined);
              history.push("/");
            }}
            danger
            icon={<LogoutOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        ) : (
          <Menu.Item
            key="/login"
            onClick={() => history.push("/login")}
            icon={<LoginOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export { Header };
