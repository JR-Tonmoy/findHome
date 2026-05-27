import {
  Filter,
  Mail,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../../utils/adminService";
import { normalizeMemberRecord } from "../../../utils/memberStorage";

const Users = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingStatusAction, setPendingStatusAction] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await adminService.fetchAdminUsers();
        if (!active) return;
        setRegisteredUsers(
          Array.isArray(users) ? users.map(normalizeMemberRecord) : [],
        );
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Failed to load users from the backend.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(registeredUsers.length / itemsPerPage),
  );
  const paginatedUsers = registeredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handleRemoveUser = async (user) => {
    const updatedUsers = registeredUsers.filter((item) => {
      if (user?.id) {
        return item.id !== user.id;
      }

      return !(
        item.email === user?.email &&
        item.username === user?.username &&
        item.date === user?.date
      );
    });
    setRegisteredUsers(updatedUsers);

    try {
      if (user?.id) {
        await adminService.deleteAdminUser(user.id);
      } else {
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      }
    } catch (err) {
      console.warn("Failed to delete user on backend:", err);
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

  const handleToggleUserStatus = async (targetUser) => {
    const blocked = isBlockedAccount(targetUser);
    const toastId = toast.loading(
      blocked ? "Unblocking user..." : "Blocking user...",
    );
    setPendingStatusAction(`toggle-${targetUser.id}`);

    try {
      const updatedUser = await adminService.toggleAdminUserBlock(
        targetUser.id,
      );
      const nextBlocked = Boolean(updatedUser?.is_blocked);

      setRegisteredUsers((current) =>
        current.map((currentUser) =>
          currentUser.id === targetUser.id
            ? {
                ...currentUser,
                ...updatedUser,
                is_blocked: nextBlocked,
                account_status: nextBlocked ? "blocked" : "active",
              }
            : currentUser,
        ),
      );

      toast.success(
        nextBlocked
          ? "User blocked successfully"
          : "User unblocked successfully",
        { id: toastId },
      );
    } catch (err) {
      toast.error(
        adminService.getAdminErrorMessage(err, "Failed to update user status"),
        { id: toastId },
      );
    } finally {
      setPendingStatusAction(null);
    }
  };

  const stats = [
    {
      title: "Active Users",
      count: String(registeredUsers.length || 0),
      icon: <UsersIcon size={20} className="text-purple-600" />,
      bg: "bg-white",
      gradient: "bg-linear-to-r from-blue-50 via-purple-50 to-pink-50",
    },
    {
      title: "Email Verified",
      count: String(
        registeredUsers.filter(
          (u) => u.email_verified_at || u.is_verified || u.emailVerified,
        ).length || 0,
      ),
      icon: <Mail size={20} className="text-emerald-500" />,
      bg: "bg-white",
      gradient: "bg-linear-to-r from-emerald-50 to-teal-50",
    },
    {
      title: "Email Unverified",
      count: String(
        registeredUsers.length -
          registeredUsers.filter(
            (u) => u.email_verified_at || u.is_verified || u.emailVerified,
          ).length || 0,
      ),
      icon: <Mail className="text-pink-500" size={20} />,
      bg: "bg-white",
      gradient: "bg-linear-to-r from-pink-50 to-rose-50",
    },
  ];

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-[calc(100vh-80px)]">
      {/* Top Admin Header */}
      {/* 
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <img
            src="https://i.pravatar.cc/150?u=tonmoy"
            alt="Tonmoy Sarker"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        </div>
      </div> 

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      */}

      {/* Breadcrumb & Add User Action */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[15px] text-gray-500 font-medium flex items-center gap-2">
          <UsersIcon size={18} className="text-gray-400" /> Members{" "}
          <span className="text-gray-300">›</span>{" "}
          <span className="text-gray-800 font-medium">Users</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          Loading users from the backend...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl shadow-sm flex flex-col justify-start relative overflow-hidden transition ${stat.gradient}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] absolute top-6`}
            >
              {stat.icon}
            </div>
            <div className="mt-14">
              <p className="text-gray-600 text-[13px] font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-[26px] font-bold text-gray-900 tracking-tight">
                {stat.count}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="relative w-[320px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded shadow-sm bg-gray-50">
              ⌘ K
            </span>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
            <Filter size={16} className="text-gray-400" /> Filter
          </button>
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
              {registeredUsers.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-500"
                    colSpan={6}
                  >
                    No user registration found yet.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id || `${user.email}-${index}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="px-4 py-4 text-center text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-100 flex items-center justify-center shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UsersIcon size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-semibold text-gray-800 text-[13px] leading-tight truncate">
                          {user.fullName}
                        </h4>
                        <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                          {user.phone}
                        </p>
                        <span
                          className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isBlockedAccount(user)
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isBlockedAccount(user) ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px] font-medium">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[13px] font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium whitespace-nowrap">
                      {user.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {isBlockedAccount(user) ? (
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            disabled={
                              pendingStatusAction === `toggle-${user.id}`
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Unblock user"
                          >
                            <ShieldCheck size={14} />
                            {pendingStatusAction === `toggle-${user.id}`
                              ? "Unblocking..."
                              : "Unblock"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            disabled={
                              pendingStatusAction === `toggle-${user.id}`
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Block user"
                          >
                            <ShieldOff size={14} />
                            {pendingStatusAction === `toggle-${user.id}`
                              ? "Blocking..."
                              : "Block"}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUser(user)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                          title="Remove user"
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

export default Users;
