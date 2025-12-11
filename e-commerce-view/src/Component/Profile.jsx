import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import authService from "../Services/authService";
import { motion } from "framer-motion";
import '../assets/profile.css';

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    img: null,
  });

  // Safely decode token
  const token = localStorage.getItem("token");
  let decoded = null;
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    if (!decoded?.sub) return;

    authService.ReadProfileByEmail(decoded.sub)
      .then((response) => {
        const data = response.data;

        localStorage.setItem("role", data.role);
        localStorage.setItem("avtar", data.img);

        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          img: data.img,
        });

        // Notify navbar avatar
        window.dispatchEvent(
          new CustomEvent("avatarUpdated", { detail: data.img })
        );
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [decoded?.sub]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center p-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-2xl p-8 text-white"
      >

        {/* EDIT BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/updateprofile/${user.id}`)}
            className="px-4 py-1.5 text-sm rounded-lg bg-blue-600/80 hover:bg-blue-500 transition shadow-md"
          >
            ✏ Edit Profile
          </button>
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center mt-3">
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            src={`data:image/jpeg;base64,${user.img}`}
            alt="User Avatar"
            className="w-28 h-28 rounded-full shadow-xl border-4 border-white/30 object-cover hover:scale-105 transition"
          />

          <h1 className="text-3xl font-bold mt-4 tracking-wide">
            {user.name || "Loading..."}
          </h1>
        </div>

        {/* DETAILS */}
        <div className="mt-8 space-y-4 text-white/90">
          <div className="flex justify-between border-b border-white/20 pb-2">
            <span className="text-gray-300">Name</span>
            <span className="font-semibold">{user.name}</span>
          </div>

          <div className="flex justify-between border-b border-white/20 pb-2">
            <span className="text-gray-300">Email</span>
            <span className="font-semibold">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Password</span>
            <span className="text-gray-400">••••••••</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
