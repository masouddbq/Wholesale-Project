import { create } from "zustand";

type User = {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;