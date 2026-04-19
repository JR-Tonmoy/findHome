const Hero = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { name: "Family", icon: "🏠" },
    { name: "Bachelor", icon: "👤" },
    { name: "Office", icon: "🏢" },
    { name: "Sublet", icon: "🛏️" },
    { name: "Hostel", icon: "🏨" },
    { name: "Shop", icon: "🏪" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white py-4 container mx-auto px-4 mt-5 flex flex-wrap justify-center gap-2 md:gap-4 border-b border-gray-100 shadow-sm">
      {/* Category Buttons */}
      <button
        onClick={() => setSelectedCategory("All")}
        className={`flex items-center justify-center gap-2 border px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-medium w-full sm:w-auto transition cursor-pointer ${selectedCategory === "All" ? "bg-white text-black border-black" : "bg-black text-white border-black hover:bg-gray-800"}`}
      >
        🌟 All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setSelectedCategory(cat.name)}
          className={`flex items-center justify-center gap-2 border px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-medium w-full sm:w-auto transition cursor-pointer ${selectedCategory === cat.name ? "bg-white text-black border-black" : "bg-black text-white border-black hover:bg-gray-800"}`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
};

export default Hero;
