import { PublicLayout } from "@/components/layout/public-layout";
import { FacilityDetail } from "@/features/facilities/facility-detail";

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ facilityId: string }>;
}) {
  const { facilityId } = await params;
  return (
    <PublicLayout>
      <main className="public-page">
        <div className="container">
          <FacilityDetail facilityId={facilityId} />
        </div>
      </main>
    </PublicLayout>
  );
}
