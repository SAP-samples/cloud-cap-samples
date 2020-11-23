import { axiosInstance } from "./axiosInstance";

function changeUserDefaults(currentUser) {
  if (currentUser) {
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Basic ${currentUser.accessToken}`;
    axiosInstance.defaults.userID = currentUser.ID;
    if (currentUser.roles.includes("customer")) {
      axiosInstance.defaults.userEntity = `Customers/${currentUser.ID}`;
      axiosInstance.defaults.tracksEntity = "MarkedTracks";
    } else {
      axiosInstance.defaults.userEntity = `Employees/${currentUser.ID}`;
      axiosInstance.defaults.tracksEntity = "Tracks";
    }
  } else {
    axiosInstance.defaults.tracksEntity = "Tracks";
  }
}

function changeLocaleDefaults(locale) {
  if (locale) {
    axiosInstance.defaults.headers.common["Accept-language"] = locale;
  }
}

export { changeLocaleDefaults, changeUserDefaults };
