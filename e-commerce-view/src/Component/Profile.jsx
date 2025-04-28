import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import '../assets/profile.css';
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    img: null,
  });

  const decodeToken = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    authService.ReadProfileByEmail(decodeToken.sub)
      .then((response) => {
        localStorage.setItem("role", response.data.role);
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          img: response.data.img,
        });
        localStorage.setItem("avtar", response.data.img);

        // Dispatch event to update Navbar avatar
        const event = new CustomEvent("avatarUpdated", {
          detail: response.data.img,
        });
        window.dispatchEvent(event);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  },[decodeToken.sub  ]);

  return (
    <div
      className="profile-main flex justify-center items-center bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden"
      style={{ height: "91.2vh" }}
    >
      <div className="bg-gray-800 rounded-2xl w-96 p-6 text-white text-center inner-proflle-main">
        <div className="flex justify-end">
          <a
            onClick={() => navigate(`/ecommerce/updateprofile/${user.id}`)}
            className="hover:cursor-pointer text-blue-400 hover:text-blue-300 transition-all duration-300 text-sm"
          >
            📝 Edit Profile
          </a>
        </div>
        <div className="flex flex-col items-center mt-4">
          <img
            src={`data:image/jpeg;base64,${user.img}`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-gray-500 hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl font-bold mt-3">
            {user.name || "Loading..."}
          </h1>
        </div>

        <div className="mt-6 space-y-3 text-left">
          <div className="border-b border-gray-600 pb-2">
            <span className="font-semibold">Name:</span> {user.name || ""}
          </div>
          <div className="border-b border-gray-600 pb-2">
            <span className="font-semibold">Email:</span> {user.email || ""}
          </div>
          <div>
            <span className="font-semibold">Password:</span>{" "}
            <span className="text-gray-400">••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
