import React, { useMemo, createContext, useState, useEffect } from "react";
import {
  getUserFromLS,
  getLocaleFromLS,
  setUserToLS,
} from "../util/localStorageService";
import { changeUserDefaults } from "../api/axiosInstance";
import { emitter } from "../util/EventEmitter";

let counter = 0;

const globalContext = {
  error: {},
  loading: true,
  user: {
    ID: undefined,
    roles: [],
    email: undefined,
    accessToken: undefined,
    refreshToken: undefined,
  },
  locale: undefined,
  invoicedItems: [],
  notifications: [],
};
const AppStateContext = createContext(globalContext);

const AppStateContextProvider = ({ children }) => {
  const [invoicedItems, setInvoicedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [user, setUser] = useState(getUserFromLS());
  const [locale, setLocale] = useState(getLocaleFromLS());

  useEffect(() => {
    const updateUser = (newUser) => {
      console.log("USER_UPDATE WAS TRIGGERED", counter++);
      changeUserDefaults(newUser);
      setUserToLS(newUser);
      setUser(newUser);
    };
    emitter.on("UPDATE_USER", updateUser);
    return () => {
      emitter.removeListener("UPDATE_USER", updateUser);
    };
  }, []);

  const value = useMemo(
    () => ({
      error: error,
      loading: loading,
      invoicedItems: invoicedItems,
      user: user,
      locale: locale,
      setLoading,
      setError,
      setInvoicedItems,
      setUser: setUser,
      setLocale: setLocale,
    }),
    [locale, user, loading, error, invoicedItems]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContextProvider, AppStateContext };
