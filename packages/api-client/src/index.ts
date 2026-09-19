import type {
  ApiEnvelope,
  ConfirmReservationInput,
  DashboardSummary,
  Facility,
  FacilityListParams,
  LoginInput,
  PaginatedResult,
  Reservation,
  ReservationQuote,
  ReservationQuoteInput,
  Session,
  SessionTokens,
  UnitAvailabilityOption,
  UserRole,
} from "@storex/contracts";
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

export interface TokenProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  updateTokens: (tokens: SessionTokens) => void;
  clearSession: () => void;
}

export interface HttpClientOptions {
  baseURL: string;
  tokenProvider: TokenProvider;
}

export function createHttpClient({ baseURL, tokenProvider }: HttpClientOptions): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 15_000 });
  let refreshPromise: Promise<SessionTokens> | null = null;

  client.interceptors.request.use((config) => {
    const token = tokenProvider.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryConfig | undefined;
      if (error.response?.status !== 401 || !config || config._retry || config.skipAuthRefresh) {
        return Promise.reject(error);
      }

      const refreshToken = tokenProvider.getRefreshToken();
      if (!refreshToken) {
        tokenProvider.clearSession();
        return Promise.reject(error);
      }

      config._retry = true;
      refreshPromise ??= client
        .post<ApiEnvelope<SessionTokens>>("/auth/refresh", { refreshToken }, {
          skipAuthRefresh: true,
        } as RetryConfig)
        .then((response) => response.data.data)
        .finally(() => {
          refreshPromise = null;
        });

      try {
        const tokens = await refreshPromise;
        tokenProvider.updateTokens(tokens);
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return client.request(config);
      } catch (refreshError) {
        tokenProvider.clearSession();
        return Promise.reject(refreshError);
      }
    },
  );

  return client;
}

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

export function createStorexApiClient(http: AxiosInstance) {
  return {
    http,
    auth: {
      login: (input: LoginInput) =>
        http.post<ApiEnvelope<Session>>("/auth/login", input).then(unwrap),
      me: () => http.get<ApiEnvelope<Session["user"]>>("/auth/me").then(unwrap),
      forgotPassword: (email: string) =>
        http.post<ApiEnvelope<null>>("/auth/forgot-password", { email }).then(unwrap),
    },
    facilities: {
      list: (params: FacilityListParams = {}) =>
        http.get<ApiEnvelope<PaginatedResult<Facility>>>("/facilities", { params }).then(unwrap),
      get: (facilityId: string) =>
        http.get<ApiEnvelope<Facility>>(`/facilities/${facilityId}`).then(unwrap),
      availability: (facilityId: string) =>
        http
          .get<ApiEnvelope<UnitAvailabilityOption[]>>(`/facilities/${facilityId}/availability`)
          .then(unwrap),
    },
    reservations: {
      quote: (input: ReservationQuoteInput) =>
        http.post<ApiEnvelope<ReservationQuote>>("/reservations/quote", input).then(unwrap),
      confirm: (input: ConfirmReservationInput) =>
        http.post<ApiEnvelope<Reservation>>("/reservations/confirm", input).then(unwrap),
      mine: () => http.get<ApiEnvelope<Reservation[]>>("/reservations/mine").then(unwrap),
      get: (reservationId: string) =>
        http.get<ApiEnvelope<Reservation>>(`/reservations/${reservationId}`).then(unwrap),
    },
    dashboards: {
      get: (role: UserRole) =>
        http.get<ApiEnvelope<DashboardSummary>>(`/dashboards/${role}`).then(unwrap),
    },
  };
}

export type StorexApiClient = ReturnType<typeof createStorexApiClient>;
