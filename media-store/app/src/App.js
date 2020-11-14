import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Layout } from "antd";
import { MyRouter } from "./Router";
import { GlobalContextProvider } from "./GlobalContext";

const App = () => {
  return (
    <Layout style={{ height: "100%" }}>
      <GlobalContextProvider>
        <MyRouter />
      </GlobalContextProvider>
    </Layout>
  );
};

export default App;
