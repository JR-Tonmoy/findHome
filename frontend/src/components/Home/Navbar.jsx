import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-white border-b border-gray-100">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
          <div className="bg-blue-600 text-white p-2 rounded-lg">🏠</div>
          BashaLagbe
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            <span>+</span> Add Property
          </button>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            🏠 Order Home
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
          >
            👤 Login/Registration
          </Link>
        </div>
      </div>

      {/* Bottom Menu Navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Menu */}
        <div className="flex items-center gap-8 text-gray-600 text-sm font-medium">
          <Link
            to="/home"
            className="flex items-center gap-2 text-black font-semibold"
          >
            🏠 Home
          </Link>
          <Link
            to="/property"
            className="flex items-center gap-2 hover:text-black"
          >
            🏢 Property list
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-black"
          >
            👤 Profile
          </Link>
          <Link
            to="/saved"
            className="flex items-center gap-2 hover:text-black"
          >
            ♡ Saved Property
          </Link>
          <Link to="/earn" className="flex items-center gap-2 hover:text-black">
            💵 Earn Money
          </Link>
        </div>

        {/* Search Box */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
