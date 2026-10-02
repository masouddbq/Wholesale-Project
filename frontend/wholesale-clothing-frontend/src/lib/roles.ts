export type UserRole = "user" | "customer" | "admin";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "کاربر",
  customer: "مشتری",
  admin: "مدیر",
};

export const canSeeExactStock = (role?: string | null) =>
  role === "customer" || role === "admin";
