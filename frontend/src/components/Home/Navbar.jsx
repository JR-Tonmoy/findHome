import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-white border-b border-black">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-black text-2xl font-bold">
          <div className="bg-black text-white p-1 rounded-lg">🏠</div>
          BashaLagbe
        </div>

        {/* Right Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 border border-black px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white flex-1 md:flex-none justify-center">
            <span>+</span> Add Property
          </button>
          <button className="flex items-center gap-2 border border-black px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white flex-1 md:flex-none justify-center">
            🏠 Order Home
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 border border-black text-black px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white w-full md:w-auto justify-center mt-2 md:mt-0"
          >
            👤 Login/Registration
          </Link>
        </div>
      </div>

      {/* Bottom Menu Navbar */}
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Menu */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-black text-sm font-medium w-full md:w-auto">
          <Link
            to="/home"
            className="flex items-center gap-2 text-black font-bold"
          >
            🏠 Home
          </Link>
          <Link
            to="/property"
            className="flex items-center gap-2 border-b-2 border-transparent hover:border-black"
          >
            🏢 Property list
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 border-b-2 border-transparent hover:border-black"
          >
            👤 Profile
          </Link>
          <Link
            to="/saved"
            className="flex items-center gap-2 border-b-2 border-transparent hover:border-black"
          >
            ♡ Saved Property
          </Link>
          <Link
            to="/earn"
            className="flex items-center gap-2 border-b-2 border-transparent hover:border-black"
          >
            💵 Earn Money
          </Link>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border border-black rounded-lg text-sm outline-none focus:border-black"
          />
          <span className="absolute right-3 top-2.5 text-black">🔍</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
