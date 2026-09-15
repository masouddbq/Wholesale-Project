import apiClient from "@/lib/appClient";

export type SiteContent = {
  _id: string;
  key: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type SiteContentsResponse = {
  contents: SiteContent[];
};

export const getSiteContents = async () => {
  const response =
    await apiClient.get<SiteContentsResponse>(
      "/site-content"
    );

  return response.data;
};

export const getSiteContent = async (
  key: string
) => {
  const response = await apiClient.get<{
    content: SiteContent;
  }>(`/site-content/${key}`);

  return response.data;
};

export const updateSiteContent = async (
  key: string,
  data: Record<string, any>
) => {
  const response = await apiClient.put<{
    message: string;
    content: SiteContent;
  }>(`/site-content/${key}`, data);

  return response.data;
};