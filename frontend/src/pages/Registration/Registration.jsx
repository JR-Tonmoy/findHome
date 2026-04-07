// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "../../features/auth/authSlice";

import { Link } from "react-router-dom";

const Register = () => {
  // const [registerUser, { isLoading }] = useRegisterMutation();
  // const navigate = useNavigate();

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
    <div className="flex justify-center items-center h-screen w-full">
      <div className="bg-white p-7.5 w-md rounded-lg">
        <h1>CREATE ACCOUNT</h1>

        <form>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your Full Name" required />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Phone Number</label>
          <input type="text" placeholder="Enter your Phone Number" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your Password" required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Enter your Password" required />

          <button type="submit" class="btn">
            Registration
          </button>

          <div class="remember">
            <input type="checkbox" />
            Remember me
          </div>

          <p class="bottom-text">
            Have an account?
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
