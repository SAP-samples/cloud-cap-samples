import axios from 'axios';
import { getUserFromLS, getLocaleFromLS } from '../util/localStorageService';
import { emitter } from '../util/EventEmitter';

const TIMEOUT = 2000;
const RETRY_COUNT = 3;

/**
 * This is axios instance
 */
const axiosInstance = axios.create({
  baseURL: process.env.SERVICE_URL,
  timeout: TIMEOUT,
  retryDelay: TIMEOUT,
  retry: RETRY_COUNT,
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
 * Init axios defaults
 */
const user = getUserFromLS();
const locale = getLocaleFromLS();
changeUserDefaults(user);
changeLocaleDefaults(locale);

/**
 * Retry request if response time is too long
 * See link below
 * {@link https://github.com/axios/axios/issues/164#issuecomment-327837467 GitHub}
 * @param {*} err response error object
 */
function axiosRetryInterceptor(err) {
  const config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (config && config.retry) {
    // Set the variable for keeping track of the retry count
    config.retryCount = config.retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(err);
    }

    // Increase the retry count
    config.retryCount += 1;

    // Create new promise to handle exponential backoff
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(() => {
      return axios(config);
    });
  }
}

/**
 * Things below needed for refresh tokens mechanism implementation
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

/**
 * Refresh tokens interceptor
 * See link below
 * {@link https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c#gistcomment-3536511 GitHub}
 * @param {*} error error response object
 */
function axiosRefreshTokensInterceptor(error) {
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
}

axiosInstance.interceptors.response.use(null, (error) => {
  return (
    axiosRefreshTokensInterceptor(error) || axiosRetryInterceptor(error) || Promise.reject(error)
  );
});

export { axiosInstance, changeLocaleDefaults, changeUserDefaults };
