import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSuccess, useLoginMutation } from "../../features/auth/authSlice";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  // ১। রাউটিং করার জন্য useNavigate হুকটি নিচ্ছি (Using useNavigate for redirection)
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // ৩। ফর্ম সাবমিট করার ফাংশন
  const handleDemoLogin = async (e) => {
    e.preventDefault(); // পেজ রিলোড বন্ধ করার জন্য
    setFormError("");
    const toastId = toast.loading("Signing in...");

    const formData = new FormData(e.target);
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = formData.get("password");

    try {
      const response = await login({ email, password }).unwrap();
      const apiUser = response?.data?.user;
      const apiToken = response?.data?.token;

      if (!apiUser || !apiToken) {
        const message = "Invalid login response from server.";
        setFormError(message);
        toast.error(message, { id: toastId });
        return;
      }

      const currentUser = {
        ...apiUser,
        fullName: apiUser.name || apiUser.fullName,
        role: apiUser.role || "tenant",
      };

      dispatch(loginSuccess({ user: currentUser, token: apiToken }));

      // Redirect to appropriate dashboard based on role
      let redirectPath = location.state?.from?.pathname || "/home";
      if (currentUser.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (currentUser.role === "owner") {
        redirectPath = "/owner-dashboard";
      } else {
        redirectPath = "/dashboard";
      }

      toast.success("Login successful!", { id: toastId });
      navigate(redirectPath);
    } catch (error) {
      const message =
        error?.data?.message || "Login failed. Please check credentials.";
      setFormError(message);
      toast.error(message, { id: toastId });
    }
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
            <span className="font-bold text-black text-xl">BashaLagbe</span>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">
              Find your perfect flat easily
            </span>
            <span className="text-sm text-gray-600 mt-2">account</span>
          </div>
        </div>

        {/* ফর্ম এ onSubmit ইভেন্ট যুক্ত করা হলো */}
        <form className="mt-8 space-y-6" onSubmit={handleDemoLogin}>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

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
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {isLoading ? "Signing in..." : "Sign In"}
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
