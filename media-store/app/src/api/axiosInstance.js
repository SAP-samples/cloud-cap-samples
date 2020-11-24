import axios from "axios";
import { getUserFromLS, getLocaleFromLS } from "../util/localStorageService";
import {
  changeUserDefaults,
  changeLocaleDefaults,
} from "./changeAxiosDefaults";
import { API } from "../util/constants";
import { responseErrorInterceptor } from "./responseErrorInterceptor";

const axiosInstance = axios.create({
  baseURL: API,
  timeout: 1000,
});
const user = getUserFromLS();
const locale = getLocaleFromLS();
changeUserDefaults(user);
changeLocaleDefaults(locale);

axiosInstance.interceptors.response.use(null, responseErrorInterceptor);

export { axiosInstance, changeLocaleDefaults, changeUserDefaults };
