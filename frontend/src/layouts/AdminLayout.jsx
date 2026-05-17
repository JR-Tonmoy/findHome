import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Admin/Sidebar/Sidebar";

const AdminLayout = () => {
  // মোবাইল মেনু ওপেন বা ক্লোজ করার জন্য State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen relative font-sans">
      {/* 
        মোবাইল স্ক্রিনে মেনু ওপেন করার বাটন (md:hidden মানে ডেস্কটপে লুকানো থাকবে) 
      */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow text-gray-700 hover:bg-gray-100"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* 
        বাম পাশের অ্যাডমিন সাইডবার (State গুলো props হিসেবে Sidebar ফাইলে পাঠানো হচ্ছে)
      */}
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* 
        ডান পাশের কন্টেন্ট এরিয়া 
        ml-64 মানে মার্জিন লেফট, যা সাইডবারের জায়গা ছেড়ে দিবে (শুধু ডেস্কটপে md:ml-64)।
        Outlet এর কারণে এখানে রাউট অনুযায়ী অন্য পেজ লোড হবে।
      */}
      <div className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 pt-16 md:pt-6 w-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
