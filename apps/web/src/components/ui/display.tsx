import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Currency({ value }: { value: number }) {
  return <>{formatCurrency(value)}</>;
}

export function StatusBadge({ value }: { value: string }) {
  const labels: Record<string, string> = {
    ACTIVE: "Đang hoạt động",
    AVAILABLE: "Còn trống",
    CONFIRMED: "Đã xác nhận",
    SUCCEEDED: "Đã thanh toán",
    RESERVED: "Đã giữ chỗ",
    OCCUPIED: "Đang thuê",
    MAINTENANCE: "Bảo trì",
  };
  return <span className={`status status-${value.toLowerCase()}`}>{labels[value] ?? value}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
