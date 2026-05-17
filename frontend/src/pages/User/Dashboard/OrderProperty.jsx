import { ArrowLeft, CheckCircle, CreditCard, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAllProperties } from "../../../utils/propertyStorage";

const OrderProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const allProperties = await fetchAllProperties();
        const foundProperty =
          allProperties.find((p) => p.id === id) || allProperties[0];
        setProperty(foundProperty);
      } catch (error) {
        console.error("Failed to load property:", error);
        setLoading(false);
      }
      setLoading(false);
    };

    loadProperty();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Loading property details...</p>
        </div>
      ) : !property ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Property not found</p>
        </div>
      ) : (
        <>
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
                      <input
                        type="date"
                        min={todayStr}
                        defaultValue={todayStr}
                        placeholder="MM/DD/YYYY"
                        lang="en-US"
                        className="w-full h-12 px-4 text-base text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [color-scheme:light]"
                      />
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

                  <div className="bg-gray-50 text-gray-800 p-4 rounded-xl flex items-start gap-3 mt-6">
                    <CheckCircle className="mt-0.5 shrink-0" size={20} />
                    <p className="text-sm">
                      By confirming this order, the property owner (
                      {property.owner.name}) will be notified and will contact
                      you shortly to finalize the agreement.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors text-lg mt-8"
                  >
                    Confirm Booking Request
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
                    Payments are securely made directly to the owner after
                    signing the agreement.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderProperty;
