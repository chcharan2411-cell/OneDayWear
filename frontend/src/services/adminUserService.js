import axios from "axios";
import { API_BASE_URL } from "./api";

const API_URL = `${API_BASE_URL}/admin/users`;

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