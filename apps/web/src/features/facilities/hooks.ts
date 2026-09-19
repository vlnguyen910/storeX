"use client";

import type { FacilityListParams } from "@storex/contracts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const facilityKeys = {
  all: ["facilities"] as const,
  list: (params: FacilityListParams) => [...facilityKeys.all, "list", params] as const,
  detail: (id: string) => [...facilityKeys.all, "detail", id] as const,
  availability: (id: string) => [...facilityKeys.all, "availability", id] as const,
};

export function useFacilities(params: FacilityListParams) {
  return useQuery({
    queryKey: facilityKeys.list(params),
    queryFn: () => api.facilities.list(params),
  });
}

export function useFacility(id: string) {
  return useQuery({ queryKey: facilityKeys.detail(id), queryFn: () => api.facilities.get(id) });
}

export function useAvailability(id: string) {
  return useQuery({
    queryKey: facilityKeys.availability(id),
    queryFn: () => api.facilities.availability(id),
    enabled: Boolean(id),
  });
}
