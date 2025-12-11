import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { login } from "../Services/authService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Divider } from "primereact/divider";
import { motion } from "framer-motion";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

function Login() {
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
        setTimeout(() => navigate("/register"), 2000);
        return;
      }

      if (response.data === "Invalid credentials") {
        toast.error(response.data);
        return;
      }

      toast.success("Login Successfully");
      setTimeout(() => {
        localStorage.setItem("token", response.data);
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 justify-center items-center p-4">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="w-1/2 bg-blue-600 text-white p-10 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4 leading-tight"
          >
            Simplify management with our dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-lg opacity-90"
          >
            Manage your e-commerce operations effortlessly with our admin panel.
          </motion.p>

          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            src="https://cdni.iconscout.com/illustration/premium/thumb/coffee-shop-staff-5520513-4608771.png"
            alt="Characters"
            className="w-full h-auto drop-shadow-lg"
          />
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-10 flex flex-col bg-white/70 backdrop-blur-xl">
          <div className="text-center mb-8">
            <span className="text-3xl font-bold text-blue-600">Login</span>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Welcome Back 👋</h2>
          <p className="text-gray-600 mb-8">Please login to continue</p>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-8 px-2 md:px-8">
            <FloatLabel className="w-full">
              <InputText
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full p-inputtext-sm"
              />
              <label htmlFor="email">Email</label>
            </FloatLabel>

            <FloatLabel className="w-full">
              <InputText
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full"
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          </div>

          {/* Forgot Password */}
          <div
            className="text-right text-sm text-blue-600 mb-4 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>

          {/* Login Button */}
          <Button
            label="Login"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 border-none shadow-md py-3 rounded-xl"
          />

          <Divider align="center" className="my-6">
            Or Login with
          </Divider>

          {/* Social Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              icon="pi pi-google"
              label="Google"
              className="w-1/2 border-gray-300 text-black rounded-xl"
              outlined
            />
            <Button
              icon="pi pi-facebook"
              label="Facebook"
              className="w-1/2 border-gray-300 text-black rounded-xl"
              outlined
            />
          </div>

          {/* Signup Link */}
          <p className="mt-6 text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
