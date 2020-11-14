import React, { useMemo, createContext, useContext, useState } from "react";
import axios from "axios";

const globalContext = {
  error: {},
  loading: true,
  user: {
    ID: undefined,
    roles: [],
    email: undefined,
    level: undefined,
    token: undefined,
  },
  locale: undefined,
  invoicedItems: [],
  notifications: [],
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);
const AVAILABLE_LOCALES = ["en", "fr", "de"];

const useUserData = () => {
  const getUserDataFromLS = () => {
    let userFromLS;
    try {
      userFromLS = JSON.parse(localStorage.getItem("user"));
    } catch (e) {}
    if (userFromLS) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${userFromLS.token}`;
      axios.defaults.userID = userFromLS.ID;
      axios.defaults.userEntity =
        !!userFromLS && userFromLS.roles.includes("customer")
          ? `Customers/${userFromLS.ID}`
          : `Employees/${userFromLS.ID}`;
    }
    axios.defaults.tracksEntity =
      !!userFromLS && userFromLS.roles.includes("customer")
        ? "MarkedTracks"
        : "Tracks";
    return userFromLS;
  };

  const setUserDataToLS = (value) => {
    if (!!value) {
      localStorage.setItem("user", JSON.stringify(value));
      axios.defaults.headers.common["Authorization"] = `Basic ${value.token}`;
      axios.defaults.tracksEntity = value.roles.includes("customer")
        ? "MarkedTracks"
        : "Tracks";
      axios.defaults.userEntity =
        !!value && value.roles.includes("customer")
          ? `Customers/${value.ID}`
          : `Employees/${value.ID}`;
    } else {
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.userEntity;
      axios.defaults.tracksEntity =
        !!value && value.roles.includes("customer") ? "MarkedTracks" : "Tracks";
    }
  };

  const setLocaleToLS = (value) => {
    localStorage.setItem("locale", value);
    axios.defaults.headers.common["Accept-language"] = value;
  };

  const getLocaleFromLS = () => {
    const localeFromLS = localStorage.getItem("locale");
    const selectedLocale =
      localeFromLS &&
      localeFromLS !== "undefined" &&
      AVAILABLE_LOCALES.includes(localeFromLS)
        ? localeFromLS
        : "en";
    axios.defaults.headers.common["Accept-language"] = selectedLocale;

    return selectedLocale;
  };

  return { getUserDataFromLS, setUserDataToLS, setLocaleToLS, getLocaleFromLS };
};

const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [invoicedItems, setInvoicedItems] = useState([]);
  const [user, setUser] = useState(null);
  const [locale, setLocale] = useState(undefined);
  const {
    getUserDataFromLS,
    setUserDataToLS,
    getLocaleFromLS,
    setLocaleToLS,
  } = useUserData();

  const value = useMemo(
    () => ({
      error: error,
      loading: loading,
      invoicedItems: invoicedItems,
      user: user ? user : getUserDataFromLS(),
      locale: locale ? locale : getLocaleFromLS(),
      setLoading,
      setError,
      setInvoicedItems,
      setUser: (userParam) => {
        setUserDataToLS(userParam);
        setUser(userParam);
      },
      setLocale: (localeParam) => {
        setLocaleToLS(localeParam);
        setLocale(localeParam);
      },
    }),
    [locale, user, loading, error, invoicedItems]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
