import axios from "axios";
import { getToken } from "../utils/auth";

const productionApiUrl = "https://hiremind-t2xa.onrender.com/api";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

const getApiUrl = () => {
  if (!configuredApiUrl) {
    return import.meta.env.PROD
      ? productionApiUrl
      : "http://localhost:5000/api";
  }

  return configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`;
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default api;
