export const AVAILABLE_LOCALES = ["en", "fr", "de"];

export const MESSAGE_TIMEOUT = 2;

// in dev mode using provided api
// in prod mode using proxy
export const API =
  process.env.NODE_ENV === "development" ? "http://localhost:4004/" : "api/";
