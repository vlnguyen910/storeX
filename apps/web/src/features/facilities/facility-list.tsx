"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-controls";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { FacilityCard } from "./facility-card";
import { useFacilities } from "./hooks";

export function FacilityList({ protectedMode = false }: { protectedMode?: boolean }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState<"name" | "price" | "availability">("name");
  const [page, setPage] = useState(1);
  const query = useFacilities({ search, city, sort, page, pageSize: 6 });

  return (
    <>
      <div className="filter-bar">
        <div className="search-control">
          <Search size={19} />
          <Input
            aria-label="Tìm cơ sở"
            placeholder="Tên cơ sở hoặc thành phố"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          aria-label="Lọc thành phố"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả thành phố</option>
          <option>TP. Hồ Chí Minh</option>
          <option>Hà Nội</option>
          <option>Đà Nẵng</option>
        </Select>
        <Select
          aria-label="Sắp xếp"
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
        >
          <option value="name">Theo tên</option>
          <option value="price">Giá thấp nhất</option>
          <option value="availability">Nhiều chỗ trống nhất</option>
        </Select>
      </div>
      {query.isLoading ? <LoadingState label="Đang tìm cơ sở phù hợp…" /> : null}
      {query.isError ? (
        <ErrorState
          message="Dữ liệu cơ sở tạm thời chưa sẵn sàng."
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.data?.items.length === 0 ? (
        <EmptyState
          title="Không tìm thấy cơ sở"
          description="Thử thay đổi từ khóa hoặc khu vực tìm kiếm."
        />
      ) : null}
      {query.data?.items.length ? (
        <div className="facility-grid">
          {query.data.items.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} protectedMode={protectedMode} />
          ))}
        </div>
      ) : null}
      {query.data && query.data.totalPages > 1 ? (
        <div className="pagination">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Trang trước
          </Button>
          <span>
            Trang {page}/{query.data.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === query.data.totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Trang sau
          </Button>
        </div>
      ) : null}
    </>
  );
}
