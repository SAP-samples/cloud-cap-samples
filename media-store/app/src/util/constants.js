export const AVAILABLE_LOCALES = ["en", "fr", "de"];

export const MESSAGE_TIMEOUT = 2;

// in dev mode using provided api
// in prod mode using proxy
export const API =
  process.env.NODE_ENV === "development" ? "http://localhost:4004/" : "api/";

export const requireEmployee = (user) =>
  !!user && user.roles.includes("employee");

export const requireCustomer = (user) =>
  !!user && user.roles.includes("customer");
