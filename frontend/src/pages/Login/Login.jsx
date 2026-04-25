// import { toast } from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginSuccess, useLoginMutation } from "../../features/auth/authSlice";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  // const [login, { isLoading }] = useLoginMutation();
  // const dispatch = useDispatch();

  // ১। রাউটিং করার জন্য useNavigate হুকটি নিচ্ছি (Using useNavigate for redirection)
  const navigate = useNavigate();
  const location = useLocation();

  // ২। একটি ডেমো স্টেট নিচ্ছি রোল সিলেক্ট করার জন্য যেহেতু এখন API যুক্ত নেই (For demo purpose, using a state to hold selected role)
  const [role, setRole] = useState("tenant");
  const [showPassword, setShowPassword] = useState(false);

  // ৩। ফর্ম সাবমিট করার ফাংশন
  const handleDemoLogin = (e) => {
    e.preventDefault(); // পেজ রিলোড বন্ধ করার জন্য

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const demoUserStr = localStorage.getItem("demoRegisteredUser");
    if (!demoUserStr) {
      alert("No registered user found. Please register first!");
      navigate("/register", { state: { from: location.state?.from } });
      return;
    }

    const demoUser = JSON.parse(demoUserStr);

    if (demoUser.email !== email) {
      alert("This email is WRONG. Please correct it.");
      return;
    }
    if (demoUser.password !== password) {
      alert("This password is WRONG. Please correct it.");
      return;
    }
    if (demoUser.role !== role) {
      alert(
        `This role is WRONG. You registered as ${demoUser.role === "owner" ? "Property Owner" : "Tenant"}. Please correct it.`,
      );
      return;
    }

    // Set demo authenticated state for Home page to check
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);

    const redirectPath = location.state?.from || "/home";
    navigate(redirectPath);
  };

  // const onSubmit = async (data) => {
  // ... (Commented API logic)
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-bold text-black">
            Welcome Back!
          </h2>
          <div className="mt-2 text-center flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">Login to your</span>
            <div className="flex items-center gap-2">
              <div className="bg-black text-white p-1 rounded-lg text-xs">
                🏠
              </div>
              <span className="font-bold text-black text-xl">BashaLagbe</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">
              Find your perfect flat easily
            </span>
            <span className="text-sm text-gray-600 mt-2">account</span>
          </div>
        </div>

        {/* ফর্ম এ onSubmit ইভেন্ট যুক্ত করা হলো */}
        <form className="mt-8 space-y-6" onSubmit={handleDemoLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ডেমো লগিন এর জন্য রোল সিলেক্ট করার অপশন নিচে দেওয়া হলো 
                (যাতে আপনি সহজেই টেস্ট করে দেখতে পারেন) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login As (Role Selection Demo)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="tenant">Tenant (ভাড়াটিয়া)</option>
                <option value="owner">Property Owner (বাড়ির মালিক)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-black hover:text-gray-800"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={{ from: location.state?.from }}
            className="font-medium text-black hover:text-gray-800"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
