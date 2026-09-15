import apiClient from "@/lib/appClient";

export type SiteContentUploadResponse = {
  message: string;
  image: string;
};

export type CategoryUploadResponse = {
  message: string;
  image: string;
};

export type ProductUploadResponse = {
  message: string;
  images: string[];
};

export const uploadSiteContentImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response =
    await apiClient.post<SiteContentUploadResponse>(
      "/uploads/site-content",
      formData
    );

  return response.data;
};

export const uploadCategoryImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("image", file);

  const response =
    await apiClient.post<CategoryUploadResponse>(
      "/uploads/categories",
      formData
    );

  return response.data;
};

export const uploadProductImages = async (
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response =
    await apiClient.post<ProductUploadResponse>(
      "/uploads/products",
      formData
    );

  return response.data;
};
