import apiClient from "@/lib/appClient";

export const getContentBySlug = async (slug: string) => {
  const response = await apiClient.get(`/site-content/${slug}`);

  return response.data;
};