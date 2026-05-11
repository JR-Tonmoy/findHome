import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import { useRegisterMutation } from "../../features/auth/authSlice";
import { normalizeMemberRecord } from "../../utils/memberStorage";

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleDemoRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    const toastId = toast.loading("Creating account...");
    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const role = formData.get("role");

    if (!/^01[0-9]{9}$/.test(phone)) {
      const message =
        "Please enter a valid 11-digit Bangladeshi phone number starting with 01.";
      setFormError(message);
      toast.error(message, { id: toastId });
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      const message = "Please enter a valid email format.";
      setFormError(message);
      toast.error(message, { id: toastId });
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match!";
      setFormError(message);
      toast.error(message, { id: toastId });
      return;
    }

    const payload = {
      name: fullName,
      email,
      phone,
      role,
      password,
      password_confirmation: confirmPassword,
    };

    const registeredDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    try {
      const response = await registerUser(payload).unwrap();
      const apiUser = response?.data?.user || {};

      const normalizedUser = {
        ...apiUser,
        fullName: apiUser.name || fullName,
        name: apiUser.name || fullName,
        email: apiUser.email || email,
        phone: apiUser.phone || phone,
        role: apiUser.role || role,
        date: registeredDate,
        avatar: apiUser.avatar || "",
      };

      // Keep the existing localStorage-backed registration cache (no auto-login)
      localStorage.setItem(
        "demoRegisteredUser",
        JSON.stringify(normalizedUser),
      );

      const memberRecord = normalizeMemberRecord({
        id: apiUser.id || `#${Date.now()}`,
        fullName: normalizedUser.fullName,
        name: normalizedUser.name,
        email: normalizedUser.email,
        phone: normalizedUser.phone,
        password,
        username: `@${String(fullName).trim().toLowerCase().replace(/\s+/g, "")}`,
        author: "Yes",
        accountStatus: "Active",
        kycStatus: "Unverified",
        emailStatus: "Unverified",
        date: registeredDate,
        avatar: normalizedUser.avatar,
        role: normalizedUser.role,
      });

      if (role === "owner") {
        const owners = JSON.parse(
          localStorage.getItem("registeredOwners") || "[]",
        );
        owners.unshift(memberRecord);
        localStorage.setItem("registeredOwners", JSON.stringify(owners));
      } else {
        const users = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]",
        );
        users.unshift(memberRecord);
        localStorage.setItem("registeredUsers", JSON.stringify(users));
      }

      // After registration, send user to the login page so they can sign in.
      toast.success("Registration successful! Please sign in.", {
        id: toastId,
      });
      navigate("/login", { state: { from: location.state?.from } });
    } catch (error) {
      const validationErrors = error?.data?.errors
        ? Object.values(error.data.errors).flat().filter(Boolean)
        : [];
      const errorMessage =
        validationErrors[0] ||
        error?.data?.message ||
        "Registration failed. Please try again.";
      setFormError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }
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
          <div className="mt-4 text-center flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">Join</span>
            <Logo
              variant="default"
              size="md"
              showSubtitle={true}
              linkTo="/home"
            />
            <span className="text-sm text-gray-600 mt-3">
              to find your perfect home
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleDemoRegister}>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

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
                  minLength="8"
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
                  minLength="8"
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
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {isLoading ? "Registering..." : "Register"}
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
