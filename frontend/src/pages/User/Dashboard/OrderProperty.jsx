import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const OrderProperty = () => {
  const { id } = useParams();

  // Fake database mimicking all properties (same as PropertyDetails to ensure data sync)
  const allProperties = [
    {
      id: 1,
      title: "2 Bedroom Apartment",
      price: "15,000",
      location: "Dhanmondi, Dhaka",
      type: "Apartment",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Ahmed Hassan" },
    },
    {
      id: 2,
      title: "Bachelor Room",
      price: "6,000",
      location: "Mohammadpur, Dhaka",
      type: "Room",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Rahim Ali" },
    },
    {
      id: 3,
      title: "3 Bedroom Family House",
      price: "35,000",
      location: "Gulshan, Dhaka",
      type: "House",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Faisal Rahman" },
    },
    {
      id: 4,
      title: "Commercial Shop",
      price: "25,000",
      location: "Mirpur, Dhaka",
      type: "Shop",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Kabir Hossain" },
    },
    {
      id: 5,
      title: "Studio Apartment",
      price: "12,000",
      location: "Banani, Dhaka",
      type: "Apartment",
      images: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Anisur Rahman" },
    },
    {
      id: 6,
      title: "4 Bedroom Duplex",
      price: "45,000",
      location: "Uttara, Dhaka",
      type: "House",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ],
      owner: { name: "Chowdhury Kamal" },
    },
  ];

  // Find the property that matches the id from URL
  const property =
    allProperties.find((p) => p.id === parseInt(id)) || allProperties[0];

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header and Back Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Complete Your Order
          </h1>
          <p className="text-gray-500 mt-1">
            Please fill in your details to confirm your request
          </p>
        </div>
        <Link
          to={`/dashboard/property/${property.id}`}
          className="flex items-center text-gray-500 hover:text-blue-600 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Property
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Personal Information
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +880 1XXX-XXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 pt-4 border-t">
                Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Move-in Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Months)
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                    <option value="24">2 Years</option>
                    <option value="custom">Other / Discuss Later</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message for Owner
                </label>
                <textarea
                  rows="4"
                  placeholder="Hello, I am interested in renting this property..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 mt-6">
                <CheckCircle className="mt-0.5 shrink-0" size={20} />
                <p className="text-sm">
                  By confirming this order, the property owner (
                  {property.owner.name}) will be notified and will contact you
                  shortly to finalize the agreement.
                </p>
              </div>

              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors text-lg mt-8"
              >
                Confirm Order Request
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h3>

            <div className="flex flex-col gap-4 mb-6">
              <div className="w-full h-40 rounded-xl overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded mb-2 inline-block">
                  {property.type}
                </span>
                <h4 className="text-lg font-bold text-gray-800">
                  {property.title}
                </h4>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" /> {property.location}
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-4 my-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Monthly Rent</span>
                <span className="font-semibold text-gray-800">
                  ৳{property.price}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span className="font-semibold text-gray-800">৳0</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Payable Now
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  *(No payment required online)*
                </p>
              </div>
              <span className="text-2xl font-bold text-blue-600">৳0</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <CreditCard size={18} className="text-gray-400 shrink-0" />
              <span>
                Payments are securely made directly to the owner after signing
                the agreement.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProperty;
