import apiClient from "@/lib/appClient";

/* =========================
   Customer Orders
========================= */

export type CreateOrderPayload = {
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

export const getMyOrderById = async (
  orderId: string
) => {
  const response = await apiClient.get(
    `/orders/my/${orderId}`
  );

  return response.data;
};


/* =========================
   Admin Orders
========================= */

export type AdminOrder = {
  _id: string;

  orderNumber: string;

  customer: {
    name: string;
    phone: string;
  };

  totalAmount: number;

  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "completed"
    | "cancelled";

  paymentStatus: "unpaid" | "paid";

  createdAt: string;
};

export type AdminOrdersResponse = {
  orders: AdminOrder[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminOrderQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: "newest" | "oldest";
};

export const getAdminOrders = async (
  query?: AdminOrderQuery
) => {
  const response = await apiClient.get<AdminOrdersResponse>(
    "/orders",
    {
      params: query,
    }
  );

  return response.data;
};

export type AdminOrderDetail = {
  _id: string;

  orderNumber: string;

  user?: string | null;

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
    name: string;
    image?: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    sku?: string;
  }[];

  totalAmount: number;

  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "completed"
    | "cancelled";

  paymentStatus: "unpaid" | "paid";

  note?: string;

  statusHistory: {
    _id: string;

    status:
      | "pending"
      | "confirmed"
      | "preparing"
      | "shipped"
      | "completed"
      | "cancelled";

    previousStatus:
      | "pending"
      | "confirmed"
      | "preparing"
      | "shipped"
      | "completed"
      | "cancelled"
      | null;

    changedBy?: {
      _id: string;
      name: string;
      phone: string;
    } | null;

    changedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
};

export const getAdminOrderById = async (
  orderId: string
) => {
  const response = await apiClient.get<{
    order: AdminOrderDetail;
  }>(`/orders/${orderId}`);

  return response.data.order;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "completed"
  | "cancelled";

export const updateAdminOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const response = await apiClient.patch(
    `/orders/${orderId}/status`,
    { status }
  );

  return response.data;
};

