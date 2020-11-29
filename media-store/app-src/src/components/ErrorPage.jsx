import React from 'react';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Result, Button } from 'antd';
import { useAppState } from '../hooks/useAppState';

const ErrorPage = () => {
  const { error, setError } = useAppState();
  const history = useHistory();

  const onGoHome = () => {
    setError({});
    history.push('/');
  };

  const goLoginPage = () => {
    setError({});
    history.push('/login');
  };

  const goHomeButton = (
    <Button onClick={onGoHome} key={1} type="primary">
      Back Home
    </Button>
  );
  const goLoginButton = (
    <Button onClick={goLoginPage} key={2} type="primary">
      Login
    </Button>
  );

  const errorResultProps = isEmpty(error)
    ? {
        status: 404,
        title: 'Not found',
        subTitle: 'Sorry, the page you visited does not exist.',
        extra: goHomeButton,
      }
    : {
        status: [404, 403, 500].includes(error.status) ? error.status : 'error',
        title: error.statusText,
        subTitle: error.message,
        extra: error.status === 401 ? [goHomeButton, goLoginButton] : goHomeButton,
      };

  return <Result {...errorResultProps} />;
};

export default ErrorPage;
