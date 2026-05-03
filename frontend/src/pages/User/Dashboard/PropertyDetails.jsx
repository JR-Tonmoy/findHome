import {
  ArrowLeft,
  Bath,
  BedDouble,
  Briefcase,
  Layers,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();

  // Fake database mimicking all properties
  const allProperties = [
    {
      id: 1,
      title: "2 Bedroom Apartment",
      price: "15,000",
      location: "Dhanmondi, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      floor: "4th Floor",
      type: "Apartment",
      description:
        "Beautiful 2 bedroom apartment in the heart of Dhanmondi. This modern flat features spacious rooms, excellent ventilation, and is located in a well-maintained building with 24/7 security. Perfect for small families.",
      features: [
        "Attached Bathroom",
        "Balcony",
        "24/7 Security",
        "Gas Connection",
        "Water Supply",
        "Lift Available",
        "Car Parking",
        "Generator Backup",
      ],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Ahmed Hassan",
        phone: "+880 1712-345678",
        email: "ahmed@example.com",
      },
    },
    {
      id: 2,
      title: "Bachelor Room",
      price: "6,000",
      location: "Mohammadpur, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "2nd Floor",
      type: "Room",
      description:
        "A compact and budget-friendly room perfect for bachelors or students. Great communication facility in a friendly neighborhood.",
      features: [
        "Attached Bathroom",
        "24/7 Security",
        "Water Supply",
        "Wi-Fi included",
      ],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Rahim Ali",
        phone: "+880 1812-444555",
        email: "rahim@example.com",
      },
    },
    {
      id: 3,
      title: "3 Bedroom Family House",
      price: "35,000",
      location: "Gulshan, Dhaka",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2000,
      floor: "2nd Floor",
      type: "House",
      description:
        "Luxurious 3-bedroom apartment located in the prime area of Gulshan. Premium fittings, full generator backup, and modern amenities available.",
      features: [
        "Attached Bathrooms",
        "Large Balcony",
        "Central AC",
        "24/7 Security",
        "Elevator",
        "Car Parking",
        "Full Generator Backup",
        "CCTV Surveillance",
      ],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Faisal Rahman",
        phone: "+880 1912-888999",
        email: "faisal@example.com",
      },
    },
    {
      id: 4,
      title: "Commercial Shop",
      price: "25,000",
      location: "Mirpur, Dhaka",
      bedrooms: 0,
      bathrooms: 1,
      sqft: 800,
      floor: "Ground Floor",
      type: "Shop",
      description:
        "Spacious commercial shop located on the main road with heavy foot traffic. Perfect for super shops, pharmacies, or branch offices.",
      features: [
        "Main Road Facing",
        "Washroom info",
        "24/7 Electricity",
        "Water Supply",
      ],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Kabir Hossain",
        phone: "+880 1711-222333",
        email: "kabir@example.com",
      },
    },
    {
      id: 5,
      title: "Studio Apartment",
      price: "12,000",
      location: "Banani, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      floor: "5th Floor",
      type: "Apartment",
      description:
        "Cozy studio apartment with modern setup. Ideal for expats or working professionals. Includes a kitchenette and a beautiful view of the city.",
      features: [
        "Open Kitchen",
        "Attached Bathroom",
        "Balcony",
        "Security",
        "Lift Available",
        "Generator",
        "Water Supply",
      ],
      images: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Anisur Rahman",
        phone: "+880 1612-777888",
        email: "anisur@example.com",
      },
    },
    {
      id: 6,
      title: "4 Bedroom Duplex",
      price: "45,000",
      location: "Uttara, Dhaka",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3200,
      floor: "1st & 2nd Floor",
      type: "House",
      description:
        "Premium duplex house with large living spaces, imported tiles, modern kitchen cabinets, and a private garden area. 2 car parking spaces available.",
      features: [
        "4 Attached Bathrooms",
        "Private Garden",
        "2 Car Parking spaces",
        "Servant Quarters",
        "Gas Connection",
        "CCTV",
        "24/7 Security",
      ],
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Chowdhury Kamal",
        phone: "+880 1512-111000",
        email: "chowdhury@example.com",
      },
    },
  ];

  // Find the property that matches the id from URL
  const property =
    allProperties.find((p) => p.id === parseInt(id)) || allProperties[0]; // defaults to first if not found

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header for back button */}
      <div className="flex justify-end mb-6">
        <Link
          to="/dashboard/browse"
          className="flex items-center text-gray-500 hover:text-blue-600 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Images & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images Gallery */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="rounded-xl overflow-hidden mb-2">
              <img
                src={property.images[0]}
                alt="Main"
                className="w-full h-[350px] md:h-[450px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl overflow-hidden h-32 md:h-48">
                <img
                  src={property.images[1]}
                  alt="Sub 1"
                  className="w-full h-full object-cover relative"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-32 md:h-48">
                <img
                  src={property.images[2]}
                  alt="Sub 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 mt-3 text-sm md:text-base">
                  <MapPin size={18} className="mr-1 text-gray-400" />
                  {property.location}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-bold text-blue-600 flex items-end md:justify-end">
                  ৳{property.price}
                </div>
                <div className="text-gray-400 text-sm font-medium mt-1">
                  /month
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="border-t border-b border-gray-100 py-6 my-8 grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center text-center">
                <BedDouble size={24} className="text-gray-400 mb-2" />
                <span className="font-bold text-gray-800 text-lg">
                  {property.bedrooms}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">
                  Bedrooms
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Bath size={24} className="text-gray-400 mb-2" />
                <span className="font-bold text-gray-800 text-lg">
                  {property.bathrooms}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">
                  Bathrooms
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Layers size={24} className="text-gray-400 mb-2" />
                <span className="font-bold text-gray-800 text-lg">
                  {property.sqft}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">Sq Ft</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <ArrowLeft size={24} className="text-gray-400 mb-2 rotate-90" />
                <span className="font-bold text-gray-800 text-lg">
                  {property.floor}
                </span>
                <span className="text-gray-500 text-xs md:text-sm">Floor</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-transparent inline-block pb-1 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                {property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-gray-600 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Contact Owner
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  Owner Name
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {property.owner.name}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                    Phone
                  </p>
                  <p className="font-bold text-gray-800">
                    {property.owner.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                    Email
                  </p>
                  <p className="font-bold text-gray-800">
                    {property.owner.email}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to={`/dashboard/order/${property.id}`}
              className="w-full bg-black hover:bg-white hover:text-black border border-black font-bold py-3.5 mt-8 items-center rounded-xl flex justify-center gap-2 transition-colors"
              style={{ color: "#fff" }}
            >
              <Briefcase size={20} style={{ color: "#fff" }} />
              <span style={{ color: "#fff" }}>Booking</span>
            </Link>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <span className="text-gray-500 font-medium">Availability</span>
              <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
