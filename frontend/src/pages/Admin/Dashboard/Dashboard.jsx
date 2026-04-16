import { BarChart3, Building, UserCheck, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Admin Dashboard
        </h2>
        <p className="text-gray-500">Monitor and manage your platform</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Tenants
            </p>
            <h3 className="text-3xl font-black text-gray-900">5</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Owners
            </p>
            <h3 className="text-3xl font-black text-gray-900">5</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Properties
            </p>
            <h3 className="text-3xl font-black text-gray-900">22</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="bg-orange-100 text-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-gray-900">৳372,000</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h3>

        <div className="space-y-6">
          {/* Activity Item 1 */}
          <div className="flex gap-4 items-start relative before:absolute before:left-[7px] before:top-8 before:w-[2px] before:h-full before:bg-gray-100 pb-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">New property listed</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Fatima Khan listed a 3 BHK apartment in Dhanmondi
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                2 hours ago
              </span>
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="flex gap-4 items-start relative before:absolute before:left-[7px] before:top-8 before:w-[2px] before:h-full before:bg-gray-100 pb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">New tenant registered</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Ahmed Hassan joined the platform
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                5 hours ago
              </span>
            </div>
          </div>

          {/* Activity Item 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">Payment received</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Rahim Ahmed paid ৳30,000 for monthly rent
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                1 day ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
