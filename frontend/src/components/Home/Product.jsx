import { Link } from "react-router-dom";

const Product = () => {
  // Sample data to make the code simple and easy to loop through
  const featuredProperties = [
    {
      id: 101,
      title: "2 Bedroom Family Flat",
      location: "Dhanmondi 4/A",
      price: "15,000",
      beds: 2,
      baths: 2,
      sqft: 1200,
      image: "/2 Bedroom.png",
    },
    {
      id: 102,
      title: "Bachelor Single Room",
      location: "Mohammadpur Bus Stand",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/SingleRoom.png",
    },
    {
      id: 103,
      title: "Bachelor Single Room",
      location: "Mohammadpur Bus Stand",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/SingleRoom.png",
    },
    {
      id: 104,
      title: "Bachelor Single Room",
      location: "Mohammadpur Bus Stand",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/SingleRoom.png",
    },
    {
      id: 105,
      title: "Bachelor Single Room",
      location: "Mohammadpur Bus Stand",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/SingleRoom.png",
    },
    {
      id: 106,
      title: "3 Bedroom Family Flat",
      location: "Gulshan-2",
      price: "35,000",
      beds: 3,
      baths: 3,
      sqft: 1800,
      image: "/3baderoom.png",
    },
    {
      id: 107,
      title: "Shop for Rent",
      location: "Mirpur-10",
      price: "25,000",
      baths: 1,
      sqft: 600,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 108,
      title: "Bachelor Studio Flat",
      location: "Banani Road-11",
      price: "12,000",
      beds: 1,
      baths: 1,
      sqft: 500,
      image: "/Bacelor.png",
    },
    {
      id: 109,
      title: "Family Duplex House",
      location: "Uttara Sector-7",
      price: "45,000",
      beds: 4,
      baths: 4,
      sqft: 2500,
      image:
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-10 mt-5 bg-gray-50 py-5 rounded-xl">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Featured Properties
      </h2>

      {/* Card Grid Container for Featured Properties*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {featuredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {/* <Featured Properties image edit/> */}
            <div className="w-full h-48 sm:h-50 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1 line-clamp-1">
                📍 {property.location}
              </p>

              <div className="mt-3">
                <span className="text-blue-600 font-bold text-xl">
                  {property.price}
                </span>
                <span className="text-gray-500 text-sm"> /month</span>
              </div>

              {/* Property Details (Beds, Baths, Sqft) */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 pt-4 border-t border-gray-100 text-xs md:text-sm text-gray-600">
                {property.beds && (
                  <span className="flex items-center gap-1">
                    🛏️ {property.beds} Bed
                  </span>
                )}
                {property.baths && (
                  <span className="flex items-center gap-1">
                    🛁 {property.baths} Bath
                  </span>
                )}
                <span className="flex items-center gap-1">
                  📐 {property.sqft} sqft
                </span>
              </div>

              <Link
                to={`/property/${property.id}`}
                className="mt-4 block text-center bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Browse Button */}
      <div className="flex justify-center mt-10">
        {/* <Link to="/register">
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Go to Register
  </button>
</Link> */}
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-blue-700 transition">
          Browse All Properties
        </button>
      </div>
    </div>
  );
};

export default Product;
