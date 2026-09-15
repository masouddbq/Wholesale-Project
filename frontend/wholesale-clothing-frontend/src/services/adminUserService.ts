import apiClient from "@/lib/appClient";

export type AdminUser = {
  _id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type AdminUserOrder = {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "completed"
    | "cancelled";
  createdAt: string;
};

export type AdminUsersPagination = {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
};

export type GetAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort?: "newest" | "oldest" | "name";
};

export type GetAdminUsersResponse = {
  users: AdminUser[];
  pagination: AdminUsersPagination;
};

export type GetAdminUserResponse = {
  user: AdminUser & {
    addresses: {
      _id: string;
      title: string;
      province: string;
      city: string;
      address: string;
      postalCode?: string;
    }[];
  };
  orders: AdminUserOrder[];
};

export const getAdminUsers = async (
  params?: GetAdminUsersParams
) => {
  const response =
    await apiClient.get<GetAdminUsersResponse>(
      "/admin/users",
      {
        params,
      }
    );

  return response.data;
};

export const getAdminUser = async (
  id: string
) => {
  const response =
    await apiClient.get<GetAdminUserResponse>(
      `/admin/users/${id}`
    );

  return response.data;
};

export const updateAdminUserRole = async (
  id: string,
  role: "customer" | "admin"
) => {
  const response =
    await apiClient.patch<{
      message: string;
      user: {
        id: string;
        name: string;
        phone: string;
        role: "customer" | "admin";
      };
    }>(
      `/admin/users/${id}/role`,
      {
        role,
      }
    );

  return response.data;
};