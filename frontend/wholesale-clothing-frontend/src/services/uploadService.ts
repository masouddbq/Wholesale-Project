import apiClient from "@/lib/appClient";

export const uploadProductImages = async (
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post(
    "/uploads/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
