import React from 'react';
import { Menu, Badge, Spin } from 'antd';
import { isEmpty } from 'lodash';
import {
  CreditCardOutlined,
  LogoutOutlined,
  LoginOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { setLocaleToLS } from '../util/localStorageService';
import { changeLocaleDefaults } from '../api/axiosInstance';
import { emitter } from '../util/EventEmitter';
import './Header.css';
import { requireEmployee, requireCustomer } from '../util/constants';

const { SubMenu } = Menu;

const keys = ['/', '/person', '/login', '/manage', '/invoice', '/invoices'];
const AVAILABLE_LOCALES = ['en', 'fr', 'de'];
const RELOAD_LOCATION_NUMBER = 0;

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const { user, invoicedItems, setInvoicedItems, locale, setLocale, loading } = useAppState();
  const currentKey = [keys.find((key) => key === location.pathname)];
  const haveInvoicedItems = !isEmpty(invoicedItems);
  const invoicedItemsLength = invoicedItems.length;

  const onChangeLocale = (value) => {
    setLocaleToLS(value);
    changeLocaleDefaults(value);
    setLocale(value);
    history.go(RELOAD_LOCATION_NUMBER);
  };
  const localeElements = AVAILABLE_LOCALES.filter((localeName) => localeName !== locale).map(
    (curLocale, index) => (
      <Menu.Item key={`${index}${curLocale}`} onClick={() => onChangeLocale(curLocale)}>
        {curLocale}
      </Menu.Item>
    )
  );

  const onUserLogout = () => {
    emitter.emit('UPDATE_USER', undefined);
    history.go(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'baseline',
        alignItems: 'center',
        paddingLeft: '15vh',
        paddingRight: '15vh',
        background: 'white',
      }}
    >
      <Menu theme="light" mode="horizontal" style={{ width: '50%' }} selectedKeys={currentKey}>
        <Menu.Item key="/" onClick={() => history.push('/')}>
          Browse
        </Menu.Item>

        {!!user && (
          <Menu.Item key="/person" onClick={() => history.push('/person')}>
            Profile
          </Menu.Item>
        )}
        {requireCustomer(user) && (
          <Menu.Item key="/invoices" onClick={() => history.push('/invoices')}>
            Invoices
          </Menu.Item>
        )}
        {requireEmployee(user) && (
          <Menu.Item key="/manage" onClick={() => history.push('/manage')}>
            Manages
          </Menu.Item>
        )}
        <span>
          {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
        </span>
      </Menu>

      <Menu
        style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}
        theme="light"
        mode="horizontal"
        selectedKeys={currentKey}
      >
        {haveInvoicedItems && (
          <Menu.Item
            style={{
              width: 40,
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={() => history.push('/invoice')}
            key="/invoice"
          >
            <div
              style={{
                height: '100%',
              }}
            >
              <Badge
                size="default"
                style={{ backgroundColor: '#2db7f5' }}
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
            onClick={onUserLogout}
            danger
            icon={<LogoutOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        ) : (
          <Menu.Item
            key="/login"
            onClick={() => history.push('/login')}
            icon={<LoginOutlined style={{ fontSize: 16 }} />}
          ></Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Header;
