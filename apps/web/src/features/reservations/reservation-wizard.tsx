"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Reservation, ReservationQuote, UnitAvailabilityOption } from "@storex/contracts";
import axios from "axios";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card, Currency } from "@/components/ui/display";
import { FieldShell, Input, Select } from "@/components/ui/form-controls";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { useAvailability, useFacilities } from "@/features/facilities/hooks";
import { cn } from "@/lib/cn";
import { dateInputMin, formatDate } from "@/lib/format";
import { useConfirmReservation, useReservationQuote } from "./hooks";

const wizardSchema = z.object({
  facilityId: z.string().min(1, "Chọn một cơ sở"),
  unitTypeId: z.string().min(1, "Chọn loại kho"),
  startDate: z
    .string()
    .min(1, "Chọn ngày bắt đầu")
    .refine((value) => value >= dateInputMin(), "Ngày bắt đầu không được ở quá khứ"),
  durationMonths: z.number().int().min(1).max(12),
  cardholder: z.string().min(2, "Nhập tên chủ thẻ"),
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "Số thẻ phải có 16 chữ số")),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Dùng định dạng MM/YY"),
  cvc: z.string().regex(/^\d{3}$/, "CVC gồm 3 chữ số"),
});
type WizardValues = z.input<typeof wizardSchema>;

const stepLabels = ["Cơ sở", "Loại kho", "Thời gian", "Báo giá", "Thanh toán"];

function apiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Đã có lỗi xảy ra, vui lòng thử lại.";
  return (
    (error.response?.data as { message?: string } | undefined)?.message ??
    "Không thể xử lý yêu cầu."
  );
}

