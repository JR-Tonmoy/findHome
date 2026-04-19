import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b border-black relative z-[100]">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-black text-2xl font-bold">
            <div className="bg-black text-white p-1 rounded-lg">🏠</div>
            BashaLagbe
          </div>
          <span className="text-black-1600 text-xs font-medium mt-0">
            Find your perfect flat easily
          </span>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 border border-black bg-black text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-black flex-1 md:flex-none justify-center transition">
            <span>+</span> Add Property
          </button>
          <Link
            to="/dashboard/orders"
            className="flex-1 md:flex-none w-full md:w-auto"
          >
            <button className="flex items-center gap-2 border border-black bg-black text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-black w-full justify-center transition cursor-pointer">
              🏠 Order Home
            </button>
          </Link>
          <Link
            to="/login"
            className="flex-1 md:flex-none w-full md:w-auto mt-2 md:mt-0"
          >
            <button className="flex items-center gap-2 border border-black bg-black text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-black w-full justify-center transition cursor-pointer">
              👤 Login/Registration
            </button>
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 border-b-2 border-transparent hover:border-black cursor-pointer font-medium"
            >
              🏢 Property list <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-lg rounded-lg py-2 z-50 overflow-hidden">
                <Link
                  to="/property"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  {/* Property list ar kaj  */}
                  All property
                </Link>
                <Link
                  to="/property?division=Barishal"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Barishal division
                </Link>
                <Link
                  to="/property?division=Chittagong"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Chittagong division
                </Link>
                <Link
                  to="/property?division=Dhaka"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dhaka division
                </Link>
                <Link
                  to="/property?division=Khulna"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Khulna division
                </Link>
                <Link
                  to="/property?division=Mymensingh"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Mymensingh division
                </Link>
                <Link
                  to="/property?division=Rajshahi"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Rajshahi division
                </Link>
                <Link
                  to="/property?division=Rangpur"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Rangpur division
                </Link>
                <Link
                  to="/property?division=Sylhet"
                  className="block px-5 py-2.5 text-[15px] !text-black hover:bg-gray-50 transform origin-left hover:scale-105 transition-all duration-300"
                  onClick={() => setDropdownOpen(false)}
                >
                  Sylhet division
                </Link>
              </div>
            )}
          </div>
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
