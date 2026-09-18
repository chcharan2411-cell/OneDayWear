import axios from "axios";

const INVENTORY_URL = "http://localhost:8080/inventory/admin/all";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all inventory
export const getAdminInventory = async () => {
  const response = await axios.get(
    INVENTORY_URL,
    getAuthConfig()
  );

  return response.data;
};

// Get inventory by product ID
export const getInventoryByProductId = async (productId) => {
  const response = await axios.get(
    `${INVENTORY_URL}/${productId}`,
    getAuthConfig()
  );

  return response.data;
};

// Create inventory
export const createInventory = async (inventory) => {
  const response = await axios.post(
    INVENTORY_URL,
    inventory,
    getAuthConfig()
  );

  return response.data;
};

// Update inventory
export const updateInventory = async (
  productId,
  inventory
) => {
  const response = await axios.put(
    `${INVENTORY_URL}/${productId}`,
    inventory,
    getAuthConfig()
  );

  return response.data;
};

// Deduct stock
export const deductStock = async (
  productId,
  quantity
) => {
  const response = await axios.post(
    `${INVENTORY_URL}/deduct`,
    {
      productId,
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

// Restore stock
export const restoreStock = async (
  productId,
  quantity
) => {
  const response = await axios.post(
    `${INVENTORY_URL}/restore`,
    {
      productId,
      quantity,
    },
    getAuthConfig()
  );

  return response.data;
};

// Get low-stock products
export const getLowStockProducts = async () => {
  const response = await axios.get(
    `${INVENTORY_URL}/low-stock`,
    getAuthConfig()
  );

  return response.data;
};

// Get low-stock count
export const getLowStockCount = async () => {
  const response = await axios.get(
    `${INVENTORY_URL}/low-stock/count`,
    getAuthConfig()
  );

  return response.data;
};