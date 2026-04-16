import { Link } from "react-router-dom";
import Footer from "../../components/Home/Footer";
import Navbar from "../../components/Home/Navbar";

const EarnMoney = () => {
  return (
    <div className="bg-[#f9fafb] min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8 xl:max-w-6xl w-full">
        {/* Breadcrumb */}
        <div className="text-sm text-blue-600 mb-6 flex items-center gap-2">
          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <span className="text-gray-400 text-xs">&gt;</span>
          <span className="text-gray-500">Earn Money</span>
        </div>

        {/* Page Title */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-[#1f2937]">Earn Money</h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Refer & Earn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-[#1f2937] mb-8">
              Refer & Earn
            </h2>

            <div className="space-y-6 flex-grow">
              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  রেফার করে আয় করুন ৫০ টাকা
                </h3>
                <p className="text-[#6b7280] text-sm">
                  আপনার রেফারেলের দ্বারা প্রদত্ত হলে প্রতি আবাসিক ভাড়ার বিপরীতে
                  পাবেন সরাসরি ৫০ টাকা।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  সহজ ও দ্রুততম
                </h3>
                <p className="text-[#6b7280] text-sm">
                  যেকোনো তথ্য বিশাল দিয়ে, সহজেই ৫০ টাকা পেয়েছেন।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  আনলিমিটেড রেফারাল
                </h3>
                <p className="text-[#6b7280] text-sm">
                  যত বেশি রেফারেল তৈরি করবেন, তত বেশি পাবেন।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  সহজ উত্তোলন
                </h3>
                <p className="text-[#6b7280] text-sm">
                  লাইটে পেতে মাত্র কয়েক মিনিট কভার হবে, সর্বোচ্চ এক ঘন্টা।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  টাকা তুলা একদম সহজ
                </h3>
                <p className="text-[#6b7280] text-sm">
                  মোবাইল ব্যাংকিং এর মাধ্যমে সহজেই টাকা তুলতে পারবেন।
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-[#374151] font-medium hover:bg-gray-50 transition">
                Learn More
              </button>
              <button className="px-6 py-2.5 bg-[#1d4ed8] rounded-lg text-white font-medium hover:bg-blue-700 transition shadow-sm">
                Earn Now
              </button>
            </div>
          </div>

          {/* Card 2: Property Finding */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-[#1f2937] mb-8">
              Property Finding
            </h2>

            <div className="space-y-6 flex-grow">
              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  সহজ কাজ
                </h3>
                <p className="text-[#6b7280] text-sm">
                  বাসা খুঁজে বেড়ান না বাসাগুলোর তথ্য যোগ করুন।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  সেফকাল আবার সুবিধা
                </h3>
                <p className="text-[#6b7280] text-sm">
                  আপনার নিজগৃহে বাসা খুঁজে পিছেও ইনকাম।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  নিশ্চিত পেমেন্ট
                </h3>
                <p className="text-[#6b7280] text-sm">
                  কাজে ঘাতে হবে ব্যালেন্সে টাকা খোঁজা।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  ট্রেইনিং সুবিধা
                </h3>
                <p className="text-[#6b7280] text-sm">
                  কাজে সুদক্ষ হতে, শুরু কলে সুবিধে পাবেন।
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#374151] mb-1">
                  User Friendly
                </h3>
                <p className="text-[#6b7280] text-sm">
                  গুরুবজনই বা আপনার মাধ্যমে সহজে সবিশেষ।
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-[#374151] font-medium hover:bg-gray-50 transition">
                Learn More
              </button>
              <button className="px-6 py-2.5 bg-[#1d4ed8] rounded-lg text-white font-medium hover:bg-blue-700 transition shadow-sm">
                Earn Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details Note: The original generic footer from user layout is added */}
      <Footer />
    </div>
  );
};

export default EarnMoney;
