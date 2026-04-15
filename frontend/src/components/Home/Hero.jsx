const Hero = () => {
  return (
    // <div className="container items-center mx-auto px-4 mt-8 flex flex-wrap gap-4">
    <div className="container mx-auto px-4 mt-5 flex flex-wrap justify-center gap-2 md:gap-4">
      {/* Category Buttons */}
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        🏠 Family
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        👤 Bachelor
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        🏢 Office
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        🛏️ Sublet
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        🏨 Hostel
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 md:px-6 py-2 rounded-lg hover:border-blue-500 text-xs md:text-sm font-medium text-gray-700 w-full sm:w-auto">
        🏪 Shop
      </button>
    </div>
  );
};

export default Hero;
