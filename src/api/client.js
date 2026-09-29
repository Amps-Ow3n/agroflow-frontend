import axios from "axios";

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

export function clearCsrfToken() {
  csrfToken = null;
}

export function getActiveOrganizationId() {
  return localStorage.getItem(
    "agroflow_active_organization_id"
  );
}

const client = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://agroflow-backend-ghom.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {

    const method =
      (config.method || "get").toLowerCase();


    if (
      csrfToken &&
      ![
        "get",
        "head",
        "options",
      ].includes(method)
    ) {
      config.headers =
        config.headers || {};

      config.headers[
        "X-CSRF-Token"
      ] = csrfToken;
    }


    const organizationId =
      getActiveOrganizationId();


    if (organizationId) {

      config.headers =
        config.headers || {};

      config.headers[
        "X-Organization-ID"
      ] = organizationId;
    }


    return config;
  }
);

export default client;