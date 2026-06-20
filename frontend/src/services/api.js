import axios from "axios";
import { getToken } from "../utils/auth";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

const api = axios.create({
  baseURL: configuredApiUrl || "https://hiremind-t2xa.onrender.com/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.PROD && !configuredApiUrl) {
      const error = new Error(
        "The deployed frontend is missing the VITE_API_URL environment variable."
      );
      error.code = "ERR_API_URL_MISSING";
      return Promise.reject(error);
    }

    const token = getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default api;
