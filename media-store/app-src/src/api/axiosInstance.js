import axios from 'axios';
import { getUserFromLS, getLocaleFromLS } from '../util/localStorageService';
import { emitter } from '../util/EventEmitter';

/**
 * This is axios instance
 */
const axiosInstance = axios.create({
  baseURL: process.env.SERVICE_URL,
  timeout: 2000,
});

/**
 * Changing user axios default params,
 * which are used in api call functions (calls.js)
 * @param {*} currentUser current user from react state and local storage
 */
function changeUserDefaults(currentUser) {
  if (currentUser) {
    axiosInstance.defaults.headers.common.Authorization = `Basic ${currentUser.accessToken}`;
    axiosInstance.defaults.userID = currentUser.ID;
    if (currentUser.roles.includes('customer')) {
      axiosInstance.defaults.userEntity = `Customers/${currentUser.ID}`;
      axiosInstance.defaults.tracksEntity = 'MarkedTracks';
    } else {
      axiosInstance.defaults.userEntity = `Employees/${currentUser.ID}`;
      axiosInstance.defaults.tracksEntity = 'Tracks';
    }
  } else {
    axiosInstance.defaults.tracksEntity = 'Tracks';
  }
}
/**
 * This func changing axios instance default params
 * @param {*} locale current locale from react state and local storage
 */
function changeLocaleDefaults(locale) {
  if (locale) {
    axiosInstance.defaults.headers.common['Accept-language'] = locale;
  }
}

/**
 * Initializing initial data
 */
const user = getUserFromLS();
const locale = getLocaleFromLS();
changeUserDefaults(user);
changeLocaleDefaults(locale);

/**
 * Error interceptor for refresh tokens mechanism
 */
let isRefreshing = false;
let subscribers = [];
const refreshTokens = (refreshToken) => {
  return axiosInstance.post(
    'users/refreshTokens',
    { refreshToken },
    {
      headers: { 'content-type': 'application/json' },
    }
  );
};
axiosInstance.interceptors.response.use(null, (error) => {
  const originalRequest = error.config;
  const user = getUserFromLS();

  if (error.response && error.response.status === 401 && !!user) {
    if (originalRequest.url === 'users/login') {
      return Promise.reject(error);
    }

    // if users/refreshTokens request failed
    if (isRefreshing && originalRequest.url === 'users/refreshTokens') {
      subscribers.forEach((request) => request.reject(error));
      subscribers = [];
      isRefreshing = false;
      return Promise.reject(error);
    }

    // if got a 401 error we sending users/refreshTokens request
    if (!isRefreshing) {
      isRefreshing = true;

      refreshTokens(user.refreshToken)
        .then((response) => {
          emitter.emit('UPDATE_USER', response.data);
          subscribers.forEach((request) => request.resolve(response.data.accessToken));
          subscribers = [];
          isRefreshing = false;
        })
        .catch(() => {
          emitter.emit('UPDATE_USER', undefined);
        });
    }

    // holding requests which should be sended after users/refreshTokens complete
    // otherwise if users/refreshTokens failed an error will be thrown
    return new Promise((resolve, reject) => {
      subscribers.push({
        resolve: (newAccessToken) => {
          originalRequest.headers.Authorization = `Basic ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        },
        reject: (err) => {
          reject(err);
        },
      });
    });
  }

  return Promise.reject(error);
});

export { axiosInstance, changeLocaleDefaults, changeUserDefaults };
