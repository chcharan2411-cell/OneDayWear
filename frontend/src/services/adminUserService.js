import axios from "axios";

const API_URL = "http://localhost:9093/admin/users";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getAdminUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });

  return response.data;
};