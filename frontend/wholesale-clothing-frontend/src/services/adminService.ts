import apiClient from "@/lib/appClient";

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get("/admin/dashboard");

  return response.data as {
    stats: DashboardStats;
  };
};