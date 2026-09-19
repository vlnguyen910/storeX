"use client";

import type { Session, SessionTokens } from "@storex/contracts";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

interface AuthState {
  session: Session | null;
  hydrated: boolean;
  setSession: (session: Session) => void;
  updateTokens: (tokens: SessionTokens) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      setSession: (session) => set({ session }),
      updateTokens: (tokens) =>
        set((state) => ({
          session: state.session ? { ...state.session, ...tokens } : null,
        })),
      clearSession: () => set({ session: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "storex.demo-session.v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.sessionStorage,
      ),
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const authStore = useAuthStore;
