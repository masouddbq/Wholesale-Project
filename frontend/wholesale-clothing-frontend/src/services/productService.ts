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

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/products/${slug}`);

  return response.data;
};

export type AdminProduct = {
  _id: string;

  name: string;

  slug: string;

  description?: string;

  price: number;

  images: string[];

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  variants: {
    _id: string;
    size: string;
    color: string;
    stock: number;
    sku: string;
  }[];

  minimumOrderQuantity: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
};

export type AdminProductsResponse = {
  products: AdminProduct[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminProductQuery = {
  page?: number;

  limit?: number;

  search?: string;

  category?: string;

  minPrice?: number;

  maxPrice?: number;

  sort?:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";
};

export const getAdminProducts = async (
  query?: AdminProductQuery
) => {
  const response =
    await apiClient.get<AdminProductsResponse>(
      "/products/admin",
      {
        params: query,
      }
    );

  return response.data;
};

export const getAdminProductById = async (productId: string) => {
  const response = await apiClient.get(
    `/products/id/${productId}`
  );

  return response.data;
};

export type CreateProductPayload = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  variants: {
    size: string;
    color: string;
    stock: number;
    sku: string;
  }[];
  minimumOrderQuantity: number;
  isActive: boolean;
};

export const createProduct = async (
  payload: CreateProductPayload
) => {
  const response = await apiClient.post(
    "/products",
    payload
  );

  return response.data;
};

export const updateProduct = async (
  productId: string,
  payload: Partial<CreateProductPayload>
) => {
  const response = await apiClient.patch(
    `/products/${productId}`,
    payload
  );

  return response.data;
};



