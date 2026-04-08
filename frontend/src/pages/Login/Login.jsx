// import { toast } from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginSuccess, useLoginMutation } from "../../features/auth/authSlice";

import { Link } from "react-router-dom";

const Login = () => {
  // const [login, { isLoading }] = useLoginMutation();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const onSubmit = async (data) => {
  //   const toastId = toast.loading("Logging in...");
  //   try {
  //     const response = await login(data).unwrap();

  //     if (response.data?.token && response.data?.user) {
  //       toast.success("Login successful!", { id: toastId });
  //       dispatch(
  //         loginSuccess({
  //           user: response.data?.user,
  //           token: response.data?.token,
  //         })
  //       );
  //       navigate("/dashboard");
  //     } else {
  //       toast.error("Invalid response from server.", { id: toastId });
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err?.data?.message || "Login failed. Please try again.";
  //     toast.error(errorMessage, { id: toastId });
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-bold text-indigo-600">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login to your BashaLagbe account
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
