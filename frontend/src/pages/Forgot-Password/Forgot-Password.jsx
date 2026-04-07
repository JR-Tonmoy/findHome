import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100">

      <div className="bg-white shadow-2xl border border-gray-100 w-100 p-8 rounded-lg space-y-6">

        <h1 className="text-3xl font-bold uppercase text-center">
          Forgot Password
        </h1>

        <form>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
              className="bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-green-200 py-2 w-full rounded-lg text-lg font-medium hover:bg-green-300"
          >
            Send Reset Code
          </button>

          {/* Back to Login */}
          <p className="text-center">
            Back to{" "}
            <Link
              to="/login"
              className="text-violet-700 font-medium hover:font-semibold"
            >
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;