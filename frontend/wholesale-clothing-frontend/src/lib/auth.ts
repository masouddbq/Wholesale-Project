import { getMe } from "@/services/authService";
import useAuthStore from "@/store/authStore";

export const checkAuth = async () => {
  try {
    const data = await getMe();

    useAuthStore.getState().setUser(data.user);

    return data.user;
  } catch {
    useAuthStore.getState().clearUser();

    return null;
  }
};