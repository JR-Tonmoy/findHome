import { DollarSign, Home, PlusCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const PropertyOwnerDashboard = () => {
  // প্রোপার্টি ওনার এর জন্য ডেমো ডেটা (কিছু প্রোপার্টি যা ওনার অ্যাড করেছে)
  // Demo data for properties added by the owner
  const myProperties = [
    {
      id: 101,
      title: "Luxury Apartment in Gulshan",
      location: "Gulshan-1, Dhaka",
      price: "50,000",
      status: "Rented", // ভাড়া হয়ে গেছে
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    },
    {
      id: 102,
      title: "Cozy Family Apartment",
      location: "Mirpur-10, Dhaka",
      price: "15,000",
      status: "Available", // এখনো ভাড়া হয়নি
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* 1. ড্যাশবোর্ড হেডার অংশ (Dashboard Header) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Property Owner!
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your properties and tenants right from here. (এখান থেকে আপনার
          প্রোপার্টি এবং ভাড়াটিয়াদের ম্যানেজ করুন।)
        </p>
      </div>

      {/* 2. স্ট্যাটাস কার্ডস (কিছু সুন্দর ইনফরমেশন দেখানোর জন্য) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
        {/* মোট প্রোপার্টি (Total Properties) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Properties</p>
            <h2 className="text-3xl font-bold text-gray-800">5</h2>
          </div>
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500">
            <Home size={24} />
          </div>
        </div>

        {/* মোট ভাড়াটিয়া (Total Tenants) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Tenants</p>
            <h2 className="text-3xl font-bold text-gray-800">3</h2>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-500">
            <Users size={24} />
          </div>
        </div>

        {/* মোট আয় (Total Earnings) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Monthly Earnings</p>
            <h2 className="text-3xl font-bold text-gray-800">৳85,000</h2>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl text-yellow-500">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 3. আপনার প্রোপার্টি লিস্ট (My Properties) */}
      <div className="flex justify-between items-center mt-10 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          My Properties (আমার প্রোপার্টিসমূহ)
        </h2>
        {/* নতুন প্রোপার্টি অ্যাড করার বাটন */}
        <Link
          to="/owner-dashboard/add-property"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <PlusCircle size={18} />
          Add Property
        </Link>
      </div>

      {/* গ্রিড লেআউট প্রোপার্টি দেখানোর জন্য */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProperties.map((house) => (
          <div
            key={house.id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* ছবির অংশ */}
            <div className="h-56 overflow-hidden">
              <img
                src={house.image}
                alt={house.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>

            {/* বিস্তারিত তথ্যের অংশ */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {house.title}
                </h3>
                {/* স্ট্যাটাস অনুযায়ী ব্যাজ এর রঙ পরিবর্তন করা হলো */}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    house.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {house.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
                <span>📍</span> {house.location}
              </p>

              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                <div className="text-indigo-600 font-bold flex items-center gap-2">
                  ৳{house.price}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    /month
                  </span>
                </div>
                <button className="text-white bg-indigo-600 px-4 py-1.5 rounded hover:bg-indigo-700 transition font-medium text-sm">
                  Edit Property
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;
