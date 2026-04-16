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
    <div className="container mx-auto px-4 mt-5 flex flex-wrap justify-center gap-2 md:gap-4">
      {/* Category Buttons */}
      <button
        onClick={() => setSelectedCategory("All")}
        className={`flex items-center justify-center gap-2 border px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium w-full sm:w-auto transition ${selectedCategory === "All" ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200 text-gray-700"}`}
      >
        🌟 All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setSelectedCategory(cat.name)}
          className={`flex items-center justify-center gap-2 border px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium w-full sm:w-auto transition ${selectedCategory === cat.name ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200 text-gray-700"}`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
};

export default Hero;
