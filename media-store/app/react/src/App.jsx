import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { Layout } from 'antd';
import { MyRouter } from './components/Router';
import { AppStateContextProvider } from './contexts/AppStateContext';

const App = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <AppStateContextProvider>
        <MyRouter />
      </AppStateContextProvider>
    </Layout>
  );
};

export default App;
