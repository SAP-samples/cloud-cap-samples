import { isArray, isEmpty, isString, isNumber } from "lodash";

const CUSTOMER_ROLE = "customer";
const EMPLOYEE_ROLE = "employee";

const isValidUser = (user) => {
  return (
    !isEmpty(user) &&
    isNumber(user.ID) &&
    isArray(user.roles) &&
    !!user.roles.some(
      (role) => role === CUSTOMER_ROLE || role === EMPLOYEE_ROLE
    ) &&
    isString(user.email) &&
    isString(user.accessToken) &&
    isString(user.refreshToken)
  );
};

export { isValidUser };
