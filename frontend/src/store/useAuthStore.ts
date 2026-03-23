import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean; //Boolean for whether the user is logged in or out
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  login: () => set({ isLoggedIn: true }), //Function sets status to logged in

  logout: () => set({ isLoggedIn: false }), //Function sets status to not logged in
}));