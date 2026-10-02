import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    const origin =
      process.env.INTERNAL_API_URL || "http://127.0.0.1:5001";
    config.baseURL = `${origin.replace(/\/$/, "")}/api`;
  } else {
    config.baseURL = "/api";
  }

  return config;
});

export default apiClient;
