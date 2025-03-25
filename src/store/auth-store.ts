import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  rememberData: { remember: boolean; email: string };
  setRememberData: (remember: { remember: boolean; email: string }) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      rememberData: { remember: false, email: "" },
      setRememberData: (rememberData) => {
        set({ rememberData });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
