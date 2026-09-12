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

export const getMyOrders = async () => {
  const response = await apiClient.get("/orders/my");

  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await apiClient.get(
    `/orders/${orderId}`
  );

  return response.data;
};