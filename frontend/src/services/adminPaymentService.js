import axios from "axios";

const PAYMENT_URL = "http://localhost:8080/payments";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get payment count
export const getPaymentCount = async () => {
  const response = await axios.get(
    `${PAYMENT_URL}/count`,
    getAuthConfig()
  );

  return response.data;
};

// Get payment by payment ID
export const getPaymentById = async (id) => {
  const response = await axios.get(
    `${PAYMENT_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId) => {
  const response = await axios.get(
    `${PAYMENT_URL}/order/${orderId}`,
    getAuthConfig()
  );

  return response.data;
};

// Refund payment
export const refundPayment = async (paymentId) => {
  const response = await axios.put(
    `${PAYMENT_URL}/${paymentId}/refund`,
    {},
    getAuthConfig()
  );

  return response.data;
};