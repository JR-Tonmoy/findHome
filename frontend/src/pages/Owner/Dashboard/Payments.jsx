import axios from "axios";
import {
  Check,
  Download,
  Loader2,
  RotateCcw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import adminService from "../../../utils/adminService";

const OwnerPayments = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);
  const [stats, setStats] = useState({
    cancelledBookings: 0,
    processedRefunds: 0,
    tenantRefundTotal: 0,
    ownerShareTotal: 0,
  });

  useEffect(() => {
    let active = true;

    const loadRefunds = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await adminService.fetchOwnerCancelledBookings();
        if (!active) return;

        const normalized = Array.isArray(data) ? data : [];
        setRefunds(normalized);

        const processed = normalized.filter(
          (item) => item.refund_status === "processed",
        );

        setStats({
          cancelledBookings: normalized.length,
          processedRefunds: processed.length,
          tenantRefundTotal: normalized.reduce(
            (sum, item) => sum + Number(item.refund_amount || 0),
            0,
          ),
          ownerShareTotal: normalized.reduce(
            (sum, item) => sum + Number(item.owner_share || 0),
            0,
          ),
        });
      } catch {
        if (!active) return;
        setError("Failed to load cancelled bookings. Please try again.");
        setRefunds([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRefunds();

    return () => {
      active = false;
    };
  }, []);

  const filteredRefunds = useMemo(() => {
    if (filterStatus === "all") return refunds;
    return refunds.filter((refund) => refund.refund_status === filterStatus);
  }, [refunds, filterStatus]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadRefundPdf = async (bookingId) => {
    if (!bookingId) return;

    setDownloadingId(bookingId);

    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/refund-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `refund-booking-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to download refund PDF.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payments & Refunds
        </h1>
        <p className="text-gray-600">
          Review cancelled bookings, refund windows, and downloadable refund
          documents.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="rounded-2xl border border-rose-200 bg-linear-to-br from-rose-50 to-rose-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-700 text-sm font-medium">
                Cancelled Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-rose-900">
                {stats.cancelledBookings}
              </p>
            </div>
            <XCircle size={32} className="text-rose-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 text-sm font-medium">
                Refund Window Processed
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {stats.processedRefunds}
              </p>
            </div>
            <Check size={32} className="text-emerald-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">
                Tenant Refunds
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {formatCurrency(stats.tenantRefundTotal)}
              </p>
            </div>
            <RotateCcw size={32} className="text-blue-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 to-amber-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Owner Share</p>
              <p className="mt-2 text-3xl font-bold text-amber-900">
                {formatCurrency(stats.ownerShareTotal)}
              </p>
            </div>
            <TrendingUp size={32} className="text-amber-400" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {["all", "processed", "pending", "failed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filterStatus === status
                ? "bg-slate-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "All Refunds" : status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading cancelled bookings...
        </div>
      ) : filteredRefunds.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <XCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No cancelled bookings found
          </h3>
          <p className="text-gray-600">
            Refund history will appear here when tenants cancel paid bookings.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Cancellation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Owner Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRefunds.map((refund) => (
                  <tr
                    key={refund.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {refund.tenant_name || "Tenant"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.tenant_email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {refund.property_title || "Property"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.property_location || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(refund.cancelled_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">
                      {formatCurrency(refund.refund_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-700">
                      {formatCurrency(refund.owner_share)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          refund.refund_status === "processed"
                            ? "bg-emerald-100 text-emerald-700"
                            : refund.refund_status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {refund.refund_status || "processed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadRefundPdf(refund.booking_id)
                        }
                        disabled={downloadingId === refund.booking_id}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {downloadingId === refund.booking_id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        {downloadingId === refund.booking_id
                          ? "Downloading"
                          : "PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPayments;
