const Dashboard = () => {

  // 🔹 Protita house alada data (image + text)

  const houses = [
    {
      title: "Modern Family House",
      location: "Uttara, Dhaka",
      price: "25,500/month",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    },
    {
      title: "Bachelor Room",
      location: "Nikunja, Dhaka",
      price: "12,000/month",
      image:
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    },
    {
      title: "Flat and Apartment",
      location: "Gulshan, Dhaka",
      price: "75,000/month",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      title: "Hotels",
      location: "Mirpur, Dhaka",
      price: "10,000/month",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    },
    {
      title: "Shops",
      location: "Badda, Dhaka",
      price: "7,000/month",
      image:
        "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    },
  ];

  return (
    <div>

      {/* Header */}
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome back! Here's your overview
      </p>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">

        <div className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Saved Houses</p>
            <h2 className="text-2xl font-bold">8</h2>
          </div>

          <div className="bg-blue-100 p-3 rounded-lg text-blue-600 text-xl">
            ❤️
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Active Requests</p>
            <h2 className="text-2xl font-bold">3</h2>
          </div>

          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 text-xl">
            📄
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Properties Viewed</p>
            <h2 className="text-2xl font-bold">24</h2>
          </div>

          <div className="bg-green-100 p-3 rounded-lg text-green-600 text-xl">
            📈
          </div>
        </div>

      </div>

      {/* Recommended Section */}
      <h2 className="text-2xl font-bold mt-10">
        Recommended For You
      </h2>

      <div className="grid grid-cols-5 gap-4 mt-4">

        {houses.map((house, index) => (

          <div
            key={index}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition"
          >

            {/* Image */}
            <img
              src={house.image}
              alt="house"
              className="w-full h-40 object-cover rounded-t"
            />

            <div className="p-3">

              <h3 className="font-semibold">
                {house.title}
              </h3>

              <p className="text-sm">
                📍 {house.location}
              </p>

              <div className="flex justify-between items-center mt-2">

                <span className="text-sm">
                  ৳ {house.price}
                </span>

                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  View
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">

        <h2 className="text-xl font-semibold mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">

          <p>
            ❤️ You saved "Modern Family House"
          </p>

          <p>
            📄 Your rental request is pending
          </p>

          <p>
            📈 You viewed 5 new properties
          </p>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;