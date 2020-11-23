import { emitter } from "../util/EventEmitter";
import { axiosInstance } from "./axiosInstance";
import { refreshTokens } from "./calls";
import { getUserFromLS } from "../util/localStorageService";

let isRefreshing = false;
let subscribers = [];

function responseErrorInterceptor(error) {
  const originalRequest = error.config;

  if (error.response && error.response.status === 401) {
    if (originalRequest.url === "users/login") {
      return Promise.reject(error);
    }

    // if users/refreshTokens request failed
    if (isRefreshing && originalRequest.url === "users/refreshTokens") {
      subscribers.forEach((request) => request.reject(error));
      subscribers = [];
      isRefreshing = false;
      return Promise.reject(error);
    }

    // if got a 401 error we sending users/refreshTokens request
    if (!isRefreshing) {
      isRefreshing = true;

      refreshTokens(getUserFromLS().refreshToken)
        .then((response) => {
          emitter.emit("UPDATE_USER", response.data);
          subscribers.forEach((request) =>
            request.resolve(response.data.accessToken)
          );
        })
        .catch(() => {
          subscribers.forEach((request) => request.reject(error));
        })
        .finally(() => {
          subscribers = [];
          isRefreshing = false;
        });
      return;
    }

    // holding requests which should be sended after users/refreshTokens complete
    // otherwise if users/refreshTokens failed an error will be thrown
    return new Promise((resolve, reject) => {
      subscribers.push({
        resolve: (newAccessToken) => {
          originalRequest.headers.Authorization = "Basic " + newAccessToken;
          resolve(axiosInstance(originalRequest));
        },
        reject: (err) => {
          reject(err);
        },
      });
    });
  }

  return Promise.reject(error);
}

export { responseErrorInterceptor };
