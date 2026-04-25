import { Link, useNavigate } from "react-router-dom";

const Product = ({ selectedCategory = "All" }) => {
  const navigate = useNavigate();

  const handleViewDetails = (e, propertyId) => {
    e.preventDefault();
    navigate(`/property/${propertyId}`);
  };

  // Sample data: 3 properties for each category (Family, Bachelor, Office, Sublet, Hostel, Shop) = 18 total properties
  const featuredProperties = [
    // --- Family Properties ---
    {
      
      id: 1,
      category: "Family",
      title: "Premium Family Flat",
      location: "Dhanmondi",
      price: "25,000",
      beds: 3,
      baths: 3,
      sqft: 1500,
      image: "/2 Bedroom.png",
    },
    {
      id: 2,
      category: "Family",
      title: "Standard Family Apartment",
      location: "Mirpur 10",
      price: "18,000",
      beds: 2,
      baths: 2,
      sqft: 1100,
      image: "/3baderoom.png",
    },
    {
      id: 3,
      category: "Family",
      title: "Affordable Family House",
      location: "Uttara",
      price: "20,000",
      beds: 3,
      baths: 2,
      sqft: 1200,
      image: "/2 Bedroom.png",
    },

    // --- Bachelor Properties ---
    {
      id: 4,
      category: "Bachelor",
      title: "Single Bachelor Room",
      location: "Mohammadpur",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 300,
      image: "/SingleRoom.png",
    },
    {
      id: 5,
      category: "Bachelor",
      title: "Shared Bachelor Mess",
      location: "Farmgate",
      price: "4,000",
      beds: 1,
      baths: 1,
      sqft: 500,
      image: "/Bacelor.png",
    },
    {
      id: 6,
      category: "Bachelor",
      title: "Executive Bachelor Flat",
      location: "Gulshan",
      price: "15,000",
      beds: 1,
      baths: 1,
      sqft: 600,
      image: "/SingleRoom.png",
    },

    // --- Office Properties ---
    {
      id: 7,
      category: "Office",
      title: "Corporate Office Space",
      location: "Banani",
      price: "80,000",
      beds: null,
      baths: 2,
      sqft: 2000,
      image: "/Master.png",
    },
    {
      id: 8,
      category: "Office",
      title: "Small Startup Office",
      location: "Badda",
      price: "30,000",
      beds: null,
      baths: 1,
      sqft: 800,
      image: "Office Floor Rent.png",
    },
    {
      id: 9,
      category: "Office",
      title: "Co-working Space Desk",
      location: "Karwan Bazar",
      price: "10,000",
      beds: null,
      baths: 1,
      sqft: 150,
      image:
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
    },

    {
      id: 20,
      category: "Office",
      title: "Office Floor Rent",
      location: "Uttara 10",
      price: "15,000",
      beds: null,
      baths: 1,
      sqft: 150,
      image:
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
    },
    // --- Sublet Properties ---
    {
      id: 10,
      category: "Sublet",
      title: "Sublet for Female",
      location: "Azimpur",
      price: "5,500",
      beds: 1,
      baths: 1,
      sqft: 250,
      image: "/SingleRoom.png",
    },
    {
      id: 11,
      category: "Sublet",
      title: "Master Bed Sublet",
      location: "Bashundhara R/A",
      price: "8,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/Master.png",
    },
    {
      id: 12,
      category: "Sublet",
      title: "Single Room Sublet",
      location: "Khilgaon",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 300,
      image: "/Bacelor.png",
    },

    // --- Hostel Properties ---
    {
      id: 13,
      category: "Hostel",
      title: "Boys Premium Hostel",
      location: "Panthapath",
      price: "5,000",
      beds: 1,
      baths: 1,
      sqft: 200,
      image: "/SingleRoom.png",
    },
    {
      id: 14,
      category: "Hostel",
      title: "Girls Safe Hostel",
      location: "Shantinagar",
      price: "6,500",
      beds: 1,
      baths: 1,
      sqft: 250,
      image: "/Bacelor.png",
    },
    {
      id: 15,
      category: "Hostel",
      title: "Executive Working Hostel",
      location: "Tejgaon",
      price: "7,000",
      beds: 1,
      baths: 1,
      sqft: 220,
      image: "/SingleRoom.png",
    },

    // --- Shop Properties ---
    {
      id: 16,
      category: "Shop",
      title: "Main Road Shop",
      location: "New Market",
      price: "50,000",
      beds: null,
      baths: null,
      sqft: 500,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 17,
      category: "Shop",
      title: "Inside Mall Shop",
      location: "Bashundhara City",
      price: "80,000",
      beds: null,
      baths: null,
      sqft: 400,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 18,
      category: "Shop",
      title: "Local Area Shop",
      location: "Moghbazar",
      price: "15,000",
      beds: null,
      baths: null,
      sqft: 200,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
  ];

  // Filter properties based on selected category, then slice to show max 10
  const filteredProperties =
    selectedCategory === "All"
      ? featuredProperties
      : featuredProperties.filter(
          (property) => property.category === selectedCategory,
        );

  const displayedProperties = filteredProperties.slice(0, 10);

  return (
    <div className="container mx-auto px-4 md:px-10 mt-5 bg-white py-5">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-black text-center md:text-left">
        Featured Properties
      </h2>

      {/* Card Grid Container for Featured Properties*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform duration-300 hover:scale-105 h-full cursor-pointer"
            >
              {/* <Featured Properties image edit/> */}
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-black line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1 line-clamp-1">
                  📍 {property.location}
                </p>

                <div className="mt-3">
                  <span className="text-black font-bold text-xl">
                    ৳{property.price}
                  </span>
                  <span className="text-gray-500 text-sm"> / month</span>
                </div>

                {/* Property Details (Beds, Baths, Sqft) */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 mb-4 pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-700">
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

                <button
                  onClick={(e) => handleViewDetails(e, property.id)}
                  className="mt-auto block w-full text-center bg-black !text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No properties found.</p>
        )}
      </div>

      {/* Browse Button */}
      <div className="flex justify-center mt-10">
        <Link to="/dashboard/browse">
          <button className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-white hover:text-black border border-black transition mt-10">
            Browse All Properties
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Product;
