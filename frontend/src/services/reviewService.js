import axios from "axios";

const REVIEW_URL = "http://localhost:8080/reviews";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get reviews for a product
export const getReviewsByProduct = async (productId) => {
  const response = await axios.get(
    `${REVIEW_URL}/product/${productId}`
  );

  return response.data;
};

// Get average rating
export const getAverageRating = async (productId) => {
  const response = await axios.get(
    `${REVIEW_URL}/product/${productId}/average`
  );

  return response.data;
};

// Add review
export const addReview = async (productId, rating, review) => {
  const response = await axios.post(
    REVIEW_URL,
    {
      productId,
      rating,
      review,
    },
    getAuthConfig()
  );

  return response.data;
};