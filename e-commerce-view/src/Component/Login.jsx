import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { login } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Divider } from "primereact/divider";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { Toast } from "primereact/toast";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

const isJwtToken = (value) => {
  if (typeof value !== "string") return false;
  const parts = value.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const processToken = (data) => {
      // ✅ token extract (safe)
      const token = data.token || data;

      if (!token || !isJwtToken(token)) {
        const backendMessage =
          typeof data === "string"
            ? data
            : data?.message || "Login failed. Please try again";
        toast.current?.show({ severity: 'error', summary: 'Error', detail: backendMessage, life: 3000 });
        return;
      }

      localStorage.setItem("token", token);

      // ✅ decode safely
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        localStorage.removeItem("token");
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid token', life: 3000 });
        return;
      }

      console.log("DECODED TOKEN:", decoded);

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Login Successful', life: 3000 });

      // ✅ role based redirect
      setTimeout(() => {
        if (decoded.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 1200);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("https://e-commerce-springboot-react-8i4i.onrender.com/api/auth/google", {
        token: credentialResponse.credential
      });
      
      const data = response.data;
      if (!data || data === "Invalid Google Token" || typeof data === 'string' && data.startsWith("Error")) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google login failed', life: 3000 });
          return;
      }
      if (data === "Your account is not approved by admin") {
          toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Your account is not approved by admin', life: 3000 });
          return;
      }
      processToken(data);
    } catch (err) {
      console.log(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google login failed', life: 3000 });
    }
  };

  const handleGoogleError = () => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google Login was unsuccessful', life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(loginData);

      console.log("LOGIN RESPONSE:", response.data);

      const data = response.data;

      // ❌ no response
      if (!data) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Login failed', life: 3000 });
        return;
      }

      // ❌ user not found
      if (
        data === "No Record Found" ||
        data.message === "No Record Found" ||
        data.message === "User not found" ||
        data === "User not found"
      ) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'User not found. Please register first', life: 3000 });
        setTimeout(() => navigate("/register"), 2000);
        return;
      }

      // ❌ account not approved
      if (data === "Your account is not approved by admin" || data.message === "Your account is not approved by admin") {
        toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Your account is not approved by admin', life: 3000 });
        return;
      }

      // ❌ invalid credentials
      if (data === "Invalid credentials" || data.message === "Invalid credentials") {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid Password or Email', life: 3000 });
        return;
      }

      processToken(data);

    } catch (err) {
      console.log(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Login Failed (Server Error)', life: 3000 });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 justify-center items-center p-4">
      <Toast ref={toast} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="w-1/2 bg-blue-600 text-white p-10 flex flex-col justify-center hidden md:flex">
          <h1 className="text-4xl font-bold mb-4">
            Simplify management with our dashboard
          </h1>

          <p className="mb-8 text-lg opacity-90">
            Manage your e-commerce operations effortlessly.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/coffee-shop-staff-5520513-4608771.png"
            alt="img"
            className="w-full"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col bg-white/70 backdrop-blur-xl">
          <div className="text-center mb-8">
            <span className="text-3xl font-bold text-blue-600">Login</span>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Welcome Back 👋</h2>
          <p className="text-gray-600 mb-8">Please login to continue</p>

          {/* Inputs */}
          <div className="grid gap-8">
            <FloatLabel>
              <InputText
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full"
              />
              <label>Email</label>
            </FloatLabel>

            <FloatLabel>
              <InputText
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                className="w-full"
              />
              <label>Password</label>
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
            className="w-full bg-blue-600 hover:bg-blue-700 border-none"
          />

          <Divider align="center" className="my-6">
            Or Login with
          </Divider>

          <div className="flex gap-4 justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="pill"
            />
          </div>

          <p className="mt-6 text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
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