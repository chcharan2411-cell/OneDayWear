import axios from "axios";

const PRODUCT_URL = "http://localhost:8080/products";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all products
export const getAdminProducts = async () => {
  const response = await axios.get(
    PRODUCT_URL,
    getAuthConfig()
  );

  return response.data;
};

// Get one product
export const getAdminProductById = async (id) => {
  const response = await axios.get(
    `${PRODUCT_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Create product
export const createProduct = async (product) => {
  const response = await axios.post(
    PRODUCT_URL,
    product,
    getAuthConfig()
  );

  return response.data;
};

// Update product
export const updateProduct = async (id, product) => {
  const response = await axios.put(
    `${PRODUCT_URL}/${id}`,
    product,
    getAuthConfig()
  );

  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${PRODUCT_URL}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// =====================================================
// INCREASE STOCK
// =====================================================

export const increaseStock = async (id, quantity = 1) => {
  const response = await axios.put(
    `${PRODUCT_URL}/${id}/increase-stock`,
    null,
    {
      ...getAuthConfig(),
      params: {
        quantity,
      },
    }
  );

  return response.data;
};

// =====================================================
// DECREASE STOCK
// =====================================================

export const decreaseStock = async (id, quantity = 1) => {
  const response = await axios.put(
    `${PRODUCT_URL}/${id}/decrease-stock`,
    null,
    {
      ...getAuthConfig(),
      params: {
        quantity,
      },
    }
  );

  return response.data;
};