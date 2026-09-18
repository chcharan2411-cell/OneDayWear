import axios from "axios";

const WISHLIST_URL = "http://localhost:8087/wishlist";

export const getWishlist = async (userEmail) => {
  const response = await axios.get(WISHLIST_URL, {
    params: {
      userEmail,
    },
  });

  return response.data;
};

export const addToWishlist = async (userEmail, productId) => {
  const response = await axios.post(
    WISHLIST_URL,
    {
      productId,
    },
    {
      params: {
        userEmail,
      },
    }
  );

  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await axios.delete(
    `${WISHLIST_URL}/${wishlistId}`
  );

  return response.data;
};

export const clearWishlist = async (userEmail) => {
  const response = await axios.delete(`${WISHLIST_URL}/clear`, {
    params: {
      userEmail,
    },
  });

  return response.data;
};

export const getWishlistCount = async () => {
  const response = await axios.get(`${WISHLIST_URL}/count`);

  return response.data;
};