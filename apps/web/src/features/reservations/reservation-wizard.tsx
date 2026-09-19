"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Reservation, ReservationQuote, UnitAvailabilityOption } from "@storex/contracts";
import axios from "axios";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, Currency } from "@/components/ui/display";
import { FieldShell, Input, Select } from "@/components/ui/form-controls";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/config/routes";
import { useAvailability, useFacilities } from "@/features/facilities/hooks";
import { dateInputMin, formatDate } from "@/lib/format";
import { useConfirmReservation, useReservationQuote } from "./hooks";

const wizardSchema = z.object({
  facilityId: z.string().min(1, "Chọn một cơ sở"),
  unitType: z.string().min(1, "Chọn loại kho"),
  sizeLabel: z.string().min(1, "Chọn kích thước"),
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
      unitType: "",
      sizeLabel: "",
      startDate: dateInputMin(),
      durationMonths: 1,
      cardholder: "NGUYEN MINH ANH",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/30",
      cvc: "123",
    },
  });
  const facilityId = form.watch("facilityId");
  const unitType = form.watch("unitType");
  const sizeLabel = form.watch("sizeLabel");
  const availabilityQuery = useAvailability(facilityId);
  const selectedFacility = facilitiesQuery.data?.items.find((item) => item.id === facilityId);
  const selectedOption = availabilityQuery.data?.find(
    (item) => item.unitType === unitType && item.sizeLabel === sizeLabel,
  );
  const groupedTypes = useMemo(
    () => [...new Set(availabilityQuery.data?.map((item) => item.unitType) ?? [])],
    [availabilityQuery.data],
  );

  useEffect(() => {
    const facilityParam = searchParams.get("facilityId");
    if (facilityParam) form.setValue("facilityId", facilityParam);
  }, [form, searchParams]);

  function chooseOption(option: UnitAvailabilityOption) {
    form.setValue("unitType", option.unitType, { shouldValidate: true });
    form.setValue("sizeLabel", option.sizeLabel, { shouldValidate: true });
  }

  async function next() {
    if (step === 0 && (await form.trigger("facilityId"))) setStep(1);
    else if (step === 1 && (await form.trigger(["unitType", "sizeLabel"]))) setStep(2);
    else if (step === 2 && (await form.trigger(["startDate", "durationMonths"]))) {
      const values = form.getValues();
      try {
        const result = await quoteMutation.mutateAsync({
          facilityId: values.facilityId,
          unitType: values.unitType,
          sizeLabel: values.sizeLabel,
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
      <Card className="reservation-success">
        <span className="success-mark">
          <Check />
        </span>
        <span className="eyebrow">Đặt chỗ thành công</span>
        <h1>{completed.code}</h1>
        <p>
          storeX đã giữ một suất{" "}
          <strong>
            {completed.unitType} · {completed.sizeLabel}
          </strong>{" "}
          tại {completed.facility.name}.
        </p>
        <div className="success-summary">
          <span>
            Ngày bắt đầu<strong>{formatDate(completed.startDate)}</strong>
          </span>
          <span>
            Tiền cọc đã thanh toán
            <strong>
              <Currency value={completed.depositAmount} />
            </strong>
          </span>
          <span>
            Trạng thái<strong>Đã xác nhận</strong>
          </span>
        </div>
        <p className="muted">Mã unit cụ thể sẽ được phân công khi check-in.</p>
        <div className="button-row">
          <Link className="button button-primary" href={routes.customer.reservation(completed.id)}>
            Xem reservation
          </Link>
          <Link className="button button-outline" href={routes.customer.dashboard}>
            Về tổng quan
          </Link>
        </div>
      </Card>
    );

  return (
    <div className="wizard-layout">
      <div className="wizard-main">
        <ol className="stepper">
          {stepLabels.map((label, index) => (
            <li key={label} className={index === step ? "active" : index < step ? "done" : ""}>
              <span>{index < step ? <Check size={15} /> : index + 1}</span>
              <small>{label}</small>
            </li>
          ))}
        </ol>
        <Card className="wizard-card">
          {step === 0 ? (
            <div>
              <span className="eyebrow">Bước 1/5</span>
              <h2>Chọn cơ sở thuận tiện</h2>
              <p className="section-copy">Bạn có thể thay đổi cơ sở trước khi tạo báo giá.</p>
              <div className="choice-grid">
                {facilitiesQuery.data?.items.map((facility) => (
                  <button
                    type="button"
                    key={facility.id}
                    className={`choice-card ${facilityId === facility.id ? "selected" : ""}`}
                    onClick={() => {
                      form.setValue("facilityId", facility.id, { shouldValidate: true });
                      form.setValue("unitType", "");
                      form.setValue("sizeLabel", "");
                    }}
                  >
                    <span className="choice-icon">
                      <MapPin />
                    </span>
                    <strong>{facility.name}</strong>
                    <small>
                      {facility.address.district}, {facility.address.city}
                    </small>
                    <span>{facility.availableUnits} unit còn trống</span>
                  </button>
                ))}
              </div>
              {form.formState.errors.facilityId ? (
                <p className="field-error">{form.formState.errors.facilityId.message}</p>
              ) : null}
            </div>
          ) : null}
          {step === 1 ? (
            <div>
              <span className="eyebrow">Bước 2/5</span>
              <h2>Chọn loại và kích thước kho</h2>
              <p className="section-copy">
                Reservation giữ chỗ theo loại kho; mã unit được phân công khi check-in.
              </p>
              {availabilityQuery.isLoading ? (
                <LoadingState />
              ) : (
                <div className="choice-grid unit-choices">
                  {groupedTypes
                    .flatMap(
                      (type) =>
                        availabilityQuery.data?.filter((option) => option.unitType === type) ?? [],
                    )
                    .map((option) => (
                      <button
                        type="button"
                        disabled={option.availableCount === 0}
                        key={`${option.unitType}-${option.sizeLabel}`}
                        className={`choice-card ${unitType === option.unitType && sizeLabel === option.sizeLabel ? "selected" : ""}`}
                        onClick={() => chooseOption(option)}
                      >
                        <strong>{option.sizeLabel}</strong>
                        <small>{option.unitType}</small>
                        <b>
                          <Currency value={option.monthlyPrice} /> / tháng
                        </b>
                        <span>
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
              <span className="eyebrow">Bước 3/5</span>
              <h2>Chọn thời gian thuê</h2>
              <p className="section-copy">
                Ngày bắt đầu không được ở quá khứ. MVP hỗ trợ thời hạn nguyên tháng.
              </p>
              <div className="form-grid">
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
              <div className="info-banner">
                <ShieldCheck />
                <div>
                  <strong>Chính sách giá demo</strong>
                  <p>Tiền cọc bằng một tháng. Thuế, giảm giá và phụ phí chưa áp dụng trong MVP.</p>
                </div>
              </div>
            </div>
          ) : null}
          {step === 3 && quote ? (
            <div>
              <span className="eyebrow">Bước 4/5</span>
              <h2>Kiểm tra báo giá</h2>
              <p className="section-copy">Báo giá có hiệu lực trong 15 phút.</p>
              <div className="quote-box">
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
                  <strong className="primary-text">
                    <Currency value={quote.depositAmount} />
                  </strong>
                </div>
                <div className="quote-total">
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
              <span className="eyebrow">Bước 5/5</span>
              <h2>Thanh toán tiền cọc</h2>
              <p className="section-copy">
                Đây là form thẻ giả lập. Thông tin thẻ đầy đủ không được lưu.
              </p>
              <div className="test-card-note">
                <CreditCard />
                <div>
                  <strong>Thẻ test</strong>
                  <span>Thành công: 4242 4242 4242 4242</span>
                  <span>Thất bại: 4000 0000 0000 0002</span>
                </div>
              </div>
              <div className="form-stack">
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
                <div className="form-grid">
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
              <div className="payable">
                <span>Thanh toán hôm nay</span>
                <strong>
                  <Currency value={quote.depositAmount} />
                </strong>
              </div>
              {confirmMutation.isError ? (
                <p className="inline-error">{apiErrorMessage(confirmMutation.error)}</p>
              ) : null}
            </form>
          ) : null}
          <div className="wizard-actions">
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
      <aside className="wizard-summary card">
        <span className="eyebrow">Tóm tắt lựa chọn</span>
        <h3>{selectedFacility?.name ?? "Chưa chọn cơ sở"}</h3>
        {selectedFacility ? (
          <p>
            <MapPin size={15} />
            {selectedFacility.address.district}, {selectedFacility.address.city}
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
        <small>Giá và tồn kho được xác nhận lại ở bước cuối.</small>
      </aside>
    </div>
  );
}
