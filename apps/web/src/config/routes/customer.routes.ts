export const customerRoutes = {
  dashboard: "/customer/dashboard",
  facilities: "/customer/facilities",
  reservations: "/customer/reservations",
  newReservation: "/reservations/new",
  reservation: (reservationId: string) => `/customer/reservations/${reservationId}`,
} as const;
