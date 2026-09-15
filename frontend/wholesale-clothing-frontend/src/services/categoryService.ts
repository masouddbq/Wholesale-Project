import apiClient from "@/lib/appClient";

export const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const response = await apiClient.get(`/categories/${slug}`);
  return response.data;
};

/* Admin Categories */

export type AdminCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategoriesResponse = {
  count: number;
  categories: AdminCategory[];
};

export const getAdminCategories = async () => {
  const response =
    await apiClient.get<AdminCategoriesResponse>(
      "/categories/admin"
    );

  return response.data;
};

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
};

export const createCategory = async (
  payload: CreateCategoryPayload
) => {
  const response = await apiClient.post(
    "/categories",
    payload
  );

  return response.data;
};

export type UpdateCategoryPayload =
  Partial<CreateCategoryPayload>;

export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryPayload
) => {
  const response = await apiClient.patch(
    `/categories/${categoryId}`,
    payload
  );

  return response.data;
};

export const deleteCategory = async (
  categoryId: string
) => {
  const response = await apiClient.delete(
    `/categories/${categoryId}`
  );

  return response.data;
};