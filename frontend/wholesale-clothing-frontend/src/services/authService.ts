import apiClient from "@/lib/appClient";

export const register = async (
  name: string,
  phone: string,
  password: string
) => {
  const response = await apiClient.post("/auth/register", {
    name,
    phone,
    password,
  });

  return response.data;
};

export const login = async (
  phone: string,
  password: string
) => {
  const response = await apiClient.post("/auth/login", {
    phone,
    password,
  });

  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/users/me");

  return response.data;
};