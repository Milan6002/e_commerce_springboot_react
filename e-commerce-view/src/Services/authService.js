import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://192.168.1.16:8080/api/auth";

export const login = async (loginData) => {
  return await axios.post(API_URL + "/login", loginData);
};

export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("avtar");
      localStorage.removeItem("role");
      return null;
    }
    return decodedToken;
  } catch (error) {
    return error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

class authService {
  ReadProfileById(id) {
    return axios.get(API_URL + "/read/" + id);
  }

  Updateprofile(id, updatedProfileModel) {
    return axios.put(API_URL + "/update/" + id, updatedProfileModel, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  ReadProfileByEmail(email) {
    return axios.get(API_URL + "/profile/" + email);
  }
}

export default new authService();
