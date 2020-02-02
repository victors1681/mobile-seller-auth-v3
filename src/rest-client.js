import axios from 'axios';
//import { getCsrfToken } from "./containers/main/reducer";
const getCsrfToken = () => '';

const restClient = axios.create();

export const configureRestClient = (store, baseURL) => {
  // Base API path
  restClient.defaults.baseURL = baseURL;

  // Add our CSRF header
  restClient.interceptors.request.use(config => {
    const newConfig = { ...config };
    const csrfToken = getCsrfToken(store.getState());
    if (csrfToken) {
      if (/^(post|put|patch|delete)$/i.test(config.method)) {
        newConfig.headers['X-CSRF-TOKEN'] = csrfToken;
      }
    }
    return newConfig;
  });
};

export const setBaseURLofRestClient = baseURL => {
  restClient.defaults.baseURL = baseURL;
};

export default restClient;
