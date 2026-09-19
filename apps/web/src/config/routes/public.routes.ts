export const publicRoutes = {
  home: "/",
  facilities: "/facilities",
  facility: (facilityId: string) => `/facilities/${facilityId}`,
  login: "/login",
  forgotPassword: "/forgot-password",
  forbidden: "/forbidden",
} as const;
