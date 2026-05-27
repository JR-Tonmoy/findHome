import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Download,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import {
  downloadPaymentInvoice,
  fetchPaymentByTransaction,
} from "../../../utils/notificationService";

const PaymentSuccess = () => {
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    let active = true;

    const loadPayment = async () => {
      if (!transactionId) {
        setErrorMessage("Missing transaction ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchPaymentByTransaction(transactionId, bookingId);
        if (!active) return;
        setPayment(data);
      } catch (err) {
        if (!active) return;
        const status = err?.response?.status;
        if (status === 404) {
          setErrorMessage("Payment information not found.");
        } else {
          setErrorMessage(
            err?.response?.data?.message ||
              "We could not load the payment confirmation right now.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPayment();

    return () => {
      active = false;
    };
  }, [transactionId]);

  const dashboardPath = useMemo(() => {
    const role = String(user?.role || "").toLowerCase();

    if (role === "admin") return "/admin-dashboard";
    if (role === "owner") return "/owner-dashboard";
    if (role === "tenant" || role === "user") return "/dashboard";

    return "/login";
  }, [user?.role]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const paymentStatus = String(
    payment?.payment_status || "success",
  ).toLowerCase();
  const isSuccess =
    paymentStatus === "completed" || paymentStatus === "success";
  const invoiceNumber =
    payment?.invoice_number ||
    payment?.invoice_id ||
    payment?.invoice?.invoice_id ||
    `INV-${String(payment?.payment_id || "").padStart(6, "0")}`;
  const paidAmount =
    payment?.paid_amount ?? payment?.payment_amount ?? payment?.monthly_rent;
  const monthlyRent =
    payment?.monthly_rent ?? payment?.property?.rent ?? paidAmount;
  const paymentMethod =
    payment?.payment_method || payment?.invoice?.payment_method || "SSLCommerz";
  const paymentDate = payment?.payment_date || payment?.invoice?.payment_date;
  const bookingDate =
    payment?.booking_date ||
    payment?.booking?.booking_date ||
    payment?.booking?.created_at;
  const propertyName =
    payment?.property_name || payment?.property?.title || "-";
  const propertyLocation =
    payment?.property_location || payment?.property?.location || "-";
  const propertyImage =
    payment?.property_image || payment?.property?.image || null;
  const tenantName = payment?.tenant_name || payment?.tenant?.name || "-";
  const tenantEmail = payment?.tenant_email || payment?.tenant?.email || "-";
  const tenantPhone = payment?.tenant_phone || payment?.tenant?.phone || "-";
  const ownerName = payment?.owner_name || payment?.owner?.name || "-";
  const ownerPhone = payment?.owner_phone || payment?.owner?.phone || "-";
  const transactionLabel = payment?.transaction_id || transactionId;
  const bookingStatus =
    payment?.booking_status || payment?.booking?.status || "-";
  const hasPaymentData = Boolean(
    payment?.payment_id || payment?.transaction_id,
  );

  const fallbackPropertyImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial, sans-serif' font-size='24'>Property Image</text></svg>`,
    );

  const handleDownloadInvoice = async () => {
    const paymentId = payment?.payment_id;
    if (!paymentId) return;

    setDownloadingInvoice(true);

    try {
      const response = await downloadPaymentInvoice(paymentId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed:", err);
      setErrorMessage(
        err?.response?.data?.message || "Failed to download invoice PDF.",
      );
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_30%),linear-gradient(180deg,#f8fbf8_0%,#edf6ef_100%)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-white/70 bg-white px-8 py-10 shadow-[0_24px_90px_rgba(15,23,42,0.08)] text-center">
          <Loader2
            className="mx-auto animate-spin text-emerald-600"
            size={36}
          />
          <p className="mt-4 text-base font-medium text-gray-700">
            Verifying your payment...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we load your SSLCommerz confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_28%),linear-gradient(180deg,#f7fbf8_0%,#eef7f0_100%)] text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mb-6 flex justify-center">
            <Logo
              variant="minimal"
              size="sm"
              showSubtitle={false}
              linkTo="/home"
            />
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-4xl border border-white/80 bg-white shadow-[0_28px_100px_rgba(15,23,42,0.12)]">
            <div className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-8 text-white sm:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-sm">
                    <ShieldCheck size={14} />
                    SSLCommerz Verified
                  </div>
                  <div className="mt-5 flex items-start gap-4">
                    <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/10">
                      <CheckCircle2 size={42} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Payment Successful!
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                        Thank you! Your house booking payment has been completed
                        successfully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm">
                  <p className="text-emerald-50/80">Transaction ID</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-white">
                    {transactionId || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 p-6 sm:p-8">
                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : null}

                {!errorMessage && !payment ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Payment information not found.
                  </div>
                ) : null}

                {hasPaymentData ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoCard
                      label="Paid Amount"
                      value={formatCurrency(paidAmount)}
                      icon={<DollarSign size={18} />}
                    />
                    <InfoCard
                      label="Monthly Rent"
                      value={formatCurrency(monthlyRent)}
                      icon={<DollarSign size={18} />}
                    />
                    <InfoCard
                      label="Payment Status"
                      value={payment?.payment_status || "completed"}
                      icon={<BadgeCheck size={18} />}
                      status={isSuccess ? "success" : "neutral"}
                    />
                    <InfoCard
                      label="Invoice Number"
                      value={invoiceNumber}
                      icon={<Download size={18} />}
                    />
                    <InfoCard
                      label="Property"
                      value={propertyName}
                      icon={<Building2 size={18} />}
                    />
                    <InfoCard
                      label="Property Location"
                      value={propertyLocation}
                      icon={<Building2 size={18} />}
                    />
                    <InfoCard
                      label="Booking Date"
                      value={formatDate(bookingDate)}
                      icon={<CalendarDays size={18} />}
                    />
                    <InfoCard
                      label="Booking Status"
                      value={bookingStatus}
                      icon={<BadgeCheck size={18} />}
                      status={isSuccess ? "success" : "neutral"}
                    />
                    <InfoCard
                      label="Tenant Name"
                      value={tenantName}
                      icon={<UserRound size={18} />}
                    />
                    <InfoCard
                      label="Tenant Email"
                      value={tenantEmail}
                      icon={<UserRound size={18} />}
                    />
                    <InfoCard
                      label="Owner Name"
                      value={ownerName}
                      icon={<UserRound size={18} />}
                    />
                    <InfoCard
                      label="Owner Phone"
                      value={ownerPhone}
                      icon={<UserRound size={18} />}
                    />
                    <InfoCard
                      label="Payment Method"
                      value={paymentMethod}
                      icon={<ShieldCheck size={18} />}
                    />
                    <InfoCard
                      label="Payment Date"
                      value={formatDate(paymentDate)}
                      icon={<CalendarDays size={18} />}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Payment information not found.
                  </div>
                )}

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Success Message
                  </p>
                  <p className="mt-3 text-sm leading-6 text-emerald-900 sm:text-base">
                    Payment Successful! Thank you! Your house booking payment
                    has been completed successfully.
                  </p>
                </div>
              </div>

              <aside className="border-t border-gray-100 bg-gray-50/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                        Quick Summary
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-gray-900">
                        Booking Snapshot
                      </h2>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {payment?.payment_status || "completed"}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4 text-sm text-gray-700">
                    {!hasPaymentData ? (
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        Payment details are unavailable for this transaction.
                      </div>
                    ) : null}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      <img
                        src={propertyImage || fallbackPropertyImage}
                        alt={propertyName}
                        className="h-48 w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackPropertyImage;
                        }}
                      />
                    </div>
                    {hasPaymentData ? (
                      <>
                        <DetailRow
                          label="Transaction ID"
                          value={transactionLabel}
                        />
                        <DetailRow
                          label="Invoice Number"
                          value={invoiceNumber}
                        />
                        <DetailRow label="Property Name" value={propertyName} />
                        <DetailRow
                          label="Property Location"
                          value={propertyLocation}
                        />
                        <DetailRow label="Tenant Name" value={tenantName} />
                        <DetailRow label="Tenant Email" value={tenantEmail} />
                        <DetailRow label="Tenant Phone" value={tenantPhone} />
                        <DetailRow label="Owner Name" value={ownerName} />
                        <DetailRow label="Owner Phone" value={ownerPhone} />
                        <DetailRow
                          label="Payment Method"
                          value={paymentMethod}
                        />
                        <DetailRow
                          label="Booking Duration"
                          value={
                            payment?.booking_duration
                              ? `${payment.booking_duration} month${Number(payment.booking_duration) === 1 ? "" : "s"}`
                              : "-"
                          }
                        />
                        <DetailRow
                          label="Booking Status"
                          value={bookingStatus}
                        />
                        <DetailRow
                          label="Paid Amount"
                          value={formatCurrency(paidAmount)}
                        />
                        <DetailRow
                          label="Monthly Rent"
                          value={formatCurrency(monthlyRent)}
                        />
                        <DetailRow
                          label="Booking Date"
                          value={formatDate(bookingDate)}
                        />
                        <DetailRow
                          label="Payment Date"
                          value={formatDate(paymentDate)}
                        />
                      </>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => navigate(dashboardPath)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      Go to Dashboard
                      <ChevronRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      disabled={downloadingInvoice || !payment?.payment_id}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingInvoice ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      Download Invoice PDF
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Need help?
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Keep this confirmation for your records. Your invoice and
                      booking details are stored safely in the system.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, icon, status = "neutral" }) => {
  const statusClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <div
      className={`rounded-2xl border px-4 py-4 shadow-sm ${statusClasses[status]}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 wrap-break-word">
        {value || "-"}
      </p>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-gray-900">{value || "-"}</span>
  </div>
);

export default PaymentSuccess;
