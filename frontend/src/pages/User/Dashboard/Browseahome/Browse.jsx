import { BedDouble, Filter, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy data for the houses
const properties = [
  {
    id: 1,
    title: "2 Bedroom Apartment",
    location: "Dhanmondi, Dhaka",
    beds: 2,
    type: "Apartment",
    price: "15,000",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    title: "Bachelor Room",
    location: "Mohammadpur, Dhaka",
    beds: 1,
    type: "Room",
    price: "6,000",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    title: "3 Bedroom Family House",
    location: "Gulshan, Dhaka",
    beds: 3,
    type: "House",
    price: "35,000",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    title: "Commercial Shop",
    location: "Mirpur, Dhaka",
    beds: 0,
    type: "Shop",
    price: "25,000",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    title: "Studio Apartment",
    location: "Banani, Dhaka",
    beds: 1,
    type: "Apartment",
    price: "12,000",
    image:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    title: "4 Bedroom Duplex",
    location: "Uttara, Dhaka",
    beds: 4,
    type: "House",
    price: "45,000",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
];

const Browse = () => {
  return (
    <div className="p-6">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Browse Properties</h1>
        <p className="text-gray-500 mt-1">Find your perfect rental home</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search location..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Property Type"
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max Price (BDT)"
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
          <Filter size={18} /> Apply Filters
        </button>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image Box */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Box */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  {property.title}
                </h3>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin size={16} className="mr-1" />
                {property.location}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                {property.beds > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BedDouble size={16} className="mr-1 text-blue-500" />
                    {property.beds} Bed
                  </div>
                )}
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded">
                  {property.type}
                </span>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <div className="text-blue-600 font-bold text-lg flex items-center">
                  ৳ {property.price}
                  <span className="text-gray-400 text-sm font-normal ml-1">
                    /month
                  </span>
                </div>
                <Link
                  to={`/property/${property.id}`}
                  className="text-blue-600 text-sm font-semibold hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
