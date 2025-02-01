import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../services/authService";

function UpdateProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState({
    id: id,
    name: "",
    email: "",
    img: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.ReadProfileById(id);
        setUser(response.data);
        if (response.data.img) {
          setPreviewImage(`data:image/jpeg;base64,${response.data.img}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data.");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUser({ ...user, image: file }); // Store Base64 image without prefix
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.Updateprofile(id, user);
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gradient-to-r from-gray-900 to-gray-700" style={{height:"91.2vh"}}>
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6">Update Profile</h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              onChange={handleFileChange}
              className="p-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
