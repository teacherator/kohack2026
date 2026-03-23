// src/store/useAuthStore.ts
import { create } from "zustand";

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user?: User;

  login: (token: string, user?: User) => void;
  logout: () => void;
  restore: () => void; // restores session from localStorage
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  user: undefined,

  login: (token, user) => {
    localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    set({ isLoggedIn: true, token, user });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    set({ isLoggedIn: false, token: null, user: undefined });
  },

  restore: () => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("authUser");
    const user = userStr ? JSON.parse(userStr) : undefined;
    if (token) {
      set({ isLoggedIn: true, token, user });
    }
  },
}));