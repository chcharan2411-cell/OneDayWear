import axios from "axios";

const ORDER_URL = "http://localhost:8080/orders";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ===============================
// GET ALL ORDERS
// ===============================
export const getAdminOrders = async () => {
  const response = await axios.get(
    ORDER_URL,
    getAuthConfig()
  );

  return response.data;
};

// ===============================
// GET ORDER BY ID
// ===============================
export const getAdminOrderById = async (id) => {
  const response = await axios.get(
    `${ORDER_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ===============================
// UPDATE ORDER STATUS
// ===============================
export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(
    `${ORDER_URL}/${id}/status`,
    null,
    {
      ...getAuthConfig(),
      params: {
        status,
      },
    }
  );

  return response.data;
};

// ===============================
// DELETE ORDER
// ===============================
export const deleteOrder = async (id) => {
  const response = await axios.delete(
    `${ORDER_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ===============================
// GET ORDER COUNT
// ===============================
export const getOrderCount = async () => {
  const response = await axios.get(
    `${ORDER_URL}/count`,
    getAuthConfig()
  );

  return response.data;
};

// ===============================
// GET TOTAL REVENUE
// ===============================
export const getTotalRevenue = async () => {
  const response = await axios.get(
    `${ORDER_URL}/revenue`,
    getAuthConfig()
  );

  return response.data;
};