import { createHttpClient, createStorexApiClient } from "@storex/api-client";
import { authStore } from "@/features/auth/auth-store";

const http = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  tokenProvider: {
    getAccessToken: () => authStore.getState().session?.accessToken ?? null,
    getRefreshToken: () => authStore.getState().session?.refreshToken ?? null,
    updateTokens: (tokens) => authStore.getState().updateTokens(tokens),
    clearSession: () => authStore.getState().clearSession(),
  },
});

export const api = createStorexApiClient(http);
