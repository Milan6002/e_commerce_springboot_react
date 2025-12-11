import { useState } from "react";
import { register } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // IMAGE UPLOAD PREVIEW
  const handleFileChanges = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }
    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await register(userData);

      if (response.data === "User already exists") {
        toast.error(response.data);
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.data === "User registered successfully") {
        toast.success("🎉 Account created successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/30"
      >
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Create Account
        </h1>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4 font-medium"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 mt-1 bg-white/50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Email Address</label>
            <input
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 mt-1 bg-white/50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-semibold text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 mt-1 bg-white/50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Profile Image
            </label>

            {previewImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                src={previewImage}
                className="w-24 h-24 rounded-full mb-3 border-4 border-white/60 shadow-md object-cover"
                alt="preview"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChanges}
              className="w-full p-2 bg-white/40 border border-gray-300 rounded-xl cursor-pointer"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-lg transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* LOGIN REDIRECT */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
