import { Building, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";
import { normalizeMemberRecord } from "../../../utils/memberStorage";

const Owner = () => {
  const [registeredOwners, setRegisteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRemoveOwner = async (index) => {
    const owner = registeredOwners[index];
    const updatedOwners = registeredOwners.filter((_, i) => i !== index);
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
                    colSpan={5}
                  >
                    No owner registration found yet.
                  </td>
                </tr>
              ) : (
                registeredOwners.map((owner, index) => (
                  <tr
                    key={owner.id || `${owner.email}-${index}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
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
                      <button
                        onClick={() => handleRemoveOwner(index)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                        title="Remove owner"
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
      </div>
    </div>
  );
};

export default Owner;
