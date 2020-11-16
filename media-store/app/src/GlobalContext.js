import React, { useMemo, createContext, useContext, useState } from "react";
import axios from "axios";
import { isEmpty, isArray } from "lodash";

const globalContext = {
  error: {},
  loading: true,
  user: {
    ID: undefined,
    roles: [],
    email: undefined,
    token: undefined,
  },
  locale: undefined,
  invoicedItems: [],
  notifications: [],
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);
const AVAILABLE_LOCALES = ["en", "fr", "de"];

const isValidUser = (user) => {
  return (
    !isEmpty(user) &&
    user.ID &&
    user.roles &&
    user.email &&
    user.token &&
    isArray(user.roles)
  );
};

const resetAxiosParams = () => {
  delete axios.defaults.headers.common["Authorization"];
  delete axios.defaults.userEntity;
  axios.defaults.tracksEntity = "Tracks";
};

const setAxiosParams = (user) => {
  axios.defaults.headers.common["Authorization"] = `Basic ${user.token}`;
  axios.defaults.userID = user.ID;
  if (user.roles.includes("customer")) {
    axios.defaults.userEntity = `Customers/${user.ID}`;
    axios.defaults.tracksEntity = "MarkedTracks";
  } else {
    axios.defaults.userEntity = `Employees/${user.ID}`;
    axios.defaults.tracksEntity = "Tracks";
  }
};

const useUserData = () => {
  const getUserDataFromLS = () => {
    let userFromLS;
    try {
      userFromLS = JSON.parse(localStorage.getItem("user"));
    } catch (e) {}
    if (isValidUser(userFromLS)) {
      setAxiosParams(userFromLS);
      return userFromLS;
    } else {
      localStorage.removeItem("user");
      resetAxiosParams();
    }
  };

  const setUserDataToLS = (value) => {
    if (isValidUser(value)) {
      localStorage.setItem("user", JSON.stringify(value));
      setAxiosParams(value);
    } else {
      localStorage.removeItem("user");
      resetAxiosParams();
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
