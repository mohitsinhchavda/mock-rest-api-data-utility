import axios from "axios";

const baseApiUrl = process.env.BASE_API_URL;

const instance = axios.create({
  baseURL: baseApiUrl,
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus(status) {
    return (
      (status >= 200 && status < 300) ||
      status === 401 ||
      status === 422 ||
      status === 404 ||
      status === 403 ||
      status === 400
    ); // default
  },
});

function getAccessTokenFromLocalStorage() {
  const { localStorage } = window;
  const token = localStorage.getItem("access_token");
  return token;
}

function get(url, { baseURL = baseApiUrl, params } = {}) {
  instance.defaults.baseURL = baseURL;
  instance.defaults.headers.common.Authorization = `Bearer ${getAccessTokenFromLocalStorage()}`;

  return instance
    .get(url, { params })
    .then((response) => {
      if (response.status === 200) {
        return { status: true, data: response.data };
      }
      if (response.status === 204) {
        return { status: true, data: undefined };
      }
      if (response.status === 401) {
        return { status: false, unauthenticated: true };
      }
      if (response.status === 403) {
        return {
          status: false,
          unauthorised: true,
        };
      }
      if (response.status === 404 || response.status === 400) {
        return { ...response, status: false };
      }
      return { status: false, message: "Something went wrong!" };
    })
    .catch((error) => {
      const { message } = error;
      return {
        status: false,
        message,
      };
    });
}

function post(url, { paramObj = {}, timeout = 600000, baseURL = baseApiUrl,} = {}) {
  instance.defaults.baseURL = baseURL;
  instance.defaults.timeout = timeout;
  instance.defaults.headers.common.Authorization = `Bearer ${getAccessTokenFromLocalStorage()}`;

  return instance
    .post(url, paramObj)
    .then((response) => {
      switch (response.status) {
        case 200:
        case 201:
        case 204:
          return { status: true, data: response.data };
        case 404:
        case 400: {
          return { ...response };
        }
        case 401:
          return { status: false, unauthenticated: true };
        case 403:
          return { status: false, unauthorised: true };
        default:
          return { status: false, message: "Something went wrong!" };
      }
    })
    .catch((error) => {
      const { message } = error;
      return {
        status: false,
        message,
        code: error?.response?.status,
      };
    });
}
function deleteApi(url, { data = {}, timeout = 600000, baseURL = baseApiUrl} = {}) {
  instance.defaults.baseURL = baseURL;
  instance.defaults.timeout = timeout;
  instance.defaults.headers.common.Authorization = `Bearer ${getAccessTokenFromLocalStorage()}`;

  return instance
    .delete(url, { data })
    .then((response) => {
      switch (response.status) {
        case 200:
        case 201:
        case 204:
          return { status: true, data: response.data };
        case 404:
        case 400:
          return { ...response };
        case 401:
          return { status: false, unauthenticated: true };
        default:
          return { status: false, message: "Something went wrong!" };
      }
    })
    .catch((error) => {
      const { message } = error;
      return {
        status: false,
        message,
        code: error?.response?.status,
      };
    });
}

function put(url, { paramObj = {}, timeout = 600000, baseURL = baseApiUrl } = {}) {
  instance.defaults.baseURL = baseURL;
  instance.defaults.timeout = timeout;
  instance.defaults.headers.common.Authorization = `Bearer ${getAccessTokenFromLocalStorage()}`;
  return instance
    .put(url, paramObj)
    .then((response) => {
      switch (response.status) {
        case 200:
        case 204:
          return { status: true, ...response };
        case 404:
        case 400:
          return { ...response, status: false };
        case 401:
          return { status: false, unauthenticated: true };
        default:
          return { status: false, message: "Something went wrong!" };
      }
    })
    .catch((error) => {
      const { message } = error;
      return {
        status: false,
        message,
      };
    });
}

export default {
  get,
  post,
  put,
  deleteApi,
  getAccessTokenFromLocalStorage,
};
