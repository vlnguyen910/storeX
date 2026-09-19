import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { FacilityList } from "@/features/facilities/facility-list";

export const metadata: Metadata = { title: "Tìm cơ sở" };
export default function FacilitiesPage() {
  return (
    <PublicLayout>
      <main className="public-page">
        <div className="container">
          <div className="public-page-heading">
            <span className="eyebrow">Mạng lưới storeX</span>
            <h1>Tìm kho gần bạn</h1>
            <p>So sánh vị trí, kích thước, giá và số lượng còn trống tại từng cơ sở.</p>
          </div>
          <FacilityList />
        </div>
      </main>
    </PublicLayout>
  );
}
