import axios from "axios";

const REVIEW_URL = "http://localhost:8088/reviews";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all reviews
export const getAdminReviews = async () => {
  const response = await axios.get(
    REVIEW_URL,
    getAuthConfig()
  );

  return response.data;
};

// Get reviews for one product
export const getReviewsByProduct = async (productId) => {
  const response = await axios.get(
    `${REVIEW_URL}/product/${productId}`,
    getAuthConfig()
  );

  return response.data;
};

// Get average rating
export const getAverageRating = async (productId) => {
  const response = await axios.get(
    `${REVIEW_URL}/product/${productId}/average`,
    getAuthConfig()
  );

  return response.data;
};

// Get review count
export const getReviewCount = async () => {
  const response = await axios.get(
    `${REVIEW_URL}/count`,
    getAuthConfig()
  );

  return response.data;
};

// Delete review
export const deleteReview = async (reviewId) => {
  const response = await axios.delete(
    `${REVIEW_URL}/${reviewId}`,
    getAuthConfig()
  );

  return response.data;
};