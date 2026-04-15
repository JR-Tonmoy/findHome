import { Eye, FileText, Heart } from "lucide-react"; // Import icons for stats
import { Link } from "react-router-dom"; // Import Link

const Dashboard = () => {
  // Recommended properties data
  const recommendedHouses = [
    {
      id: 201,
      title: "3 Bedroom Apartment",
      location: "Bashundhara, Dhaka",
      price: "28,000",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      status: "Available",
    },
    {
      id: 202,
      title: "Bachelor Room",
      location: "Rampura, Dhaka",
      price: "8,000",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      status: "Available",
    },
    {
      id: 203,
      title: "Family Flat",
      location: "Dhanmondi, Dhaka",
      price: "22,000",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      status: "Available",
    },
    {
      id: 204,
      title: "Modern Studio",
      location: "Banani, Dhaka",
      price: "18,000",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      status: "Available",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Tenant!
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Here's what's happening with your property search
        </p>
      </div>

      {/* Cards - Responsive grid: 1 col on mobile, 3 cols on tablet and desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
        {/* Saved Houses Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Saved Houses</p>
            <h2 className="text-3xl font-bold text-gray-800">12</h2>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-500">
            <Heart size={24} />
          </div>
        </div>

        {/* Active Requests Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Active Requests</p>
            <h2 className="text-3xl font-bold text-gray-800">5</h2>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-500">
            <FileText size={24} />
          </div>
        </div>

        {/* Properties Viewed Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Properties Viewed</p>
            <h2 className="text-3xl font-bold text-gray-800">28</h2>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-purple-500">
            <Eye size={24} />
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <h2 className="text-xl md:text-2xl font-bold mt-10 mb-6 text-gray-800">
        Recommended Properties
      </h2>

      {/* Grid: 1 col mobile, 2 col tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedHouses.map((house, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50"
          >
            {/* House Image */}
            <div className="h-56 overflow-hidden">
              <img
                src={house.image}
                alt={house.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>

            {/* House Info Details */}
            <div className="p-5 bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {house.title}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  {house.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
                <span>📍</span> {house.location}
              </p>

              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                <div className="text-blue-600 font-bold flex items-center gap-2">
                  ৳{house.price}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    /month
                  </span>
                </div>
                <Link
                  to={`/property/${house.id}`}
                  className="text-white bg-blue-600 px-4 py-1.5 rounded hover:bg-blue-700 transition font-medium text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mt-10 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Recent Activity
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Saved property:
                </span>{" "}
                2 Bedroom Flat in Gulshan
              </p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Viewed property:
                </span>{" "}
                Bachelor Room in Mirpur
              </p>
              <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Sent request:
                </span>{" "}
                3 Bedroom House in Uttara
              </p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Viewed property:
                </span>{" "}
                Studio in Banani
              </p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
