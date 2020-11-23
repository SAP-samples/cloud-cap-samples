import { useHistory } from "react-router-dom";
import { useAppState } from "./useAppState";
import { emitter } from "../util/EventEmitter";
import { message } from "antd";
import { MESSAGE_TIMEOUT } from "../util/constants";

const useErrors = () => {
  const history = useHistory();
  const { setError } = useAppState();

  const handleError = (error) => {
    console.error("Error", error);

    if (error.response) {
      if (error.response.status === 401) {
        emitter.emit("UPDATE_USER", undefined);
        message.error("You are unauthorized, try login again", MESSAGE_TIMEOUT);
      }

      const { status, statusText, data } = error.response;
      setError({
        status,
        statusText,
        message: data.error ? data.error.message : data,
      });
    } else {
      setError({
        status: "",
        statusText: "Error",
        message: "Something went wrong",
      });
    }

    history.push("/error");
  };

  return {
    handleError,
  };
};

export { useErrors };
