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
      <main className="min-h-[70vh] py-16 pb-[90px]">
        <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[800px]:w-[min(100%_-_28px,680px)]">
          <FacilityDetail facilityId={facilityId} />
        </div>
      </main>
    </PublicLayout>
  );
}
