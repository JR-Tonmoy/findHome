import {
  Building,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../../utils/adminService";
import { normalizeMemberRecord } from "../../../utils/memberStorage";

const Owner = () => {
  const [registeredOwners, setRegisteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingStatusAction, setPendingStatusAction] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    const loadOwners = async () => {
      setLoading(true);
      try {
        const owners = await adminService.fetchAdminOwners();
        if (!active) return;
        setRegisteredOwners(
          Array.isArray(owners) ? owners.map(normalizeMemberRecord) : [],
        );
      } catch (err) {
        console.error("Failed to load owners:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOwners();

    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(registeredOwners.length / itemsPerPage),
  );
  const paginatedOwners = registeredOwners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handleRemoveOwner = async (owner) => {
    const updatedOwners = registeredOwners.filter((item) => {
      if (owner?.id) {
        return item.id !== owner.id;
      }

      return !(
        item.email === owner?.email &&
        item.username === owner?.username &&
        item.date === owner?.date
      );
    });
    setRegisteredOwners(updatedOwners);

    try {
      if (owner?.id) {
        await adminService.deleteAdminOwner(owner.id);
      } else {
        localStorage.setItem("registeredOwners", JSON.stringify(updatedOwners));
      }
    } catch (err) {
      console.warn("Failed to delete owner on backend:", err);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push("start-ellipsis");
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) {
      pages.push("end-ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const isBlockedAccount = (accountStatus) =>
    Boolean(accountStatus?.is_blocked) ||
    String(
      accountStatus?.account_status || accountStatus || "active",
    ).toLowerCase() === "blocked";

  const handleToggleOwnerStatus = async (owner) => {
    const blocked = isBlockedAccount(owner);
    const toastId = toast.loading(
      blocked ? "Unblocking owner..." : "Blocking owner...",
    );
    setPendingStatusAction(`toggle-${owner.id}`);

    try {
      const updatedOwner = await adminService.toggleAdminOwnerBlock(owner.id);
      const nextBlocked = Boolean(updatedOwner?.is_blocked);

      setRegisteredOwners((current) =>
        current.map((item) =>
          item.id === owner.id ? { ...item, ...updatedOwner } : item,
        ),
      );

      toast.success(
        nextBlocked
          ? "Owner blocked successfully"
          : "Owner unblocked successfully",
        { id: toastId },
      );
    } catch (err) {
      toast.error(
        adminService.getAdminErrorMessage(err, "Failed to update owner status"),
        { id: toastId },
      );
    } finally {
      setPendingStatusAction(null);
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[15px] text-gray-500 font-medium flex items-center gap-2">
          <Users size={18} className="text-gray-400" /> Members
          <span className="text-gray-300">›</span>
          <span className="text-gray-800 font-medium">Owners</span>
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Building size={16} className="text-gray-500" />
          Total: {registeredOwners.length}
        </div>
      </div>

      {loading && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Loading owners from the backend...
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="relative w-[320px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search owners"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-600 text-xs font-semibold border-b border-gray-100 tracking-wide">
                <th className="w-16 px-4 py-4 text-center">SL</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {registeredOwners.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-500"
                    colSpan={6}
                  >
                    No owner registration found yet.
                  </td>
                </tr>
              ) : (
                paginatedOwners.map((owner, index) => (
                  <tr
                    key={owner.id || `${owner.email}-${index}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="px-4 py-4 text-center text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-100 flex items-center justify-center shrink-0">
                        {owner.avatar ? (
                          <img
                            src={owner.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-semibold text-gray-800 text-[13px] leading-tight truncate">
                          {owner.fullName}
                        </h4>
                        <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                          {owner.phone}
                        </p>
                        <span
                          className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isBlockedAccount(owner)
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isBlockedAccount(owner) ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px] font-medium">
                      {owner.username}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px] font-medium">
                      {owner.email}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium whitespace-nowrap">
                      {owner.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {isBlockedAccount(owner) ? (
                          <button
                            onClick={() => handleToggleOwnerStatus(owner)}
                            disabled={
                              pendingStatusAction === `toggle-${owner.id}`
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Unblock owner"
                          >
                            <ShieldCheck size={14} />
                            {pendingStatusAction === `toggle-${owner.id}`
                              ? "Unblocking..."
                              : "Unblock"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleOwnerStatus(owner)}
                            disabled={
                              pendingStatusAction === `toggle-${owner.id}`
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Block owner"
                          >
                            <ShieldOff size={14} />
                            {pendingStatusAction === `toggle-${owner.id}`
                              ? "Blocking..."
                              : "Block"}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveOwner(owner)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                          title="Remove owner"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex justify-between items-center text-sm border-t border-gray-50 bg-white">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((current) => Math.max(1, current - 1))
            }
            className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition disabled:cursor-not-allowed disabled:text-gray-300"
          >
            ← Previous
          </button>
          <div className="flex gap-1 items-center">
            {getVisiblePages().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold transition ${
                    currentPage === page
                      ? "bg-indigo-50 text-[#6366f1]"
                      : "hover:bg-gray-50 text-gray-600 font-medium"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`${page}-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
              ),
            )}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((current) => Math.min(totalPages, current + 1))
            }
            className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition disabled:cursor-not-allowed disabled:text-gray-300"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Owner;
