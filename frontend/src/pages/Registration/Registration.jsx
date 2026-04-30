// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "../../features/auth/authSlice";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Register = () => {
  // const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleDemoRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const role = formData.get("role");

    if (!/^01[0-9]{9}$/.test(phone)) {
      alert(
        "Please enter a valid 11-digit Bangladeshi phone number starting with 01.",
      );
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Please enter a valid email format.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const registeredDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Save registered user details in local storage to use in login
    localStorage.setItem(
      "demoRegisteredUser",
      JSON.stringify({
        fullName,
        email,
        phone,
        password,
        role,
        date: registeredDate,
        avatar: "",
      }),
    );

    const memberRecord = {
      id: `#${Date.now()}`,
      fullName,
      name: fullName,
      email,
      phone,
      password,
      username: `@${String(fullName).trim().toLowerCase().replace(/\s+/g, "")}`,
      author: "Yes",
      accountStatus: "Active",
      kycStatus: "Unverified",
      emailStatus: "Unverified",
      date: registeredDate,
      avatar: "",
      role,
    };

    if (role === "owner") {
      const owners = JSON.parse(
        localStorage.getItem("registeredOwners") || "[]",
      );
      owners.unshift(memberRecord);
      localStorage.setItem("registeredOwners", JSON.stringify(owners));
    } else {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      users.unshift(memberRecord);
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    alert("Registration successful! Please login.");
    navigate("/login", { state: { from: location.state?.from } });
  };

  // const onSubmit = async (data) => {
  //   const toastId = toast.loading("Creating account...");

  //   try {
  //     const response = await registerUser(data).unwrap();

  //     if (response.data?.token && response.data?.user) {
  //       toast.success("Registration successful!", { id: toastId });
  //       navigate("/login");
  //     } else {
  //       toast.error("Invalid response from server.", { id: toastId });
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err?.data?.message === "Validation failed"
  //         ? "User email/phone already exists!"
  //         : "Registration failed. Please try again.";
  //     toast.error(errorMessage, { id: toastId });
  //   }
  // };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Card */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-black">
            Create Account
          </h2>
          {/* Subtitle */}
          <div className="mt-2 text-center flex flex-col items-center">
            <span className="text-sm text-gray-600">Join</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-black text-white p-1 rounded-lg text-xs">
                🏠
              </div>
              <span className="font-bold text-black text-xl">BashaLagbe</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium mt-0.5">
              Find your perfect flat easily
            </span>
            <span className="text-sm text-gray-600 mt-2">
              to find your perfect home
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleDemoRegister}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Enter your full name"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address (e.g. user@example.com)"
                placeholder="Enter your email"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                maxLength="11"
                pattern="01[0-9]{9}"
                title="Please enter a valid 11-digit Bangladeshi phone number starting with 01"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                placeholder="01XXXXXXXXX"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter your password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center justify-around px-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="tenant"
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">Tenant</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Property Owner
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Register
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from: location.state?.from }}
              className="font-medium text-black hover:text-gray-800"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
