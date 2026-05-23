import {
  ArrowLeft,
  Bath,
  BedDouble,
  Briefcase,
  Check,
  Layers,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Logo from "../../../../components/Logo/Logo";
import { resolvePublicPropertyById } from "../../../../utils/publicPropertyResolver";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentLocation = location.pathname + location.search;

  useEffect(() => {
    let isMounted = true;

    const loadProperty = async () => {
      setLoading(true);

      try {
        const resolvedProperty = await resolvePublicPropertyById(id);

        if (isMounted) {
          setProperty(resolvedProperty);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProperty();

    window.addEventListener("owner-properties-updated", loadProperty);
    window.addEventListener("public-properties-updated", loadProperty);

    return () => {
      isMounted = false;
      window.removeEventListener("owner-properties-updated", loadProperty);
      window.removeEventListener("public-properties-updated", loadProperty);
    };
  }, [id]);

  const isOccupied = Boolean(
    property?.isOccupied ||
    ["booked", "occupied", "currently_occupied", "rented"].includes(
      String(property?.status || property?.raw?.status || "")
        .toLowerCase()
        .trim(),
    ),
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-screen pb-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold text-gray-900">
            Property not found
          </h1>
          <p className="mt-2 text-gray-600">
            This listing may have been removed or is no longer available.
          </p>
          <Link
            to="/dashboard/browse"
            className="mt-6 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-50">
        <Logo
          variant="default"
          size="sm"
          showSubtitle={true}
          linkTo="/dashboard/browse"
        />
        <Link
          to="/dashboard/browse"
          className="flex items-center text-gray-500 hover:text-black font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Browse
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={property.images[0]}
                  alt="Main"
                  className="w-full h-87.5 md:h-112.5 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl overflow-hidden h-32 md:h-48">
                  <img
                    src={property.images[1]}
                    alt="Sub 1"
                    className="w-full h-full object-cover"
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
                  <div className="text-3xl font-bold text-black flex items-end md:justify-end">
                    BDT {property.price}
                  </div>
                  <div className="text-gray-400 text-sm font-medium mt-1">
                    /month
                  </div>
                </div>
              </div>

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
                  <span className="text-gray-500 text-xs md:text-sm">
                    Sq Ft
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <ArrowLeft
                    size={24}
                    className="text-gray-400 mb-2 rotate-90"
                  />
                  <span className="font-bold text-gray-800 text-lg">
                    {property.floor}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Floor
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-transparent inline-block pb-1 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {property.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Features and Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  {property.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-gray-600 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-black mr-3"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Contact Owner
              </h3>

              <div className="space-y-5">
                {/* Owner Profile Image */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {property.owner?.profile_image || property.owner?.avatar ? (
                      <img
                        src={
                          property.owner.profile_image || property.owner.avatar
                        }
                        alt={property.owner.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold"
                      style={{
                        display:
                          property.owner?.profile_image ||
                          property.owner?.avatar
                            ? "none"
                            : "flex",
                      }}
                    >
                      {property.owner.name
                        ? property.owner.name.charAt(0).toUpperCase()
                        : "O"}
                    </div>
                  </div>
                </div>

                {/* Owner Name */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Owner Name
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {property.owner?.name || "Property Owner"}
                  </p>
                </div>

                {/* Phone */}
                {property.owner?.phone && property.owner.phone !== "N/A" && (
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-2.5 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Phone
                        size={20}
                        className="text-gray-600 group-hover:text-blue-600 transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                        Phone
                      </p>
                      <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {property.owner.phone}
                      </p>
                    </div>
                  </a>
                )}

                {/* Email */}
                {property.owner?.email && property.owner.email !== "N/A" && (
                  <a
                    href={`mailto:${property.owner.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <div className="p-2.5 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Mail
                        size={20}
                        className="text-gray-600 group-hover:text-blue-600 transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                        Email
                      </p>
                      <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors break-all">
                        {property.owner.email}
                      </p>
                    </div>
                  </a>
                )}

                {/* Fallback if no contact info */}
                {(!property.owner?.phone || property.owner.phone === "N/A") &&
                  (!property.owner?.email ||
                    property.owner.email === "N/A") && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Contact information not available. Please check back
                        later.
                      </p>
                    </div>
                  )}
              </div>

              {isOccupied ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-red-500 text-white font-bold py-3.5 mt-8 items-center rounded-xl flex justify-center gap-2 cursor-not-allowed opacity-90"
                >
                  <Briefcase size={20} />
                  <span>Currently Occupied</span>
                </button>
              ) : (
                <Link
                  to={isAuthenticated ? `/order/${property.id}` : "/login"}
                  state={{ from: currentLocation }}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 mt-8 items-center rounded-xl flex justify-center gap-2 transition-colors"
                  onClick={(event) => {
                    if (!isAuthenticated) {
                      event.preventDefault();
                      setShowAuthModal(true);
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <Briefcase size={20} />
                      <span>Booking Now</span>
                    </>
                  ) : (
                    <span>Login or Register</span>
                  )}
                </Link>
              )}

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Availability</span>
                <span
                  className={`font-bold px-3 py-1 rounded-full ${
                    isOccupied
                      ? "text-red-700 bg-red-50"
                      : "text-green-600 bg-green-50"
                  }`}
                >
                  {isOccupied ? "Currently Occupied" : "Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative pt-10 pb-6 px-6 md:px-8 text-center">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mx-auto w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-black" />
            </div>

            <h3 className="text-xl font-semibold text-black mb-2">
              Please Login or Register
            </h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              We do not share owner contact details without verified user login.
            </p>

            <div className="flex gap-4 border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-2.5 px-4 bg-white border border-black text-black rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  navigate("/register", { state: { from: currentLocation } })
                }
                className="flex-1 py-2.5 px-4 bg-black border border-black text-white rounded-lg font-medium hover:bg-white hover:text-black transition cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewDetails;
