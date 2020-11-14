import React from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { Result, Button } from "antd";
import { useGlobals } from "../GlobalContext";

const ErrorPage = () => {
  const { error, setError } = useGlobals();
  const history = useHistory();

  const onGoHome = () => {
    setError({});
    history.push("/");
  };

  const errorResultProps = isEmpty(error)
    ? {
        status: 404,
        title: "Not found",
        subTitle: "Sorry, the page you visited does not exist.",
      }
    : {
        status: [404, 403, 500].includes(error.status)
          ? error.status
          : undefined,
        title: `${error.status} ${error.statusText}`,
        subTitle: error.message,
      };

  return (
    <Result
      {...errorResultProps}
      extra={
        <Button onClick={onGoHome} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export { ErrorPage };
