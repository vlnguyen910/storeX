import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-surface p-6 text-ink shadow-soft",
        className,
      )}
    >
      {children}
    </section>
  );
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
  const positive = ["ACTIVE", "AVAILABLE", "CONFIRMED", "SUCCEEDED"].includes(value);
  const maintenance = value === "MAINTENANCE";
  return (
    <span
      className={cn(
        "inline-flex min-h-[26px] w-fit items-center rounded-full bg-slate-100 px-2.5 text-xs font-extrabold text-slate-600",
        positive && "bg-accent-soft text-accent",
        maintenance && "bg-amber-50 text-amber-700",
      )}
    >
      {labels[value] ?? value}
    </span>
  );
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
    <div className="mb-[30px] flex items-end justify-between gap-6 max-[800px]:flex-col max-[800px]:items-start">
      <div>
        {eyebrow ? (
          <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mb-2 text-4xl font-bold max-[560px]:text-3xl">{title}</h1>
        {description ? <p className="m-0 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
