import apiClient from "@/lib/appClient";

export const getProducts = async () => {
  const response = await apiClient.get("/products");

  return response.data;
};

