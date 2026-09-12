import apiClient from "@/lib/appClient";

export type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

export const getProducts = async (
  query?: ProductQuery
) => {
  const response = await apiClient.get("/products", {
    params: query,
  });

  return response.data;
};

