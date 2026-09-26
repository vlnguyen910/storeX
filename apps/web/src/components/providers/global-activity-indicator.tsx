"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export function GlobalActivityIndicator() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const active = fetching + mutating > 0;

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[200] h-1 bg-primary/15"
      role="status"
      aria-label="Đang xử lý"
    >
      <div className="h-full w-1/3 animate-[global-progress_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      <span className="sr-only">Đang tải dữ liệu</span>
    </div>
  );
}
