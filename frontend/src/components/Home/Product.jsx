const Product = () => {
  return (
    <div className="px-10 mt-10">

      {/* Card Container */}
      <div className="grid grid-cols-5 gap-6">

        {/* Card 1 */}
        <div className="bg-white border rounded shadow">

          <img
            src="https://via.placeholder.com/250"
            alt="House"
            className="w-full h-40 object-cover rounded-t"
          />

          <div className="p-3">

            <h2 className="font-bold">
              Modern Family House
            </h2>

            <p>📍 Uttara, Dhaka</p>

            <div className="flex justify-between items-center mt-2">

              <span className="font-semibold">
                ৳ 25,500/month
              </span>

              <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                View Details
              </button>

            </div>

          </div>

        </div>

        {/* Card 2 */}
        <div className="bg-white border rounded shadow">

          <img
            src="https://via.placeholder.com/250"
            alt="House"
            className="w-full h-40 object-cover rounded-t"
          />

          <div className="p-3">

            <h2 className="font-bold">
              Bachelor Room
            </h2>

            <p>📍 Nikunja, Dhaka</p>

            <div className="flex justify-between items-center mt-2">

              <span className="font-semibold">
                ৳ 12,500/month
              </span>

              <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                View Details
              </button>

            </div>

          </div>

        </div>

        {/* Card 3 */}
        <div className="bg-white border rounded shadow">

          <img
            src="https://via.placeholder.com/250"
            alt="House"
            className="w-full h-40 object-cover rounded-t"
          />

          <div className="p-3">

            <h2 className="font-bold">
              Flat and Apartment
            </h2>

            <p>📍 Gulshan, Dhaka</p>

            <div className="flex justify-between items-center mt-2">

              <span className="font-semibold">
                ৳ 75,000/month
              </span>

              <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                View Details
              </button>

            </div>

          </div>

        </div>

        {/* Card 4 */}
        <div className="bg-white border rounded shadow">

          <img
            src="https://via.placeholder.com/250"
            alt="House"
            className="w-full h-40 object-cover rounded-t"
          />

          <div className="p-3">

            <h2 className="font-bold">
              Hotels
            </h2>

            <p>📍 Mirpur, Dhaka</p>

            <div className="flex justify-between items-center mt-2">

              <span className="font-semibold">
                ৳ 10,000/month
              </span>

              <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                View Details
              </button>

            </div>

          </div>

        </div>

        {/* Card 5 */}
        <div className="bg-white border rounded shadow">

          <img
            src="https://via.placeholder.com/250"
            alt="House"
            className="w-full h-40 object-cover rounded-t"
          />

          <div className="p-3">

            <h2 className="font-bold">
              Shops
            </h2>

            <p>📍 Badda, Dhaka</p>

            <div className="flex justify-between items-center mt-2">

              <span className="font-semibold">
                ৳ 7,000/month
              </span>

              <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                View Details
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Browse Button */}
      <div className="flex justify-center mt-8">

        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
          Browse All Properties
        </button>

      </div>

    </div>
  );
};

export default Product;