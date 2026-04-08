const Hero = () => {
  return (
    // <div className="container items-center mx-auto px-4 mt-8 flex flex-wrap gap-4">
    <div className="container mx-auto px-4 mt-5 flex flex-wrap justify-center gap-4">
      {/* Category Buttons */}
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        🏠 Family
      </button>
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        👤 Bachelor
      </button>
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        🏢 Office
      </button>
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        🛏️ Sublet
      </button>
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        🏨 Hostel
      </button>
      <button className="flex items-center gap-2 border border-gray-200 bg-white px-6 py-2 rounded-lg hover:border-blue-500 text-sm font-medium text-gray-700">
        🏪 Shop
      </button>
    </div>
  );
};

export default Hero;
