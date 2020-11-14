import { useHistory } from "react-router-dom";
import { useGlobals } from "./GlobalContext";
import { message } from "antd";

const MESSAGE_TIMEOUT = 2;

const useErrors = () => {
  const history = useHistory();
  const { setError, setUser, setLoading } = useGlobals();

  const handleError = (error) => {
    console.error("Error", error);

    console.log("error", error);
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        setUser(undefined);
        setLoading(false);
        // message.error("You are unauthorized, try login again", MESSAGE_TIMEOUT);
        // history.push("/login");
        // return;
      }

      setError({
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data.error
          ? error.response.data.error.message
          : error.response.data,
      });
    } else {
      setError({
        status: "",
        statusText: "Network error",
        message: "Please, check your connection",
      });
    }

    history.push("/error");
  };

  return {
    handleError,
  };
};

export { useErrors };
