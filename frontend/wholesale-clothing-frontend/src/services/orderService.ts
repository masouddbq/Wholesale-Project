import apiClient from "@/lib/appClient";

type CreateOrderPayload = {
  customer: {
    name: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode?: string;
  };

  items: {
    product: string;
    variantId: string;
    quantity: number;
  }[];

  note?: string;
};

export const createOrder = async (
  payload: CreateOrderPayload
) => {
  const response = await apiClient.post(
    "/orders",
    payload
  );

  return response.data;
};