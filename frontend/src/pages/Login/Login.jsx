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
    <div className="flex justify-center items-center h-screen w-full">
     {/* <div className="container">  */}
      <div className="bg-white p-7.5 w-md rounded-lg">
        <h1>LOGIN</h1>

        <form>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your Password" required />

          <button type="submit" className="btn">
            Login
          </button>

          <div className="options">
            <div>
              <input type="checkbox" />
              Remember me
            </div>


            {/* <a href="forgot-password.html">Forgot Password?</a> */}
            <Link to="/forgot-password">
            Forgot Password
            </Link>
          </div>

          <p className="bottom-text">
            Don't have an account?
            {/* <a href="register.jsx">Sign Up</a> */}
            {/* <Link to="/register">Sign Up </Link> */}
            <Link to="/register">
            sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
