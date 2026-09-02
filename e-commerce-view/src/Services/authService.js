import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8081/api/auth";


// ✅ LOGIN
export const login = async (loginData) => {
  return await axios.post(`${API_URL}/login`, loginData);
};


// ✅ REGISTER (Multipart)
export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ✅ GET CURRENT USER FROM TOKEN
export const getCurrentUser = () => {

  const token = localStorage.getItem("token");

  if (!token) return null;

  try {

    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      return null;
    }

    return decodedToken;

  } catch {
    return null;
  }

};


// ✅ LOGOUT
export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("role");

};


// ✅ GET ALL USERS
export const getAllUsers = async () => {

  return await axios.get(`${API_URL}/admin/users`);

};



// ✅ AUTH SERVICE CLASS
class authService {


  // ✅ UPDATE PROFILE WITH IMAGE
  Updateprofile(id, user) {

    const formData = new FormData();

    formData.append("firstname", user.firstname);
    formData.append("lastname", user.lastname);
    formData.append("email", user.email);
    formData.append("mobile", user.mobile);
    formData.append("gender", user.gender);
    formData.append("addressLine1", user.addressLine1);
    formData.append("addressLine2", user.addressLine2);
    formData.append("city", user.city);
    formData.append("state", user.state);
    formData.append("pincode", user.pincode);

    // image append
    if (user.image) {
      formData.append("image", user.image);
    }

    return axios.put(`${API_URL}/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }


  // ✅ READ PROFILE
  ReadProfileByEmail(email) {

    return axios.get(`${API_URL}/profile/${email}`);

  }

}


export default new authService();