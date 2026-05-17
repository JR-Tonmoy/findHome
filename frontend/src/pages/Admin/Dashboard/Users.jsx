import {
  Filter,
  Mail,
  Plus,
  Search,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";
import { normalizeMemberRecord } from "../../../utils/memberStorage";

const Users = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const users = await adminService.fetchAdminUsers();
        if (!active) return;
        setRegisteredUsers(
          Array.isArray(users) ? users.map(normalizeMemberRecord) : [],
        );
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const handleRemoveUser = async (index) => {
    const user = registeredUsers[index];
    const updatedUsers = registeredUsers.filter((_, i) => i !== index);
    setRegisteredUsers(updatedUsers);

    // Try to delete on the backend, if available. If it fails, keep local change.
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
      */}

      {/* Breadcrumb & Add User Action */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[15px] text-gray-500 font-medium flex items-center gap-2">
          <UsersIcon size={18} className="text-gray-400" /> Members{" "}
          <span className="text-gray-300">›</span>{" "}
          <span className="text-gray-800 font-medium">Users</span>
        </div>
        <button className="flex items-center justify-center gap-2 bg-linear-to-r from-[#9d4edd] to-[#6366f1] text-white px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition font-medium text-sm w-auto">
          <Plus size={16} /> Add User
        </button>
      </div>

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
                    colSpan={5}
                  >
                    No user registration found yet.
                  </td>
                </tr>
              ) : (
                registeredUsers.map((user, index) => (
                  <tr
                    key={user.id || `${user.email}-${index}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
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
                      <button
                        onClick={() => handleRemoveUser(index)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                        title="Remove user"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex justify-between items-center text-sm border-t border-gray-50 bg-white">
          <button className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition">
            ← Previous
          </button>
          <div className="flex gap-1 items-center">
            <button className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-[#6366f1] rounded-lg font-semibold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">
              ...
            </span>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition">
              8
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition">
              9
            </button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition">
              10
            </button>
          </div>
          <button className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
