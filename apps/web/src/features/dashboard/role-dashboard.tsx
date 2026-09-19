"use client";

import type { UserRole } from "@storex/contracts";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowUpRight } from "lucide-react";
import { Card, PageHeader } from "@/components/ui/display";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { api } from "@/lib/api";

export function RoleDashboard({ role }: { role: UserRole }) {
  const query = useQuery({
    queryKey: ["dashboard", role],
    queryFn: () => api.dashboards.get(role),
  });
  if (query.isLoading) return <LoadingState label="Đang tổng hợp dữ liệu vận hành…" />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        message="Không thể tải dashboard hoặc dữ liệu nằm ngoài phạm vi facility của bạn."
        onRetry={() => query.refetch()}
      />
    );
  }

  const data = query.data;
  return (
    <>
      <PageHeader
        eyebrow={data.facilityName ?? "storeX operations"}
        title={data.title}
        description={data.subtitle}
      />
      <div className="kpi-grid four-columns">
        {data.kpis.map((kpi) => (
          <article className={`kpi-card ${kpi.tone}`} key={kpi.label}>
            <span>
              <ArrowUpRight />
            </span>
            <small>{kpi.label}</small>
            <strong>{kpi.value}</strong>
            <p>{kpi.helper}</p>
          </article>
        ))}
      </div>
      <Card className="activity-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cập nhật mới nhất</span>
            <h2>Hoạt động gần đây</h2>
          </div>
          <Activity />
        </div>
        <div className="activity-list">
          {data.activities.map((item) => (
            <div key={item.id}>
              <span className="activity-dot" />
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <time>{item.time}</time>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
