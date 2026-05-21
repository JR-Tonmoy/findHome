import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import {
  fetchBooking,
  initiateBookingPayment,
} from "../../../utils/notificationService";

const PAYMENT_OPTIONS = [
  { id: "bkash", label: "bKash", description: "Fast mobile wallet checkout" },
  { id: "nagad", label: "Nagad", description: "Instant digital payment" },
  { id: "rocket", label: "Rocket", description: "Reliable mobile banking" },
  { id: "visa", label: "Visa Card", description: "Debit or credit card" },
  { id: "mastercard", label: "MasterCard", description: "Secure card payment" },
  {
    id: "mobile_banking",
    label: "Mobile Banking",
    description: "One hosted gateway, all mobile banking options",
  },
];

const PaymentCheckout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bkash");

  useEffect(() => {
    let isMounted = true;

    const loadBooking = async () => {
      setIsLoading(true);

      try {
        const response = await fetchBooking(bookingId);

        if (isMounted) {
          setBooking(response);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error?.message || "Unable to load booking details for payment.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const property = booking?.property;
  const totalAmount = useMemo(() => {
    const monthlyRent = Number.parseFloat(
      String(property?.price || 0).replace(/[^0-9.]/g, ""),
    );

    return monthlyRent || 0;
  }, [booking?.duration, property?.price]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value || 0);

  const handlePayment = async () => {
    if (!booking?.id) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await initiateBookingPayment({
        bookingId: booking.id,
        paymentMethod: selectedMethod,
      });

      const gatewayUrl = response?.gateway_url;

      if (!gatewayUrl) {
        throw new Error(
          "SSLCommerz gateway URL was not returned by the server.",
        );
      }

      window.location.href = gatewayUrl;
    } catch (error) {
      setErrorMessage(error?.message || "Unable to start the payment gateway.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading payment summary...</p>
        </div>
      </div>
    );
  }

  if (!booking || !property) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Booking not found
          </h1>
          <p className="mt-2 text-gray-600">
            We could not load the booking details required for payment.
          </p>
          <Link
            to="/dashboard/payments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
          >
            <ArrowLeft size={16} />
            Back to payment history
          </Link>
        </div>
      </div>
    );
  }

  const propertyImage = property.images?.[0] || property.image || "";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#faf7f2_0%,#f4f7fb_100%)] text-gray-900">
      <div className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo
            variant="default"
            size="sm"
            showSubtitle={true}
            linkTo="/home"
          />
          <Link
            to="/dashboard/notifications"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to notifications
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            BashaLagbe Secure Checkout
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Complete your booking payment
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Review the booking summary, choose a preferred SSLCommerz option,
            and continue to the hosted payment gateway.
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-65 bg-gray-100">
                <img
                  src={propertyImage}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Awaiting payment confirmation
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Property Summary
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      {property.title}
                    </h2>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} />
                      {property.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Booking duration</span>
                    <span className="font-semibold text-gray-900">
                      {booking.duration || 1} month
                      {String(booking.duration) === "1" ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Monthly rent</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(property.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-3 text-base font-semibold text-gray-900">
                    <span>Advance Payment (1 Month)</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-4xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Secure payment
                  </p>
                  <h3 className="text-xl font-bold text-gray-900">
                    Choose an SSLCommerz option
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedMethod(option.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedMethod === option.id
                        ? "border-emerald-500 bg-emerald-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {option.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {option.description}
                        </p>
                      </div>
                      {selectedMethod === option.id ? (
                        <BadgeCheck className="text-emerald-600" size={18} />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3 text-emerald-800">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-6">
                    You will be redirected to SSLCommerz hosted checkout where
                    the gateway will display bKash, Nagad, Rocket, Visa,
                    MasterCard, and mobile banking options.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CreditCard size={18} />
                {isSubmitting
                  ? "Opening gateway..."
                  : `Pay ${formatCurrency(totalAmount)}`}
              </button>
            </section>

            <section className="rounded-4xl border border-white/70 bg-[#101828] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Payment summary
              </p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Tenant</span>
                  <span className="font-medium text-white">
                    {user?.name || booking.tenant_name || "Tenant"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Email</span>
                  <span className="font-medium text-white">
                    {user?.email || booking.tenant_email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-300">Selected method</span>
                  <span className="font-medium text-white">
                    {PAYMENT_OPTIONS.find(
                      (option) => option.id === selectedMethod,
                    )?.label || "SSLCommerz"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base">
                  <span className="text-gray-300">Payable now</span>
                  <span className="font-bold text-emerald-300">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentCheckout;
