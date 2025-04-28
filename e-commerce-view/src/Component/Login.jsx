import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../assets/login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData);
      if (response.data === "No Record Found") {
        toast.error(response.data + " Register First");
        setTimeout(() => {
          navigate("/ecommerce/register");
        }, 2500);
        return;
      } else if (response.data === "Invalid credentials") {
        toast.error(response.data);
        setTimeout(() => {
          navigate("/ecommerce/login");
        }, 2500);
        return;
      }
      toast.success("Login Successfully");
      setTimeout(() => {
        localStorage.setItem("token", response.data);
        navigate("/ecommerce/profile");
      }, 2500);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-900 text-white outter-login-main"
      style={{ height: "91.2vh" }}
    >
      <ToastContainer />
      <div className="w-96 p-8 space-y-10 mt-10 mb-15 bg-gray-800 shadow-lg rounded-xl login-main">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Enter your email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <input
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="hover:cursor-pointer w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm">
          Don&apos;t have an account?
          <a
            onClick={() => navigate("/ecommerce/register")}
            className="hover:cursor-pointer text-blue-400 hover:underline ml-1"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
