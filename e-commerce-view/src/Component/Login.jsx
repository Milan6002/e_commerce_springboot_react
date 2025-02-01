import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { ToastContainer, toast } from "react-toastify";

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
          navigate("/register");
        }, 2500);
        return;
      } else if (response.data === "Invalid credentials") {
        toast.error(response.data);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
        return;
      }
      toast.success("Login Successfully");
      setTimeout(() => {
        localStorage.setItem("token", response.data);
        navigate("/profile");
      }, 2500);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-900 text-white"
      style={{ height: "91.2vh" }}
    >
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-10 bg-gray-800 shadow-lg rounded-xl">
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
          <a href="/register" className="text-blue-400 hover:underline ml-1">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
