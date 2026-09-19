"use client";

import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import { Button } from "./button";

export function LoadingState({ label = "Đang tải dữ liệu…" }: { label?: string }) {
  return (
    <div className="state-card" role="status">
      <LoaderCircle className="state-icon spin" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="state-card">
      <Inbox className="state-icon" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-card state-error" role="alert">
      <AlertTriangle className="state-icon" />
      <h3>Không thể tải dữ liệu</h3>
      <p>{message}</p>
      {onRetry ? <Button onClick={onRetry}>Thử lại</Button> : null}
    </div>
  );
}
