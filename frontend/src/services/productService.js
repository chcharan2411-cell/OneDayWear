import api from "./api";

// Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Search products by name
export const searchProducts = async (name) => {
  const response = await api.get("/products/search", {
    params: {
      name,
    },
  });

  return response.data;
};

// Get products by category
export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};