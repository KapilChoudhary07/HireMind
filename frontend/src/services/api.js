import axios from "axios";
import { getToken } from "../utils/auth";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

const api = axios.create({
  baseURL: configuredApiUrl || "https://hiremind-t2xa.onrender.com/api",
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
