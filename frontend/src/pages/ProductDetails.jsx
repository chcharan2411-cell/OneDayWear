import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import {
  getReviewsByProduct,
  getAverageRating,
  addReview,
} from "../services/reviewService";

import "./ProductDetails.css";

import { useCart } from "../context/CartContext";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // REVIEW STATE
  // ===============================

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  // ===============================
  // LOAD PRODUCT
  // ===============================

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);

      setProduct(data);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD REVIEWS
  // ===============================

  const loadReviews = async () => {
    try {
      setReviewLoading(true);

      const [reviewsData, averageData] =
        await Promise.all([
          getReviewsByProduct(id),
          getAverageRating(id),
        ]);

      setReviews(reviewsData || []);
      setAverageRating(Number(averageData) || 0);
    } catch (err) {
      console.error("Error loading reviews:", err);

      setReviews([]);
      setAverageRating(0);
    } finally {
      setReviewLoading(false);
    }
  };

  // ===============================
  // SUBMIT REVIEW
  // ===============================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewMessage("");
    setReviewError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setReviewError(
        "Please login to write a review."
      );

      return;
    }

    if (!reviewText.trim()) {
      setReviewError(
        "Please write your review."
      );

      return;
    }

    try {
      setReviewLoading(true);

      await addReview(
        Number(id),
        rating,
        reviewText.trim()
      );

      setReviewText("");
      setRating(5);

      setReviewMessage(
        "Review submitted successfully."
      );

      // Reload reviews and average rating
      await loadReviews();
    } catch (err) {
      console.error(
        "Error submitting review:",
        err
      );

      if (err.response?.status === 401) {
        setReviewError(
          "Your session has expired. Please login again."
        );
      } else {
        setReviewError(
          err.response?.data ||
            "Unable to submit review."
        );
      }
    } finally {
      setReviewLoading(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="details-message">
          Loading product...
        </div>
      </main>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="details-message">
          {error || "Product not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      {/* =========================================
          PRODUCT DETAILS
      ========================================= */}

      <section className="product-details">

        {/* Product Image */}
        <div className="details-image">

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
            />
          ) : (
            <div className="details-no-image">
              NO IMAGE
            </div>
          )}

        </div>

        {/* Product Information */}
        <div className="details-info">

          <p className="details-brand">
            {product.brand}
          </p>

          <h1>
            {product.productName}
          </h1>

          <p className="details-category">
            {product.category === "ONE_PIECES"
              ? "ONE-PIECE"
              : product.category}
          </p>

          {/* Rating Summary */}
          <div className="product-rating-summary">

            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <=
                      Math.round(averageRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                )
              )}

            </div>

            <span>
              {averageRating.toFixed(1)}
            </span>

            <span className="rating-review-count">
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"})
            </span>

          </div>

          <div className="details-price">
            ₹{product.rentalPrice}
            <span> / day</span>
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-meta">

            <div>
              <span>SIZE</span>
              <strong>
                {product.size}
              </strong>
            </div>

            <div>
              <span>AVAILABILITY</span>

              <strong>
                {product.available
                  ? `${product.availableQuantity} IN STOCK`
                  : "OUT OF STOCK"}
              </strong>
            </div>

            <div>
              <span>
                SECURITY DEPOSIT
              </span>

              <strong>
                ₹{product.securityDeposit}
              </strong>
            </div>

          </div>

          {/* Product Actions */}

          <div className="product-actions">

            <button
              className="add-to-cart-button"
              disabled={!product.available}
              onClick={() => {

                if (!product.available) {
                  return;
                }

                addToCart(product);
                navigate("/cart");

              }}
            >
              {product.available
                ? "ADD TO CART"
                : "CURRENTLY UNAVAILABLE"}
            </button>

            <button
              className={`wishlist-button ${
                isInWishlist(product.id)
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                toggleWishlist(product)
              }
              title={
                isInWishlist(product.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >

              <Heart
                size={22}
                fill={
                  isInWishlist(product.id)
                    ? "currentColor"
                    : "none"
                }
              />

            </button>

          </div>

        </div>

      </section>


      {/* =========================================
          REVIEWS SECTION
      ========================================= */}

      <section className="product-reviews">

        <div className="reviews-header">

          <div>
            <p className="reviews-eyebrow">
              CUSTOMER EXPERIENCE
            </p>

            <h2>
              REVIEWS
            </h2>
          </div>

          <div className="reviews-overall">

            <strong>
              {averageRating.toFixed(1)}
            </strong>

            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <=
                      Math.round(averageRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                )
              )}

            </div>

            <span>
              {reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"}
            </span>

          </div>

        </div>


        {/* =====================================
            WRITE REVIEW
        ===================================== */}

        <div className="write-review">

          <h3>
            WRITE A REVIEW
          </h3>

          <form
            onSubmit={handleSubmitReview}
          >

            <div className="review-rating-selector">

              <span>
                YOUR RATING
              </span>

              <div>

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      type="button"
                      key={star}
                      className={
                        star <= rating
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      <Star
                        size={24}
                        fill={
                          star <= rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  )
                )}

              </div>

            </div>


            <textarea
              value={reviewText}
              onChange={(e) =>
                setReviewText(
                  e.target.value
                )
              }
              placeholder="Share your experience with this outfit..."
              rows={5}
              maxLength={500}
            />


            <div className="review-form-bottom">

              <span>
                {reviewText.length}/500
              </span>

              <button
                type="submit"
                disabled={reviewLoading}
              >
                {reviewLoading
                  ? "SUBMITTING..."
                  : "SUBMIT REVIEW"}
              </button>

            </div>

          </form>

          {reviewMessage && (
            <p className="review-success">
              {reviewMessage}
            </p>
          )}

          {reviewError && (
            <p className="review-error">
              {reviewError}
            </p>
          )}

        </div>


        {/* =====================================
            EXISTING REVIEWS
        ===================================== */}

        <div className="reviews-list">

          <h3>
            CUSTOMER REVIEWS
          </h3>

          {reviewLoading &&
          reviews.length === 0 ? (
            <p className="reviews-empty">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p className="reviews-empty">
              No reviews yet. Be the first to
              review this outfit.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                className="review-card"
                key={review.reviewId}
              >

                <div className="review-card-top">

                  <div>

                    <strong>
                      {review.userEmail}
                    </strong>

                    <div className="rating-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={15}
                            fill={
                              star <=
                              review.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        )
                      )}

                    </div>

                  </div>

                  <span>
                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : ""}
                  </span>

                </div>

                <p>
                  {review.review}
                </p>

              </article>
            ))
          )}

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;