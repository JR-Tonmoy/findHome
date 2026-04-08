const Product = () => {
  // Sample data to make the code simple and easy to loop through
  const featuredProperties = [
    {
      id: 1,
      title: "2 Bedroom Family Flat",
      location: "Dhanmondi 4/A",
      price: "৳15,000",
      beds: 2,
      baths: 2,
      sqft: 1200,
      image:
        "https://images.thetolet.com/property_images/57265/property_ebfCdoamT.webp?v=1.5",
    },
    {
      id: 2,
      title: "Bachelor Single Room",
      location: "Mohammadpur Bus Stand",
      price: "৳6,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxXqpdakSvm0XR3nqgAB4pPWg_O3_hIx0nKQ&s",
    },
    {
      id: 3,
      title: "3 Bedroom Family Flat",
      location: "Gulshan-2",
      price: "৳35,000",
      beds: 3,
      baths: 3,
      sqft: 1800,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMMt3dq8fako6hyZFI1uMp0YmGw2oLH6FyAQ&s",
    },
    {
      id: 4,
      title: "Shop for Rent",
      location: "Mirpur-10",
      price: "৳25,000",
      baths: 1,
      sqft: 600,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 5,
      title: "Bachelor Studio Flat",
      location: "Banani Road-11",
      price: "৳12,000",
      beds: 1,
      baths: 1,
      sqft: 500,
      image: "https://via.placeholder.com/400x250",
    },
    {
      id: 6,
      title: "Family Duplex House",
      location: "Uttara Sector-7",
      price: "৳45,000",
      beds: 4,
      baths: 4,
      sqft: 2500,
      image: "https://via.placeholder.com/400x250",
    },
  ];

  return (
    <div className="container mx-auto px-4 mt-12 bg-gray-50 py-10 rounded-xl">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Featured Properties
      </h2>

      {/* Card Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <div className="w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900">
                {property.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                📍 {property.location}
              </p>

              <div className="mt-3">
                <span className="text-blue-600 font-bold text-xl">
                  {property.price}
                </span>
                <span className="text-gray-500 text-sm"> /month</span>
              </div>

              {/* Property Details (Beds, Baths, Sqft) */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
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
            </div>
          </div>
        ))}
      </div>

      {/* Browse Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-blue-700 transition">
          Browse All Properties
        </button>
      </div>
    </div>
  );
};

export default Product;