export function ReservationWizard() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [quote, setQuote] = useState<ReservationQuote | null>(null);
  const [completed, setCompleted] = useState<Reservation | null>(null);
  const facilitiesQuery = useFacilities({ pageSize: 20 });
  const quoteMutation = useReservationQuote();
  const confirmMutation = useConfirmReservation();
  const form = useForm<WizardValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      facilityId: searchParams.get("facilityId") ?? "",
      unitTypeId: "",
      startDate: dateInputMin(),
      durationMonths: 1,
      cardholder: "NGUYEN MINH ANH",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/30",
      cvc: "123",
    },
  });
  const facilityId = form.watch("facilityId");
  const unitTypeId = form.watch("unitTypeId");
  const availabilityQuery = useAvailability(facilityId);
  const selectedFacility = facilitiesQuery.data?.items.find((item) => item.id === facilityId);
  const selectedOption = availabilityQuery.data?.find((item) => item.unitTypeId === unitTypeId);

  useEffect(() => {
    const facilityParam = searchParams.get("facilityId");
    if (facilityParam) form.setValue("facilityId", facilityParam);
  }, [form, searchParams]);

  function chooseOption(option: UnitAvailabilityOption) {
    form.setValue("unitTypeId", option.unitTypeId, { shouldValidate: true });
  }

  async function next() {
    if (step === 0 && (await form.trigger("facilityId"))) setStep(1);
    else if (step === 1 && (await form.trigger("unitTypeId"))) setStep(2);
    else if (step === 2 && (await form.trigger(["startDate", "durationMonths"]))) {
      const values = form.getValues();
      try {
        const result = await quoteMutation.mutateAsync({
          facilityId: values.facilityId,
          unitTypeId: values.unitTypeId,
          startDate: values.startDate,
          durationMonths: Number(values.durationMonths),
        });
        setQuote(result);
        setStep(3);
      } catch (error) {
        showToast(apiErrorMessage(error), "error");
      }
    } else if (step === 3) setStep(4);
  }

  async function pay(values: WizardValues) {
    if (!quote) return;
    const normalizedCard = values.cardNumber.replace(/\s/g, "");
    try {
      const reservation = await confirmMutation.mutateAsync({
        quoteId: quote.id,
        paymentToken: normalizedCard === "4000000000000002" ? "tok_fail" : "tok_success",
        cardBrand: "Visa",
        cardLast4: normalizedCard.slice(-4),
      });
      setCompleted(reservation);
      showToast("Reservation đã được xác nhận");
    } catch (error) {
      showToast(apiErrorMessage(error), "error");
    }
  }

  if (facilitiesQuery.isLoading) return <LoadingState label="Đang chuẩn bị quy trình đặt kho…" />;
  if (facilitiesQuery.isError)
    return (
      <ErrorState
        message="Không tải được danh sách cơ sở."
        onRetry={() => facilitiesQuery.refetch()}
      />
    );
  if (completed)
    return (
      <Card className="mx-auto my-5 flex max-w-[750px] flex-col items-center p-11 text-center">
        <span className="mb-4 grid size-16 place-items-center rounded-full bg-accent text-white">
          <Check />
        </span>
        <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
          Đặt chỗ thành công
        </span>
        <h1 className="mb-2 text-3xl font-bold">{completed.code}</h1>
        <p className="text-muted">
          storeX đã giữ một suất{" "}
          <strong>
            {completed.unitType} · {completed.sizeLabel}
          </strong>{" "}
          tại {completed.facility.name}.
        </p>
        <div className="my-5 grid w-full grid-cols-3 border-y border-line max-[560px]:grid-cols-1">
          <span className="p-[18px] text-muted max-[560px]:border-b max-[560px]:border-line">
            Ngày bắt đầu
            <strong className="mt-1 block text-ink">{formatDate(completed.startDate)}</strong>
          </span>
          <span className="p-[18px] text-muted max-[560px]:border-b max-[560px]:border-line">
            Tiền cọc đã thanh toán
            <strong className="mt-1 block text-ink">
              <Currency value={completed.depositAmount} />
            </strong>
          </span>
          <span className="p-[18px] text-muted">
            Trạng thái<strong className="mt-1 block text-ink">Đã xác nhận</strong>
          </span>
        </div>
        <p className="text-muted">Mã unit cụ thể sẽ được phân công khi check-in.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className={buttonClassName("primary")}
            href={routes.customer.reservation(completed.id)}
          >
            Xem reservation
          </Link>
          <Link className={buttonClassName("outline")} href={routes.customer.dashboard}>
            Về tổng quan
          </Link>
        </div>
      </Card>
    );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-6 max-[800px]:grid-cols-1">
      <div className="min-w-0">
        <ol className="relative mb-[18px] flex list-none justify-between p-0 before:absolute before:top-[17px] before:right-[7%] before:left-[7%] before:h-0.5 before:bg-slate-200">
          {stepLabels.map((label, index) => (
            <li
              key={label}
              className={cn(
                "z-[1] grid justify-items-center gap-1 font-bold text-slate-400",
                index <= step && "text-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-[35px] place-items-center rounded-full border-2 border-slate-200 bg-white",
                  index <= step && "border-primary bg-primary text-white",
                )}
              >
                {index < step ? <Check size={15} /> : index + 1}
              </span>
              <small className="text-[0.7rem] max-[560px]:hidden">{label}</small>
            </li>
          ))}
        </ol>
        <Card className="flex min-h-[510px] flex-col max-[560px]:p-[19px]">
          {step === 0 ? (
            <div>
              <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
                Bước 1/5
              </span>
              <h2 className="mb-1 text-2xl font-bold">Chọn cơ sở thuận tiện</h2>
              <p className="mb-6 text-muted">Bạn có thể thay đổi cơ sở trước khi tạo báo giá.</p>
              <div className="grid grid-cols-3 gap-3 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
                {facilitiesQuery.data?.items.map((facility) => (
                  <button
                    type="button"
                    key={facility.id}
                    className={cn(
                      "flex min-h-[150px] cursor-pointer flex-col gap-2 rounded-[13px] border border-slate-300 bg-white p-4 text-left text-ink hover:border-primary hover:ring-3 hover:ring-primary/10",
                      facilityId === facility.id &&
                        "border-primary bg-[#f4faf7] ring-3 ring-primary/10",
                    )}
                    onClick={() => {
                      form.setValue("facilityId", facility.id, { shouldValidate: true });
                      form.setValue("unitTypeId", "");
                    }}
                  >
                    <span className="grid size-[35px] place-items-center rounded-[10px] bg-primary-soft text-primary">
                      <MapPin className="size-[18px]" />
                    </span>
                    <strong>{facility.name}</strong>
                    <small className="text-muted">{facility.address}</small>
                    <span className="mt-auto text-xs font-bold text-accent">
                      {facility.availableUnits} unit còn trống
                    </span>
                  </button>
                ))}
              </div>
              {form.formState.errors.facilityId ? (
                <p className="text-xs text-danger">{form.formState.errors.facilityId.message}</p>
              ) : null}
            </div>
          ) : null}
          {step === 1 ? (
            <div>
              <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
                Bước 2/5
              </span>
              <h2 className="mb-1 text-2xl font-bold">Chọn loại và kích thước kho</h2>
              <p className="mb-6 text-muted">
                Reservation giữ chỗ theo loại kho; mã unit được phân công khi check-in.
              </p>
              {availabilityQuery.isLoading ? (
                <LoadingState />
              ) : (
                <div className="grid grid-cols-3 gap-3 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
                  {availabilityQuery.data?.map((option) => (
                    <button
                      type="button"
                      disabled={option.availableCount === 0}
                      key={`${option.unitType}-${option.sizeLabel}`}
                      className={cn(
                        "flex min-h-[150px] cursor-pointer flex-col gap-2 rounded-[13px] border border-slate-300 bg-white p-4 text-left text-ink hover:border-primary hover:ring-3 hover:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                        unitTypeId === option.unitTypeId &&
                          "border-primary bg-[#f4faf7] ring-3 ring-primary/10",
                      )}
                      onClick={() => chooseOption(option)}
                    >
                      <strong>{option.sizeLabel}</strong>
                      <small className="text-muted">{option.unitType}</small>
                      <b>
                        <Currency value={option.monthlyPrice} /> / tháng
                      </b>
                      <span className="mt-auto text-xs font-bold text-accent">
                        {option.availableCount ? `Còn ${option.availableCount} chỗ` : "Tạm hết"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
          {step === 2 ? (
            <div>
              <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
                Bước 3/5
              </span>
              <h2 className="mb-1 text-2xl font-bold">Chọn thời gian thuê</h2>
              <p className="mb-6 text-muted">
                Ngày bắt đầu không được ở quá khứ. MVP hỗ trợ thời hạn nguyên tháng.
              </p>
              <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
                <FieldShell label="Ngày bắt đầu" error={form.formState.errors.startDate?.message}>
                  <Input type="date" min={dateInputMin()} {...form.register("startDate")} />
                </FieldShell>
                <FieldShell label="Thời hạn">
                  <Select {...form.register("durationMonths", { valueAsNumber: true })}>
                    {[1, 2, 3, 4, 5, 6, 9, 12].map((month) => (
                      <option value={month} key={month}>
                        {month} tháng
                      </option>
                    ))}
                  </Select>
                </FieldShell>
              </div>
              <div className="mt-5 flex gap-3 rounded-xl bg-primary-soft p-4 text-primary">
                <ShieldCheck />
                <div>
                  <strong>Chính sách giá demo</strong>
                  <p className="mt-1 mb-0 text-xs text-muted">
                    Tiền cọc bằng một tháng. Thuế, giảm giá và phụ phí chưa áp dụng trong MVP.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {step === 3 && quote ? (
            <div>
              <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
                Bước 4/5
              </span>
              <h2 className="mb-1 text-2xl font-bold">Kiểm tra báo giá</h2>
              <p className="mb-6 text-muted">Báo giá có hiệu lực trong 15 phút.</p>
              <div className="grid gap-3 rounded-[14px] border border-[#e0e8e5] bg-[#f8faf9] p-5 [&>div]:flex [&>div]:justify-between [&>div]:gap-6 [&_span]:text-muted [&>hr]:w-full [&>hr]:border-0 [&>hr]:border-t [&>hr]:border-[#dce3e1]">
                <div>
                  <span>Cơ sở</span>
                  <strong>{selectedFacility?.name}</strong>
                </div>
                <div>
                  <span>Loại kho</span>
                  <strong>
                    {quote.unitType} · {quote.sizeLabel}
                  </strong>
                </div>
                <div>
                  <span>Ngày bắt đầu</span>
                  <strong>{formatDate(quote.startDate)}</strong>
                </div>
                <div>
                  <span>Thời hạn</span>
                  <strong>{quote.durationMonths} tháng</strong>
                </div>
                <hr />
                <div>
                  <span>Giá thuê tháng</span>
                  <strong>
                    <Currency value={quote.monthlyPrice} />
                  </strong>
                </div>
                <div>
                  <span>Tiền thuê dự kiến</span>
                  <strong>
                    <Currency value={quote.rentalTotal} />
                  </strong>
                </div>
                <div>
                  <span>Tiền cọc thanh toán hôm nay</span>
                  <strong className="text-primary">
                    <Currency value={quote.depositAmount} />
                  </strong>
                </div>
                <div className="border-t border-[#dce3e1] pt-3 text-lg">
                  <span>Tổng giá trị dự kiến</span>
                  <strong>
                    <Currency value={quote.totalEstimated} />
                  </strong>
                </div>
              </div>
            </div>
          ) : null}
          {step === 4 && quote ? (
            <form id="payment-form" onSubmit={form.handleSubmit(pay)}>
              <span className="mb-2.5 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
                Bước 5/5
              </span>
              <h2 className="mb-1 text-2xl font-bold">Thanh toán tiền cọc</h2>
              <p className="mb-6 text-muted">
                Đây là form thẻ giả lập. Thông tin thẻ đầy đủ không được lưu.
              </p>
              <div className="mb-5 flex gap-3 rounded-[11px] border border-dashed border-ring p-3.5 text-primary">
                <CreditCard />
                <div className="grid gap-1">
                  <strong>Thẻ test</strong>
                  <span className="text-xs text-muted">Thành công: 4242 4242 4242 4242</span>
                  <span className="text-xs text-muted">Thất bại: 4000 0000 0000 0002</span>
                </div>
              </div>
              <div className="grid gap-4">
                <FieldShell label="Tên chủ thẻ" error={form.formState.errors.cardholder?.message}>
                  <Input autoComplete="cc-name" {...form.register("cardholder")} />
                </FieldShell>
                <FieldShell label="Số thẻ" error={form.formState.errors.cardNumber?.message}>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    {...form.register("cardNumber")}
                  />
                </FieldShell>
                <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
                  <FieldShell label="Hạn thẻ" error={form.formState.errors.expiry?.message}>
                    <Input placeholder="MM/YY" autoComplete="cc-exp" {...form.register("expiry")} />
                  </FieldShell>
                  <FieldShell label="CVC" error={form.formState.errors.cvc?.message}>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="cc-csc"
                      {...form.register("cvc")}
                    />
                  </FieldShell>
                </div>
              </div>
              <div className="mt-5 flex justify-between gap-6 rounded-[11px] bg-primary-soft p-3.5 text-primary">
                <span>Thanh toán hôm nay</span>
                <strong>
                  <Currency value={quote.depositAmount} />
                </strong>
              </div>
              {confirmMutation.isError ? (
                <p className="text-xs text-danger">{apiErrorMessage(confirmMutation.error)}</p>
              ) : null}
            </form>
          ) : null}
          <div className="mt-auto flex items-center justify-between pt-7">
            {step > 0 ? (
              <Button
                variant="ghost"
                onClick={() => setStep((value) => value - 1)}
                icon={<ArrowLeft size={18} />}
                type="button"
              >
                Quay lại
              </Button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <Button
                key={`next-step-${step}`}
                type="button"
                onClick={next}
                loading={quoteMutation.isPending}
                icon={<ArrowRight size={18} />}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                key="confirm-payment"
                form="payment-form"
                type="submit"
                loading={confirmMutation.isPending}
                icon={<CreditCard size={18} />}
              >
                Thanh toán & đặt chỗ
              </Button>
            )}
          </div>
        </Card>
      </div>
      <aside className="sticky top-[95px] grid gap-3 rounded-card border border-line bg-white p-6 text-sm shadow-soft max-[800px]:static max-[560px]:hidden [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div>span]:text-muted [&>div>strong]:text-right [&>hr]:w-full [&>hr]:border-0 [&>hr]:border-t [&>hr]:border-[#dce3e1]">
        <span className="text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
          Tóm tắt lựa chọn
        </span>
        <h3 className="m-0 font-bold">{selectedFacility?.name ?? "Chưa chọn cơ sở"}</h3>
        {selectedFacility ? (
          <p className="m-0 flex items-center gap-1 text-xs text-muted">
            <MapPin size={15} />
            {selectedFacility.address}
          </p>
        ) : null}
        {selectedOption ? (
          <>
            <hr />
            <div>
              <span>Không gian</span>
              <strong>
                {selectedOption.unitType}
                <br />
                {selectedOption.sizeLabel}
              </strong>
            </div>
            <div>
              <span>Giá tháng</span>
              <strong>
                <Currency value={selectedOption.monthlyPrice} />
              </strong>
            </div>
          </>
        ) : null}
        {quote ? (
          <>
            <hr />
            <div>
              <span>Tiền cọc</span>
              <strong>
                <Currency value={quote.depositAmount} />
              </strong>
            </div>
          </>
        ) : null}
        <small className="leading-5 text-muted">
          Giá và tồn kho được xác nhận lại ở bước cuối.
        </small>
      </aside>
    </div>
  );
}
