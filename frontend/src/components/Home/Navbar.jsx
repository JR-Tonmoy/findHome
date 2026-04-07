import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>

      {/* Top Purple Navbar */}
      <div className="bg-[#6357a6] text-white px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span>🏠</span>
          BashaLagbe?
        </div>

        {/* Search Box */}
        <div className="relative w-125">

          <input
            type="text"
            placeholder="Search by location/City Name"
            className="w-full px-5 py-3 rounded-lg text-black outline-none"
          />

          <span className="absolute right-4 top-3 text-gray-500 text-xl">
            🔍
          </span>

        </div>

        {/* Login */}
        <div className="text-xl font-semibold cursor-pointer">
          <Link to="/login">
            Login/Registration →
          </Link>
        </div>

      </div>

      {/* Bottom Menu Navbar */}
      <div className="bg-black text-white p-5 px-10 py-4 flex items-center justify-between">

        {/* Left Menu */}
        <div className="flex items-center gap-12 text-lg font-semibold">

          <Link to="/home" className="flex items-center gap-2">
            🏠 Home
          </Link>

          <Link to="/property" className="flex items-center gap-2">
            🏢 Property List ▼
          </Link>

          <Link to="/profile" className="flex items-center gap-2">
            👤 Profile
          </Link>

        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">

          <button className="border border-gray-500 px-6 py-2 rounded-lg font-semibold">
            + Add Property
          </button>

          <button className="border border-gray-500 px-6 py-2 rounded-lg font-semibold">
            Order Home
          </button>

        </div>

      </div>

    </div>
  );
};

export default Navbar;