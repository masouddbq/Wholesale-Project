import apiClient from "@/lib/appClient";

export const getProducts = async () => {
  const response = await apiClient.get("/categories");

  return response.data;
};