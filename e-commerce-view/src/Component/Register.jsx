import { useState } from "react";
import { register } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import '../assets/register.css';

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    img: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleFileChanges = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUserData({ ...userData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }
    

    // Simple password validation (length)
    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await register(userData);
      if (response.data === "User already exists") {
        toast.error(response.data);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else if (response.data === "User registered successfully") {
        toast.success("🎉 " + response.data);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (err) {
      setError("Error creating account. Please try again." + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className=" register-main flex items-center justify-center p-3"
     
    >
      <ToastContainer />
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96 inner-register-main">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Email:</label>
            <input
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="mb-1 font-semibold">Profile Image:</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-4 border-gray-500 mb-3 shadow-lg"
              />
            )}
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFileChanges}
              className="p-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register
