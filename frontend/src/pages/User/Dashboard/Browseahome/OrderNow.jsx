import { ArrowLeft, CheckCircle, CreditCard, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../../../../components/Logo/Logo";
import useAuth from "../../../../hooks/useAuth";
import { addAdminNotification } from "../../../../utils/adminNotificationStorage";
import { getCurrentMemberProfile } from "../../../../utils/memberStorage";
import {
  createBooking,
  fetchTenantBookings,
} from "../../../../utils/notificationService";
import { resolvePublicPropertyById } from "../../../../utils/publicPropertyResolver";

const OrderNow = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const currentMember = getCurrentMemberProfile();
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const toDateOnlyString = (date) => date.toISOString().slice(0, 10);

  const resolveAvailableFromDate = (value) => {
    if (!value) return null;
    const trimmed = String(value).trim();

    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      return new Date(`${trimmed}-01T00:00:00`);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return new Date(`${trimmed}T00:00:00`);
    }

    const match = trimmed.match(/^([A-Za-z]+)(?:\s+(\d{4}))?$/);
    if (!match) return null;

    const monthIndex = monthNames.indexOf(match[1].toLowerCase());
    if (monthIndex < 0) return null;

    const year = Number(match[2] || new Date().getFullYear());
    const candidate = new Date(year, monthIndex, 1);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    if (candidate < thisMonth) {
      return new Date(year + 1, monthIndex, 1);
    }

    return candidate;
  };

  useEffect(() => {
    let isMounted = true;

    const loadProperty = async () => {
      setLoading(true);

      try {
        const resolvedProperty = await resolvePublicPropertyById(id);

        if (isMounted) {
          if (resolvedProperty) {
            console.log(
              "available_from_month:",
              resolvedProperty.available_from_month,
            );
          }
          setProperty(resolvedProperty);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProperty();

    window.addEventListener("owner-properties-updated", loadProperty);
    window.addEventListener("public-properties-updated", loadProperty);

    return () => {
      isMounted = false;
      window.removeEventListener("owner-properties-updated", loadProperty);
      window.removeEventListener("public-properties-updated", loadProperty);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-gray-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold text-gray-900">
            Property not found
          </h1>
          <p className="mt-2 text-gray-600">
            This property is no longer available for booking.
          </p>
          <Link
            to="/dashboard/browse"
            className="mt-6 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const availableFromDate = resolveAvailableFromDate(
    property.available_from_month,
  );
  const minMoveInDate = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (availableFromDate && availableFromDate > today) {
      return toDateOnlyString(availableFromDate);
    }
    return toDateOnlyString(today);
  })();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header showing Navigation */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-50">
        <Logo
          variant="default"
          size="sm"
          showSubtitle={true}
          linkTo="/dashboard/browse"
        />
        <Link
          to={`/property/${property.id}`}
          className="flex items-center text-gray-500 hover:text-blue-600 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Property
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Complete Your Request
          </h1>
          <p className="text-gray-500 mt-1">
            Please fill in your details to confirm
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                Personal Information
              </h2>

              <form
                className="space-y-6"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setSubmitting(true);
                  setStatusMessage("");
                  setErrorMessage("");

                  try {
                    const formData = new FormData(event.currentTarget);
                    const tenantName = String(
                      formData.get("fullName") ||
                        user?.name ||
                        currentMember.fullName ||
                        "Tenant",
                    ).trim();
                    const tenantId = Number(user?.id || currentMember?.id || 0);
                    const tenantPhone = String(
                      formData.get("phone") ||
                        user?.phone ||
                        currentMember.phone ||
                        "",
                    ).trim();
                    const tenantEmail = String(
                      formData.get("email") ||
                        user?.email ||
                        currentMember.email ||
                        "",
                    ).trim();
                    const moveInDate = String(
                      formData.get("moveInDate") || todayStr,
                    ).trim();
                    const duration = String(
                      formData.get("duration") || "6",
                    ).trim();
                    const message = String(
                      formData.get("message") || "",
                    ).trim();

                    const finalMessage =
                      message ||
                      "I am interested in this property. Please contact me for next steps.";

                    // Client-side validations
                    if (!moveInDate) {
                      throw new Error("Please select a valid move-in date.");
                    }

                    if (!tenantId) {
                      throw new Error(
                        "Tenant account information is missing. Please login again.",
                      );
                    }

                    // Prevent selecting past dates
                    if (moveInDate < minMoveInDate) {
                      throw new Error(
                        "Move-in date must be within the owner's available month or later.",
                      );
                    }

                    // Prevent duplicate bookings for the same property
                    try {
                      const tenantBookingsResp = await fetchTenantBookings();
                      const tenantBookings = tenantBookingsResp?.data || [];
                      const alreadyBooked = tenantBookings.some(
                        (b) =>
                          Number(b.property_id) === Number(property.id) &&
                          ["pending", "approved"].includes(String(b.status)),
                      );

                      if (alreadyBooked) {
                        throw new Error(
                          "You already have a pending or approved booking for this property.",
                        );
                      }
                    } catch (checkErr) {
                      // If fetching tenant bookings failed, log but continue to attempt booking
                      console.warn(
                        "Could not verify existing bookings:",
                        checkErr,
                      );
                    }

                    // Create booking via API
                    const booking = await createBooking({
                      property_id: property.id,
                      tenant_id: tenantId,
                      move_in_date: moveInDate || null,
                      duration,
                      message: finalMessage,
                    });

                    if (booking) {
                      setStatusMessage(
                        "Your booking request has been sent successfully! The owner will contact you soon.",
                      );
                      event.currentTarget.reset();

                      // Also store in localStorage for fallback (not mandatory)
                      const bookingRequest = {
                        id: `booking-${Date.now()}`,
                        propertyId: property.id,
                        propertyTitle: property.title,
                        tenantName,
                        tenantPhone,
                        tenantEmail,
                        moveInDate,
                        duration,
                        message,
                        createdAt: new Date().toISOString(),
                      };

                      const existingRequests = JSON.parse(
                        localStorage.getItem("tenantBookingRequests") || "[]",
                      );
                      localStorage.setItem(
                        "tenantBookingRequests",
                        JSON.stringify([bookingRequest, ...existingRequests]),
                      );

                      // Add admin notification (legacy)
                      addAdminNotification({
                        type: "booking",
                        title: "New tenant booking request",
                        message: `${tenantName} requested ${property.title}.`,
                        meta: {
                          propertyId: property.id,
                          propertyTitle: property.title,
                          tenantName,
                          tenantEmail,
                          tenantPhone,
                        },
                        createdAt: bookingRequest.createdAt,
                      });
                    }
                  } catch (err) {
                    console.error("Booking error:", err);
                    setErrorMessage(
                      err?.message ||
                        "Failed to send booking request. Please try again.",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="e.g. +880 1XXX-XXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 pt-4 border-t">
                  Booking Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Move-in Date
                    </label>
                    <input
                      name="moveInDate"
                      type="date"
                      min={minMoveInDate}
                      defaultValue={minMoveInDate}
                      placeholder="MM/DD/YYYY"
                      lang="en-US"
                      className="w-full h-12 px-4 text-base text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [color-scheme:light]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Months)
                    </label>
                    <select
                      name="duration"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="6">6 Months</option>
                      <option value="12">1 Year</option>
                      <option value="24">2 Years</option>
                      <option value="custom">Other / Discuss Later</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message for Owner
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Hello, I am interested in renting this property..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                <div className="bg-gray-50 text-gray-800 p-4 rounded-xl flex items-start gap-3 mt-6">
                  <CheckCircle className="mt-0.5 shrink-0" size={20} />
                  <p className="text-sm">
                    By confirming this order, the property owner (
                    {property.owner.name}) will be notified and will contact you
                    shortly to finalize the agreement.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (property &&
                      String(
                        property.status || property.raw?.status || "available",
                      )
                        .toLowerCase()
                        .includes("available") === false)
                  }
                  className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors text-lg mt-8 shadow-sm"
                >
                  {submitting ? "Sending..." : "Confirm Booking Request"}
                </button>
                {property &&
                !String(property.status || property.raw?.status || "available")
                  .toLowerCase()
                  .includes("available") ? (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    ✗ This property is currently occupied and not available for
                    booking.
                  </p>
                ) : null}
                {statusMessage ? (
                  <p className="mt-3 text-sm font-medium text-green-600">
                    ✓ {statusMessage}
                  </p>
                ) : null}
                {errorMessage ? (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    ✗ {errorMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                <div className="w-full h-40 rounded-xl overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded mb-2 inline-block">
                    {property.type}
                  </span>
                  <h4 className="text-lg font-bold text-gray-800">
                    {property.title}
                  </h4>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" /> {property.location}
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-gray-100 py-4 my-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Monthly Rent</span>
                  <span className="font-semibold text-gray-800">
                    ৳{property.price}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span className="font-semibold text-gray-800">৳0</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Payable Now
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    *(No payment required online)*
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600">৳0</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <CreditCard size={18} className="text-gray-400 shrink-0" />
                <span>
                  Payments are securely made directly to the owner after signing
                  the agreement.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
