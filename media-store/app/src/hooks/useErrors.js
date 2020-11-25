import { useHistory } from "react-router-dom";
import { useAppState } from "./useAppState";

const useErrors = () => {
  const history = useHistory();
  const { setError } = useAppState();

  const handleError = (error) => {
    console.error("Error", error);

    if (error.response) {
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
        message: "Something went wrong. Seems like request is too long",
      });
    }

    history.push("/error");
  };

  return {
    handleError,
  };
};

export { useErrors };
